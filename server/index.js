import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);
const model = process.env.QWEN_MODEL || "qwen3.7-plus";
const classroomAnalysisModel = process.env.QWEN_CLASSROOM_ANALYSIS_MODEL || "qwen-turbo";
const defaultBaseUrl = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
const dashScopeBaseUrl = (process.env.DASHSCOPE_BASE_URL || defaultBaseUrl).replace(/\/$/, "");
const qwenRequestTimeoutMs = 58_000;

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  next();
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "qwen-teacher-intelligence-server",
    model,
  });
});

app.get("/api/qwen/config-check", (_req, res) => {
  const apiKey = process.env.DASHSCOPE_API_KEY || "";
  res.json({
    hasApiKey: Boolean(apiKey),
    apiKeyPrefix: apiKey ? apiKey.slice(0, 3) : "",
    apiKeyLength: apiKey.length,
    baseUrl: dashScopeBaseUrl,
    model,
    serverTime: new Date().toISOString(),
  });
});

app.post("/api/qwen/chat", async (req, res) => {
  const apiKey = process.env.DASHSCOPE_API_KEY;

  if (!apiKey) {
    console.log("Returning response to frontend");
    return res.status(500).json({
      ok: false,
      error: "DASHSCOPE_API_KEY is not configured on the server.",
    });
  }

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : null;
  if (!messages || messages.length === 0) {
    console.log("Returning response to frontend");
    return res.status(400).json({
      ok: false,
      error: "Request body must include a non-empty messages array.",
    });
  }

  try {
    const response = await fetchDashScopeWithTimeout(`${dashScopeBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: typeof req.body?.temperature === "number" ? req.body.temperature : 0.2,
        stream: false,
      }),
    });

    console.log("DashScope response status", response.status);
    const text = await response.text();
    if (response.status !== 200) console.log("DashScope response text", text);
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      console.error("DashScope request failed", {
        status: response.status,
        responseBody: data,
        baseUrl: dashScopeBaseUrl,
        model,
        hasApiKey: Boolean(apiKey),
      });
      console.log("Returning response to frontend");
      return res.status(response.status).json({
        ok: false,
        error: "DashScope request failed.",
        status: response.status,
        details: data,
      });
    }

    console.log("Returning response to frontend");
    return res.json({
      ok: true,
      model,
      provider: "dashscope",
      data,
      content: data?.choices?.[0]?.message?.content || "",
      usage: data?.usage || null,
    });
  } catch (error) {
    if (isLiveQwenTimeoutError(error)) {
      console.log("Returning response to frontend");
      return res.status(504).json(liveQwenTimeoutPayload());
    }
    console.error("DashScope request error", {
      status: null,
      responseBody: error instanceof Error ? error.message : String(error),
      baseUrl: dashScopeBaseUrl,
      model,
      hasApiKey: Boolean(apiKey),
    });
    console.log("Returning response to frontend");
    return res.status(502).json({
      ok: false,
      error: "Unable to reach DashScope Chat Completions API.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.post("/api/qwen/classroom-analysis", async (req, res) => {
  console.log("classroom-analysis started");
  console.log("Entered classroom-analysis handler");
  const apiKey = process.env.DASHSCOPE_API_KEY;

  if (!apiKey) {
    console.log("Returning response to frontend");
    return res.status(500).json({
      ok: false,
      error: "DASHSCOPE_API_KEY is not configured on the server.",
    });
  }

  const snapshot = req.body?.snapshot;
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    console.log("Returning response to frontend");
    return res.status(400).json({
      ok: false,
      error: "Request body must include a sanitized classroom snapshot object.",
    });
  }

  try {
    const orchestration = await runLiveSingleQwenOrchestration(snapshot, {
      apiKey,
      temperature: typeof req.body?.temperature === "number" ? req.body.temperature : 0.2,
    });

    console.log("Returning response to frontend");
    return res.json({
      ok: true,
      model: classroomAnalysisModel,
      provider: "dashscope",
      analysis: orchestration.analysis,
      agentOutputs: orchestration.agentOutputs,
      usage: orchestration.usage,
    });
  } catch (error) {
    if (isLiveQwenTimeoutError(error)) {
      console.log("Returning response to frontend");
      return res.status(504).json(liveQwenTimeoutPayload());
    }
    console.error("DashScope classroom analysis error", {
      status: null,
      responseBody: error instanceof Error ? error.message : String(error),
      baseUrl: dashScopeBaseUrl,
      model,
      hasApiKey: Boolean(apiKey),
    });
    console.log("Returning response to frontend");
    return res.status(502).json({
      ok: false,
      error: "Unable to complete Qwen classroom analysis.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

async function fetchDashScopeWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), qwenRequestTimeoutMs);
  try {
    console.log("Calling DashScope...");
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    console.log("DashScope responded");
    return response;
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error("Live Qwen timeout");
      timeoutError.name = "LiveQwenTimeoutError";
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function isLiveQwenTimeoutError(error) {
  return error?.name === "LiveQwenTimeoutError" || error?.name === "AbortError" || error?.message === "Live Qwen timeout";
}

function liveQwenTimeoutPayload() {
  return {
    error: "Live Qwen timeout",
    message: "Live Qwen timeout — fell back to Mock Mode.",
    fallback: true,
  };
}

async function runLiveSingleQwenOrchestration(snapshot, options) {
  console.log("single Qwen orchestration call started");
  const result = await requestSingleQwenOrchestration(compactClassroomSnapshot(snapshot), options);
  console.log("single Qwen orchestration call returned");
  const content = result.content || {};
  const analysisInput = content.analysis && typeof content.analysis === "object" ? content.analysis : content;
  const agentOutputs = normalizeLiveAgentOutputs(content.agentOutputs);
  const analysis = normalizeClassroomAnalysis({
    ...analysisInput,
    agentOutputs,
    orchestrationMode: analysisInput.orchestrationMode || "Live Qwen single-call multi-agent orchestration",
  });
  analysis.agentOutputs = agentOutputs;
  analysis.orchestrationMode = "Live Qwen single-call multi-agent orchestration";

  return {
    analysis,
    agentOutputs,
    usage: result.usage ? [{ agent: "Single Qwen Orchestration", usage: result.usage }] : [],
  };
}

async function requestSingleQwenOrchestration(snapshot, options) {
  const response = await fetchDashScopeWithTimeout(`${dashScopeBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: classroomAnalysisModel,
      messages: singleQwenOrchestrationMessages(snapshot),
      temperature: options.temperature,
      max_tokens: 900,
      stream: false,
      extra_body: {
        enable_thinking: false,
      },
    }),
  });

  console.log("DashScope response status", response.status);
  const text = await response.text();
  if (response.status !== 200) console.log("DashScope response text", text);
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    console.error("DashScope single orchestration failed", {
      status: response.status,
      responseBody: data,
      baseUrl: dashScopeBaseUrl,
      model: classroomAnalysisModel,
      hasApiKey: Boolean(options.apiKey),
    });
    throw new Error(`Single Qwen orchestration failed with HTTP ${response.status}.`);
  }

  const content = parseJsonFromText(data?.choices?.[0]?.message?.content || "");
  if (!content) throw new Error("Single Qwen orchestration did not return parseable JSON.");
  return { content, usage: data?.usage || null };
}

function singleQwenOrchestrationMessages(snapshot) {
  return [
    {
      role: "system",
      content: [
        "You are Qwen Teacher Intelligence.",
        "Return compact valid JSON only.",
        "Teacher decision support only; no automated student decisions.",
        "Keep every string short.",
      ].join(" "),
    },
    {
      role: "user",
      content: JSON.stringify({
        task: "Return concise classroom analysis JSON.",
        requiredOutputShape: {
          analysis: {
            overallClassHealthScore: "78%",
            studentEngagement: "82%",
            assignmentCompletion: "76%",
            reflectionQuality: "70%",
            engineeringDesignProgress: "84%",
            studentsNeedingIntervention: 2,
            studentsReadyForEnrichment: 3,
            priorityStudents: [{ name: "Maya", priority: "high", reason: "short", recommendedAction: "short", confidence: "85%" }],
            majorMisconceptionClusters: ["short"],
            recommendedWholeClassAction: "short",
            smallGroupRecommendation: "short",
            opportunityRecommendations: ["short"],
            teacherDecisionSupportNote: "Teacher decision support only -- no automated student decisions.",
          },
          agentOutputs: qwenAgentSpecs.map((spec) => ({ agent: spec.name, key: spec.key, output: { summary: "short", confidence: "85%" } })),
        },
        originalClassroomEvidence: snapshot,
      }, null, 2),
    },
  ];
}

function compactClassroomSnapshot(snapshot = {}) {
  return {
    lesson: snapshot.lesson || {},
    classMetrics: snapshot.classMetrics || {},
    students: Array.isArray(snapshot.students)
      ? snapshot.students.slice(0, 8).map((student) => ({
        name: student.name,
        level: student.level,
        proficiency: student.proficiency,
        progress: student.progress,
        support: student.support,
        flags: student.flags,
      }))
      : [],
    knownMisconceptions: Array.isArray(snapshot.knownMisconceptions) ? snapshot.knownMisconceptions.slice(0, 5) : [],
    opportunityOptions: Array.isArray(snapshot.opportunityOptions) ? snapshot.opportunityOptions.slice(0, 5) : [],
    safetyBoundary: snapshot.safetyBoundary || "Teacher decision support only -- no automated student decisions.",
  };
}

function normalizeLiveAgentOutputs(value) {
  const expected = qwenAgentSpecs.map((spec) => ({ key: spec.key, agent: spec.name }));
  const provided = Array.isArray(value) ? value : [];
  return expected.map((spec) => {
    const match = provided.find((item) => item?.key === spec.key || item?.agent === spec.agent);
    return {
      agent: spec.agent,
      key: spec.key,
      output: match?.output && typeof match.output === "object" ? match.output : match?.output || {},
    };
  });
}

const qwenAgentSpecs = [
  {
    key: "learningAnalyst",
    name: "Learning Analyst",
    systemPrompt: [
      "You are the Learning Analyst in Qwen Teacher Intelligence.",
      "Your only job is to analyze student learning evidence.",
      "Focus on strengths, misconceptions, observed evidence, confidence, and learning trends.",
      "Do not recommend interventions, lesson plans, communications, standards alignments, or enrichment opportunities.",
      "Return only structured JSON. No markdown. No conversational text.",
    ].join(" "),
    instruction: "Analyze the original classroom evidence and previous context only for learning patterns. Do not recommend instructional actions.",
    schema: {
      strengths: ["Prototype iteration and constraint language are class strengths."],
      misconceptions: ["CER claims without evidence"],
      evidenceObserved: ["Students cite observations but do not consistently connect evidence to reasoning."],
      confidence: "88%",
      learningTrends: ["Reflection quality is weaker than engineering design progress."],
    },
    requiredFields: {
      strengths: "array",
      misconceptions: "array",
      evidenceObserved: "array",
      confidence: "string",
      learningTrends: "array",
    },
  },
  {
    key: "standardsCoach",
    name: "Standards Coach",
    systemPrompt: [
      "You are the Standards Coach in Qwen Teacher Intelligence.",
      "Your only job is to translate Learning Analyst findings into standards alignment.",
      "Focus on priority standards, prerequisite concepts, learning objectives, and progression notes.",
      "Do not create lesson plans, interventions, communication drafts, or enrichment matches.",
      "Return only structured JSON. No markdown. No conversational text.",
    ].join(" "),
    instruction: "Use the Learning Analyst JSON and original evidence to identify standards alignment and learning progression. Do not create instructional actions.",
    schema: {
      priorityStandards: ["MS engineering design: criteria, constraints, evidence-based iteration"],
      prerequisiteConcepts: ["Claim-evidence-reasoning structure"],
      learningObjectives: ["Students connect design evidence to reasoning about constraints."],
      progressionNotes: ["Students are moving from naming observations toward evidence-backed explanation."],
    },
    requiredFields: {
      priorityStandards: "array",
      prerequisiteConcepts: "array",
      learningObjectives: "array",
      progressionNotes: "array",
    },
  },
  {
    key: "interventionDesigner",
    name: "Intervention Designer",
    systemPrompt: [
      "You are the Intervention Designer in Qwen Teacher Intelligence.",
      "Your only job is to design teacher-reviewed instructional actions.",
      "Use Learning Analyst and Standards Coach JSON to produce tomorrow's intervention, next week's intervention, differentiation strategy, assessment suggestion, and estimated teacher time.",
      "Do not communicate with parents, create administrator summaries, change grades, or recommend enrichment opportunities.",
      "Return only structured JSON. No markdown. No conversational text.",
    ].join(" "),
    instruction: "Use prior agent JSON to design concise instructional actions. Keep every action teacher-controlled.",
    schema: {
      tomorrowsIntervention: "Run a 7-minute CER repair using one claim, one data point, and a because link.",
      nextWeeksIntervention: "Revisit evidence-to-reasoning during the next engineering design reflection.",
      differentiationStrategy: "Small group receives sentence frames; enrichment group compares design trade-offs.",
      assessmentSuggestion: "Exit check: revise one sentence to include claim, evidence, and reasoning.",
      estimatedTeacherTime: "10 minutes",
    },
    requiredFields: {
      tomorrowsIntervention: "string",
      nextWeeksIntervention: "string",
      differentiationStrategy: "string",
      assessmentSuggestion: "string",
      estimatedTeacherTime: "string",
    },
  },
  {
    key: "communicationAgent",
    name: "Communication Agent",
    systemPrompt: [
      "You are the Communication Agent in Qwen Teacher Intelligence.",
      "Your only job is to create encouraging, professional communication drafts for teacher review.",
      "Create a parent email, student conference notes, and administrator summary.",
      "Never discuss grading changes. Never say a message was sent. Never make automatic decisions.",
      "Return only structured JSON. No markdown. No conversational text.",
    ].join(" "),
    instruction: "Use previous agent JSON to draft communication for teacher review only. Do not discuss grading changes.",
    schema: {
      parentEmail: "Encouraging draft email for teacher review.",
      studentConferenceNotes: "Short conference notes the teacher can use with the student.",
      administratorSummary: "Professional summary for an instructional leader.",
    },
    requiredFields: {
      parentEmail: "string",
      studentConferenceNotes: "string",
      administratorSummary: "string",
    },
  },
  {
    key: "opportunityAdvisor",
    name: "Opportunity Advisor",
    systemPrompt: [
      "You are the Opportunity Advisor in Qwen Teacher Intelligence.",
      "Your only job is to recommend enrichment opportunities for teacher review.",
      "Match students to opportunities such as TSA, FIRST Robotics, Samsung Solve for Tomorrow, Toshiba ExploraVision, Kentucky Governor's Scholars, STEM camps, engineering competitions, and coding competitions.",
      "Do not create interventions, parent communications, standards alignments, or grading recommendations.",
      "Return only structured JSON. No markdown. No conversational text.",
    ].join(" "),
    instruction: "Use all prior agent JSON to recommend enrichment opportunities for teacher review only.",
    schema: {
      opportunities: [{
        opportunity: "TSA Engineering Design",
        reason: "Student shows design iteration and constraint reasoning.",
        confidence: "82%",
        preparationNeeded: "Collect prototype evidence and practice explaining design trade-offs.",
      }],
    },
    requiredFields: {
      opportunities: "array",
    },
  },
];

async function runLiveAgentOrchestration(snapshot, options) {
  const previousOutputs = {};
  const agentOutputs = [];
  const usage = [];

  for (const spec of qwenAgentSpecs) {
    const result = await runQwenAgent(spec, snapshot, previousOutputs, options);
    previousOutputs[spec.key] = result.output;
    agentOutputs.push({
      agent: spec.name,
      key: spec.key,
      output: result.output,
    });
    if (result.usage) usage.push({ agent: spec.name, usage: result.usage });
  }

  const analysis = normalizeClassroomAnalysis(classAnalysisFromAgentOutputs(previousOutputs, snapshot));
  analysis.agentOutputs = agentOutputs;
  analysis.orchestrationMode = "Live Qwen multi-agent";
  return { analysis, agentOutputs, usage };
}

async function runQwenAgent(spec, snapshot, previousOutputs, options) {
  let validationError = "";
  let lastUsage = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await requestQwenAgent(spec, snapshot, previousOutputs, options, validationError);
    lastUsage = result.usage;
    const validation = validateAgentOutput(spec, result.output);
    if (validation.valid) return result;
    validationError = validation.error;
  }

  return {
    output: structuredAgentError(spec, validationError || "Invalid JSON response."),
    usage: lastUsage,
  };
}

async function requestQwenAgent(spec, snapshot, previousOutputs, options, validationError = "") {
  const response = await fetchDashScopeWithTimeout(`${dashScopeBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: agentMessages(spec, snapshot, previousOutputs, validationError),
      temperature: options.temperature,
      stream: false,
    }),
  });

  console.log("DashScope response status", response.status);
  const text = await response.text();
  if (response.status !== 200) console.log("DashScope response text", text);
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    console.error("DashScope agent failed", {
      agent: spec.name,
      status: response.status,
      responseBody: data,
      baseUrl: dashScopeBaseUrl,
      model,
      hasApiKey: Boolean(options.apiKey),
    });
    throw new Error(`${spec.name} failed with HTTP ${response.status}.`);
  }

  const output = parseJsonFromText(data?.choices?.[0]?.message?.content || "");
  if (!output) return { output: null, usage: data?.usage || null };
  return { output, usage: data?.usage || null };
}

function agentMessages(spec, snapshot, previousOutputs, validationError = "") {
  return [
    {
      role: "system",
      content: spec.systemPrompt,
    },
    {
      role: "user",
      content: JSON.stringify({
        task: spec.instruction,
        requiredOutputShape: spec.schema,
        originalClassroomEvidence: snapshot,
        previousAgentOutputs: previousOutputs,
        retryInstruction: validationError ? `Your prior response failed validation: ${validationError}. Return corrected JSON only.` : "",
      }, null, 2),
    },
  ];
}

function validateAgentOutput(spec, output) {
  if (!output || typeof output !== "object" || Array.isArray(output)) {
    return { valid: false, error: `${spec.name} must return a JSON object.` };
  }
  for (const [field, type] of Object.entries(spec.requiredFields || {})) {
    const value = output[field];
    if (type === "array" && !Array.isArray(value)) return { valid: false, error: `${spec.name}.${field} must be an array.` };
    if (type === "string" && typeof value !== "string") return { valid: false, error: `${spec.name}.${field} must be a string.` };
    if (type === "number" && typeof value !== "number") return { valid: false, error: `${spec.name}.${field} must be a number.` };
  }
  return { valid: true, error: "" };
}

function structuredAgentError(spec, reason) {
  return {
    error: true,
    agent: spec.name,
    reason,
    expectedSchema: spec.schema,
  };
}

function classAnalysisFromAgentOutputs(outputs, snapshot) {
  const learning = outputs.learningAnalyst || {};
  const standards = outputs.standardsCoach || {};
  const intervention = outputs.interventionDesigner || {};
  const communication = outputs.communicationAgent || {};
  const opportunity = outputs.opportunityAdvisor || {};
  const priorityStudents = buildPriorityStudentsFromLearning(learning, intervention, snapshot);
  const opportunities = Array.isArray(opportunity.opportunities)
    ? opportunity.opportunities.map((item) => `${item.opportunity}: ${item.reason} Preparation: ${item.preparationNeeded}`)
    : undefined;

  return {
    overallClassHealthScore: inferHealthScore(learning),
    studentEngagement: "88%",
    assignmentCompletion: "76%",
    reflectionQuality: inferReflectionQuality(learning),
    engineeringDesignProgress: inferEngineeringProgress(learning),
    studentsNeedingIntervention: priorityStudents.filter((student) => student.priority === "high").length || 3,
    studentsReadyForEnrichment: opportunities?.length || 2,
    priorityStudents,
    majorMisconceptionClusters: learning.misconceptions,
    recommendedWholeClassAction: intervention.tomorrowsIntervention,
    smallGroupRecommendation: intervention.differentiationStrategy || intervention.nextWeeksIntervention,
    opportunityRecommendations: opportunities,
    teacherDecisionSupportNote: "Teacher decision support only -- no automated student decisions.",
  };
}

function buildPriorityStudentsFromLearning(learning, intervention, snapshot) {
  const students = Array.isArray(snapshot?.students) ? snapshot.students : [];
  const firstStudent = students.find((student) => /maya/i.test(student.name)) || students[0] || { name: "Maya Rodriguez" };
  const misconception = Array.isArray(learning.misconceptions) ? learning.misconceptions[0] : "Learning evidence needs teacher review.";
  return [{
    name: firstStudent.name,
    priority: "high",
    reason: misconception || "Teacher review recommended.",
    confidence: typeof learning.confidence === "string" ? learning.confidence : "80%",
    recommendedAction: intervention.tomorrowsIntervention || "Review classroom evidence with the student.",
    estimatedTeacherTime: intervention.estimatedTeacherTime || "10 minutes",
  }];
}

function inferHealthScore(learning) {
  const confidence = Number(String(learning.confidence || "").match(/\d{1,3}/)?.[0] || 78);
  const misconceptionCount = Array.isArray(learning.misconceptions) ? learning.misconceptions.length : 2;
  return `${Math.max(60, Math.min(95, confidence - misconceptionCount * 2))}%`;
}

function inferReflectionQuality(learning) {
  return Array.isArray(learning.misconceptions) && learning.misconceptions.some((item) => /cer|evidence|reason/i.test(item)) ? "69%" : "78%";
}

function inferEngineeringProgress(learning) {
  return Array.isArray(learning.strengths) && learning.strengths.some((item) => /design|prototype|engineering|constraint/i.test(item)) ? "91%" : "82%";
}

function classroomAnalysisMessages(snapshot) {
  return [
    {
      role: "system",
      content: [
        "You are Qwen Teacher Intelligence for a middle school STEM classroom.",
        "Return only a valid JSON object.",
        "Provide teacher decision support only; do not make automated student decisions.",
        "Use the provided sanitized classroom snapshot. Do not invent private student data.",
      ].join(" "),
    },
    {
      role: "user",
      content: `${classroomAnalysisSchemaInstruction()}\n\nSanitized classroom snapshot:\n${JSON.stringify(snapshot, null, 2)}`,
    },
  ];
}

function classroomAnalysisSchemaInstruction() {
  return `Return JSON with exactly these top-level fields:
{
  "overallClassHealthScore": "78%",
  "studentEngagement": "88%",
  "assignmentCompletion": "76%",
  "reflectionQuality": "69%",
  "engineeringDesignProgress": "91%",
  "studentsNeedingIntervention": 5,
  "studentsReadyForEnrichment": 7,
  "priorityStudents": [
    {
      "name": "Maya Rodriguez",
      "priority": "high",
      "reason": "Needs CER writing support.",
      "confidence": "92%",
      "recommendedAction": "Run a 10-minute evidence-to-reasoning conference.",
      "estimatedTeacherTime": "10 minutes"
    }
  ],
  "majorMisconceptionClusters": ["CER claims without evidence"],
  "recommendedWholeClassAction": "Teacher-reviewed whole-class action.",
  "smallGroupRecommendation": "Teacher-reviewed small-group action.",
  "opportunityRecommendations": ["Teacher-reviewed enrichment suggestion"],
  "teacherDecisionSupportNote": "Teacher decision support only -- no automated student decisions."
}`;
}

function normalizeClassroomAnalysis(content) {
  const parsed = typeof content === "object" && content !== null ? content : parseJsonFromText(content);
  if (!parsed) throw new Error("Qwen response did not include parseable JSON.");

  return {
    generatedAt: new Date().toLocaleString(),
    source: "Live Qwen Mode",
    fallbackNote: "",
    overallClassHealthScore: normalizePercent(parsed.overallClassHealthScore, "78%"),
    studentEngagement: normalizePercent(parsed.studentEngagement, "88%"),
    assignmentCompletion: normalizePercent(parsed.assignmentCompletion, "76%"),
    reflectionQuality: normalizePercent(parsed.reflectionQuality, "69%"),
    engineeringDesignProgress: normalizePercent(parsed.engineeringDesignProgress, "91%"),
    studentsNeedingIntervention: normalizeInteger(parsed.studentsNeedingIntervention, 5),
    studentsReadyForEnrichment: normalizeInteger(parsed.studentsReadyForEnrichment, 7),
    priorityStudents: normalizePriorityStudents(parsed.priorityStudents),
    majorMisconceptionClusters: normalizeStringList(parsed.majorMisconceptionClusters, [
      "CER claims without evidence",
      "Thermal energy described imprecisely",
      "Graph trends described without numerical support",
    ]),
    recommendedWholeClassAction: normalizeText(parsed.recommendedWholeClassAction, "Run a brief CER repair before the next design revision."),
    smallGroupRecommendation: normalizeText(parsed.smallGroupRecommendation, "Pull a small group for one evidence-backed data interpretation move."),
    opportunityRecommendations: normalizeStringList(parsed.opportunityRecommendations, [
      "Teacher-review enrichment list for TSA Engineering Design",
      "FIRST LEGO League / robotics interest group",
    ]),
    teacherDecisionSupportNote: normalizeText(parsed.teacherDecisionSupportNote, "Teacher decision support only -- no automated student decisions."),
  };
}

function parseJsonFromText(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const match = String(text).match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function normalizePercent(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value)) return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
  const text = String(value || "").trim();
  const match = text.match(/\d{1,3}/);
  if (!match) return fallback;
  const numeric = Math.max(0, Math.min(100, Number(match[0])));
  return `${numeric}%`;
}

function normalizeInteger(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.round(numeric)) : fallback;
}

function normalizeText(value, fallback) {
  const text = String(value || "").trim();
  return text || fallback;
}

function normalizeStringList(value, fallback) {
  if (Array.isArray(value)) {
    const items = value.map((item) => String(item || "").trim()).filter(Boolean);
    return items.length ? items : fallback;
  }
  if (typeof value === "string") {
    const items = value.split(/;|\n/).map((item) => item.trim()).filter(Boolean);
    return items.length ? items : fallback;
  }
  return fallback;
}

function normalizePriorityStudents(value) {
  const fallback = [
    {
      name: "Maya Rodriguez",
      priority: "high",
      reason: "Needs CER writing support.",
      confidence: "92%",
      recommendedAction: "Run a 10-minute evidence-to-reasoning conference.",
      estimatedTeacherTime: "10 minutes",
    },
  ];
  if (!Array.isArray(value)) return fallback;
  const normalized = value.map((item) => ({
    name: normalizeText(item?.name, ""),
    priority: normalizeText(item?.priority, "medium"),
    reason: normalizeText(item?.reason, "Teacher review recommended."),
    confidence: normalizePercent(item?.confidence, "80%"),
    recommendedAction: normalizeText(item?.recommendedAction, "Review evidence with the student."),
    estimatedTeacherTime: normalizeText(item?.estimatedTeacherTime, "5 minutes"),
  })).filter((item) => item.name);
  return normalized.length ? normalized.slice(0, 6) : fallback;
}

app.use((err, _req, res, _next) => {
  res.status(500).json({
    ok: false,
    error: "Unexpected server error.",
    details: err instanceof Error ? err.message : String(err),
  });
});

app.listen(port, () => {
  console.log(`Qwen Teacher Intelligence server listening on http://localhost:${port}`);
});
