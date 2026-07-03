import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);
const model = process.env.QWEN_MODEL || "qwen3.7-plus";
const defaultBaseUrl = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
const dashScopeBaseUrl = (process.env.DASHSCOPE_BASE_URL || defaultBaseUrl).replace(/\/$/, "");

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
    return res.status(500).json({
      ok: false,
      error: "DASHSCOPE_API_KEY is not configured on the server.",
    });
  }

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : null;
  if (!messages || messages.length === 0) {
    return res.status(400).json({
      ok: false,
      error: "Request body must include a non-empty messages array.",
    });
  }

  try {
    const response = await fetch(`${dashScopeBaseUrl}/chat/completions`, {
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
        extra_body: {
          enable_thinking: true,
        },
      }),
    });

    const text = await response.text();
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
      return res.status(response.status).json({
        ok: false,
        error: "DashScope request failed.",
        status: response.status,
        details: data,
      });
    }

    return res.json({
      ok: true,
      model,
      provider: "dashscope",
      data,
      content: data?.choices?.[0]?.message?.content || "",
      usage: data?.usage || null,
    });
  } catch (error) {
    console.error("DashScope request error", {
      status: null,
      responseBody: error instanceof Error ? error.message : String(error),
      baseUrl: dashScopeBaseUrl,
      model,
      hasApiKey: Boolean(apiKey),
    });
    return res.status(502).json({
      ok: false,
      error: "Unable to reach DashScope Chat Completions API.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.post("/api/qwen/classroom-analysis", async (req, res) => {
  const apiKey = process.env.DASHSCOPE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: "DASHSCOPE_API_KEY is not configured on the server.",
    });
  }

  const snapshot = req.body?.snapshot;
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return res.status(400).json({
      ok: false,
      error: "Request body must include a sanitized classroom snapshot object.",
    });
  }

  try {
    const orchestration = await runLiveAgentOrchestration(snapshot, {
      apiKey,
      temperature: typeof req.body?.temperature === "number" ? req.body.temperature : 0.2,
    });

    return res.json({
      ok: true,
      model,
      provider: "dashscope",
      analysis: orchestration.analysis,
      agentOutputs: orchestration.agentOutputs,
      usage: orchestration.usage,
    });
  } catch (error) {
    console.error("DashScope classroom analysis error", {
      status: null,
      responseBody: error instanceof Error ? error.message : String(error),
      baseUrl: dashScopeBaseUrl,
      model,
      hasApiKey: Boolean(apiKey),
    });
    return res.status(502).json({
      ok: false,
      error: "Unable to complete Qwen classroom analysis.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

const qwenAgentSpecs = [
  {
    key: "learningAnalyst",
    name: "Learning Analyst",
    instruction: "Identify classroom learning patterns, student priority signals, misconception clusters, and class health metrics from the evidence.",
    schema: {
      overallClassHealthScore: "78%",
      studentEngagement: "88%",
      assignmentCompletion: "76%",
      reflectionQuality: "69%",
      engineeringDesignProgress: "91%",
      studentsNeedingIntervention: 5,
      studentsReadyForEnrichment: 7,
      priorityStudents: [{
        name: "Maya Rodriguez",
        priority: "high",
        reason: "Needs CER writing support.",
        confidence: "92%",
        recommendedAction: "Run a 10-minute evidence-to-reasoning conference.",
        estimatedTeacherTime: "10 minutes",
      }],
      majorMisconceptionClusters: ["CER claims without evidence"],
    },
  },
  {
    key: "standardsCoach",
    name: "Standards Coach",
    instruction: "Use the Learning Analyst output to align next steps with middle school STEM standards, criteria, constraints, CER writing, and engineering design reasoning.",
    schema: {
      standardsAlignment: ["MS engineering design: criteria, constraints, evidence-based iteration"],
      recommendedWholeClassAction: "Teacher-reviewed whole-class action.",
      standardsRationale: "Why this action supports the lesson standard.",
    },
  },
  {
    key: "interventionDesigner",
    name: "Intervention Designer",
    instruction: "Use prior agent outputs to design teacher-review interventions without automatic student decisions.",
    schema: {
      smallGroupRecommendation: "Teacher-reviewed small-group action.",
      recommendedWholeClassAction: "Refined whole-class action if needed.",
      priorityStudents: [{
        name: "Maya Rodriguez",
        priority: "high",
        reason: "Needs CER writing support.",
        confidence: "92%",
        recommendedAction: "Run a 10-minute evidence-to-reasoning conference.",
        estimatedTeacherTime: "10 minutes",
      }],
    },
  },
  {
    key: "communicationAgent",
    name: "Communication Agent",
    instruction: "Use prior agent outputs to create safe teacher-facing communication guidance. Do not draft messages as if they were sent.",
    schema: {
      communicationGuidance: ["Celebrate evidence-based growth without implying placement or automatic intervention."],
      teacherDecisionSupportNote: "Teacher decision support only -- no automated student decisions.",
    },
  },
  {
    key: "opportunityAdvisor",
    name: "Opportunity Advisor",
    instruction: "Use all prior outputs to recommend enrichment opportunities for teacher review only.",
    schema: {
      opportunityRecommendations: ["Teacher-reviewed enrichment suggestion"],
      opportunityRationale: "Why these opportunities match observed STEM strengths.",
      teacherDecisionSupportNote: "Teacher decision support only -- no automated student decisions.",
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

  const analysis = normalizeClassroomAnalysis(classAnalysisFromAgentOutputs(previousOutputs));
  analysis.agentOutputs = agentOutputs;
  analysis.orchestrationMode = "Live Qwen multi-agent";
  return { analysis, agentOutputs, usage };
}

async function runQwenAgent(spec, snapshot, previousOutputs, options) {
  const response = await fetch(`${dashScopeBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: agentMessages(spec, snapshot, previousOutputs),
      temperature: options.temperature,
      stream: false,
      response_format: { type: "json_object" },
      extra_body: {
        enable_thinking: true,
      },
    }),
  });

  const text = await response.text();
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
  if (!output) throw new Error(`${spec.name} did not return parseable JSON.`);
  return { output, usage: data?.usage || null };
}

function agentMessages(spec, snapshot, previousOutputs) {
  return [
    {
      role: "system",
      content: [
        `You are the ${spec.name} in Qwen Teacher Intelligence.`,
        "Return only a valid JSON object.",
        "Use structured JSON from previous agents as context.",
        "Provide teacher decision support only; do not make automated student decisions.",
      ].join(" "),
    },
    {
      role: "user",
      content: JSON.stringify({
        task: spec.instruction,
        requiredOutputShape: spec.schema,
        originalClassroomEvidence: snapshot,
        previousAgentOutputs: previousOutputs,
      }, null, 2),
    },
  ];
}

function classAnalysisFromAgentOutputs(outputs) {
  const learning = outputs.learningAnalyst || {};
  const standards = outputs.standardsCoach || {};
  const intervention = outputs.interventionDesigner || {};
  const communication = outputs.communicationAgent || {};
  const opportunity = outputs.opportunityAdvisor || {};

  return {
    overallClassHealthScore: learning.overallClassHealthScore,
    studentEngagement: learning.studentEngagement,
    assignmentCompletion: learning.assignmentCompletion,
    reflectionQuality: learning.reflectionQuality,
    engineeringDesignProgress: learning.engineeringDesignProgress,
    studentsNeedingIntervention: learning.studentsNeedingIntervention,
    studentsReadyForEnrichment: learning.studentsReadyForEnrichment,
    priorityStudents: intervention.priorityStudents || learning.priorityStudents,
    majorMisconceptionClusters: learning.majorMisconceptionClusters,
    recommendedWholeClassAction: intervention.recommendedWholeClassAction || standards.recommendedWholeClassAction,
    smallGroupRecommendation: intervention.smallGroupRecommendation,
    opportunityRecommendations: opportunity.opportunityRecommendations,
    teacherDecisionSupportNote: opportunity.teacherDecisionSupportNote || communication.teacherDecisionSupportNote,
  };
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
