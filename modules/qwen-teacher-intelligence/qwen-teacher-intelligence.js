(function () {
  let activeView = "dashboard";
  let currentState = null;
  let currentHelpers = {};

  const screenLabels = {
    dashboard: "Qwen Teacher Dashboard",
    maya: "Student Insight Page",
    workflow: "Agent Workflow Page",
    intervention: "Intervention Plan Page",
    communications: "Communication Drafts Page",
    approval: "Teacher Approval Page",
    history: "Approved Action History",
  };

  const statusLabels = {
    draft: "Draft Recommendation",
    waiting: "Waiting for Teacher Review",
    approved: "Approved by Teacher",
    rejected: "Rejected",
    evidence: "More Evidence Needed",
  };

  const recommendationTemplate = {
    id: "qwen-rec-maya-001",
    studentName: "Maya Rodriguez",
    studentInitials: "MR",
    agentSource: "Intervention Designer Agent",
    producedBy: "Intervention Designer Agent",
    recommendation: "Run a 5-minute engineering reasoning conference focused on claim, evidence, and design constraint trade-offs.",
    intervention: "Ask Maya to point to one prototype artifact, name the constraint it revealed, and explain how that evidence changed her next design choice.",
    nextStep: "Schedule a short conference before the next engineering design work block.",
  };

  const agents = [
    {
      name: "Learning Analyst Agent",
      status: "Synthesizing",
      inputEvidence: "Student CER drafts, AI scaffold logs, DQB questions, Maya's prototype reflection, and class misconception patterns.",
      reasoningSummary: "Several students can name observations but struggle to connect evidence to reasoning. Maya's reflection is stronger because she names a failed prototype, a constraint, and a design change.",
      confidence: "88%",
      recommendedAction: "Prioritize CER sentence-level revision and use Maya's prototype evidence as a model of reasoning from failure.",
      teacherApprovalStatus: "Waiting for Teacher Review",
    },
    {
      name: "Intervention Designer Agent",
      status: "Drafting",
      inputEvidence: "Evidence-use score, repeated weak-reasoning flags, intervention students, and current engineering design lesson goal.",
      reasoningSummary: "A short teacher-led move is better than a long reteach because the class needs a focused bridge from claim to evidence to reasoning.",
      confidence: "84%",
      recommendedAction: "Run a 5-minute CER repair: underline evidence, add a because link, then revise one design decision.",
      teacherApprovalStatus: "Waiting for Teacher Review",
    },
    {
      name: "Standards Coach Agent",
      status: "Aligned",
      inputEvidence: "MS-LS2-4 lesson target, criteria/constraints prompts, student resource set, and engineering design reflection.",
      reasoningSummary: "The strongest alignment is not generic writing support; it is evidence-based explanation of design criteria, constraints, and ecosystem trade-offs.",
      confidence: "91%",
      recommendedAction: "Keep the next teacher move anchored to criteria, constraints, and evidence from the palm farm design problem.",
      teacherApprovalStatus: "Waiting for Teacher Review",
    },
    {
      name: "Communication Agent",
      status: "Ready",
      inputEvidence: "Teacher-facing recommendation, Maya's strengths, needed evidence list, and family-safe non-evaluative language.",
      reasoningSummary: "Communication should celebrate observable growth without implying placement, grading, or automatic intervention decisions.",
      confidence: "80%",
      recommendedAction: "Draft a short family/team note that says Maya is using prototype evidence to improve design reasoning.",
      teacherApprovalStatus: "Draft only",
    },
    {
      name: "Opportunity Advisor Agent",
      status: "Watching",
      inputEvidence: "Engineering design strength, robotics interest signals, evidence of iteration, and middle school STEM pathway options.",
      reasoningSummary: "Maya and several peers show enough engineering persistence for teacher-reviewed enrichment suggestions, not automatic placement.",
      confidence: "76%",
      recommendedAction: "Review TSA Engineering Design, Samsung Solve for Tomorrow, Toshiba ExploraVision, FIRST LEGO League/robotics, Kentucky STEM camps or fellowships, and local ATC/tech school pathways.",
      teacherApprovalStatus: "Teacher review required",
    },
    {
      name: "Teacher Approval Agent",
      status: "Required",
      inputEvidence: "Current recommendation status, approval history, rejection reason, evidence request list, and teacher action controls.",
      reasoningSummary: "The workflow should create an action history only after explicit teacher approval; rejection and evidence requests must not become student actions.",
      confidence: "97%",
      recommendedAction: "Hold all actions until the teacher approves, edits, rejects, or requests more evidence.",
      teacherApprovalStatus: "Required before action",
    },
  ];

  const classInsightItems = [
    ["CER writing support", "Class need", "Students can state claims about palm oil trade-offs, but many need a stronger evidence sentence and a clearer because link."],
    ["Thermal energy misconception", "Cross-unit warning", "A small group is using everyday heat language imprecisely; plan a quick temperature vs. thermal energy check before the next physical science bridge."],
    ["Data analysis gap", "Small group", "Several students describe patterns verbally but do not reference table values or graph trends when defending a design decision."],
    ["Engineering design strength", "Class asset", "Students are improving at naming constraints, testing prototypes, and explaining why an iteration performed better."],
    ["Student opportunity matches", "Teacher review", "Engineering and robotics signals suggest enrichment pathways, but all matches should be reviewed by the teacher before sharing."],
  ].map(([title, status, detail]) => ({ title, status, detail }));

  const opportunityMatches = [
    ["TSA Engineering Design", "Best for students showing design constraints, prototype iteration, and presentation readiness."],
    ["Samsung Solve for Tomorrow", "Good fit for teams connecting STEM design to a local community problem."],
    ["Toshiba ExploraVision", "Strong extension for students ready to imagine and explain future-facing science innovation."],
    ["FIRST LEGO League / robotics", "Good match for students showing persistence, debugging habits, and collaborative engineering interest."],
    ["Kentucky STEM camps or fellowships", "Teacher-reviewed enrichment option for students ready for summer or regional STEM experiences."],
    ["Local ATC / tech school pathway", "Pathway suggestion for students interested in applied engineering, automation, robotics, or technical careers."],
  ].map(([name, reason]) => ({ name, reason }));

  const mayaInsight = {
    name: "Maya Rodriguez",
    initials: "MR",
    grade: "7",
    className: "Period 2",
    profile: "Engineering-minded demo learner with strong revision habits and emerging evidence-based reasoning.",
    evidence: [
      "Uses prototype failure as evidence before revising a design.",
      "Names constraints such as wind, material limits, and base stability.",
      "Benefits from a teacher prompt that asks for one more evidence link.",
    ],
    strengths: ["Iteration", "Design constraints", "Reflection", "STEM persistence"],
    needs: ["Additional written sample", "Short student conference note", "Assessment snapshot"],
  };

  function render({ state, helpers }) {
    currentState = state;
    currentHelpers = helpers || {};
    const h = currentHelpers;
    ensureQwenState(state);
    const context = buildContext(state, h);
    const view = screenLabels[activeView] ? activeView : "dashboard";

    return `<section class="qwen-teacher-intelligence">
      ${h.pageHead(
        screenLabels[view],
        "Mock Autopilot Agent workflow for planning, review, and teacher-approved support.",
        `<span class="pill"><span class="dot"></span>Demo mode</span><button class="btn secondary" onclick="QwenTeacherIntelligence.analyzeClassroom()">Analyze Entire Classroom</button><button class="btn secondary" onclick="teacherTab('analytics')">Class analytics</button>`
      )}
      ${decisionSupportBanner()}
      ${moduleNav(view, h)}
      ${renderView(view, context, h)}
    </section>`;
  }

  function ensureQwenState(state) {
    state.qwenTeacherIntelligence ||= {};
    const qwen = state.qwenTeacherIntelligence;
    qwen.provider ||= "demo";
    qwen.currentRecommendation ||= { ...recommendationTemplate };
    qwen.recommendationStatus ||= "waiting";
    qwen.actionHistory ||= [];
    qwen.rejectionReason ||= "";
    qwen.neededEvidence ||= [];
    qwen.editedNote ||= "";
    qwen.lastDecisionAt ||= "";
    qwen.classAnalysis ||= null;
  }

  function buildContext(state, h) {
    const students = state.students || [];
    const promptLog = state.aiPromptLog || [];
    const classMetrics = h.classInsightMetrics?.() || {};
    const priorityStudents = buildPriorityStudents(students, h);
    const clusters = buildMisconceptionClusters(students, h);
    const interventions = buildInterventions(classMetrics, priorityStudents);
    return {
      state,
      qwen: state.qwenTeacherIntelligence,
      students,
      promptLog,
      classMetrics,
      priorityStudents,
      clusters,
      interventions,
      providerStatus: providerMode(state),
    };
  }

  function decisionSupportBanner() {
    return `<aside class="qwen-teacher-decision-banner">
      <strong>Teacher decision support only &mdash; no automated student decisions.</strong>
      <span>Recommendations are local demo drafts. The teacher remains the final decision-maker.</span>
    </aside>`;
  }

  function moduleNav(active, h) {
    return `<nav class="qwen-teacher-tabs" aria-label="Qwen Teacher Intelligence screens">
      ${Object.entries(screenLabels).map(([id, label]) => `<button type="button" class="qwen-teacher-tab ${active === id ? "active" : ""}" onclick="QwenTeacherIntelligence.setView('${h.esc(id)}')">${h.esc(shortLabel(label))}</button>`).join("")}
    </nav>`;
  }

  function shortLabel(label) {
    return label.replace(" Page", "").replace("Qwen Teacher ", "").replace("Approved Action ", "Action ");
  }

  function renderView(view, context, h) {
    const views = {
      dashboard: dashboardView,
      maya: mayaInsightView,
      workflow: workflowView,
      intervention: interventionView,
      communications: communicationsView,
      approval: approvalView,
      history: historyView,
    };
    return (views[view] || dashboardView)(context, h);
  }

  function dashboardView(context, h) {
    const evidenceUse = context.classMetrics["Evidence Use"] || 0;
    return `<section class="qwen-teacher-screen">
      <section class="grid stats qwen-teacher-metrics">
        ${metricCard("Priority students", context.priorityStudents.length, "Need teacher attention", "qwen-teacher-risk")}
        ${metricCard("Current status", statusLabels[context.qwen.recommendationStatus], "Approval workflow", "qwen-teacher-events")}
        ${metricCard("Approved actions", context.qwen.actionHistory.length, "Teacher-approved only", "qwen-teacher-clusters")}
        ${metricCard("Evidence use", `${evidenceUse}%`, "Class signal strength", "qwen-teacher-evidence")}
      </section>
      <section class="grid two-col qwen-teacher-main-grid">
        <div class="grid">
          ${classSummaryCard(context, h)}
          ${classHealthPanel(context, h)}
          ${classInsightSection(h)}
          ${recommendationCard(context, h, true)}
          ${agentGridCard(h)}
        </div>
        <aside class="grid">
          ${studentSnapshotCard(h)}
          ${clusterCard(context.clusters, h)}
          ${providerCard(context.providerStatus, h)}
        </aside>
      </section>
    </section>`;
  }

  function mayaInsightView(context, h) {
    return `<section class="qwen-teacher-screen">
      <section class="grid two-col qwen-teacher-main-grid">
        <article class="card card-pad qwen-teacher-profile-card">
          <div class="student-line"><span class="avatar">${h.esc(mayaInsight.initials)}</span><span><h2>${h.esc(mayaInsight.name)}</h2><span class="subtle">Demo learner · Grade ${h.esc(mayaInsight.grade)} · ${h.esc(mayaInsight.className)}</span></span></div>
          <p class="qwen-teacher-lead">${h.esc(mayaInsight.profile)}</p>
          <div class="qwen-teacher-tag-row">${mayaInsight.strengths.map((item) => `<span class="tag">${h.esc(item)}</span>`).join("")}</div>
        </article>
        <article class="card card-pad">
          <h3 class="section-title">Autopilot Insight</h3>
          <p class="qwen-teacher-safety-label">No profile fields, grades, notes, hot list status, or credentials are changed by this screen.</p>
          <div class="detail-grid">
            <span>Primary signal</span><strong>Improving engineering design reasoning</strong>
            <span>Teacher check</span><strong>Ask Maya to cite one artifact before approving the next step</strong>
            <span>Workflow status</span><strong>${h.esc(statusLabels[context.qwen.recommendationStatus])}</strong>
          </div>
        </article>
      </section>
      <section class="grid two-col">
        ${evidenceCard("Evidence Qwen Would Review", mayaInsight.evidence, h)}
        ${evidenceCard("Evidence Needed If Teacher Requests More", mayaInsight.needs, h)}
      </section>
      ${agentGridCard(h, ["Learning Analyst Agent", "Opportunity Advisor Agent", "Teacher Approval Agent"])}
    </section>`;
  }

  function workflowView(context, h) {
    const steps = [
      ["1", "Draft Recommendation", "Agents read demo evidence and draft a recommendation without changing records."],
      ["2", "Waiting for Teacher Review", "The Teacher Approval Agent holds the recommendation for human review."],
      ["3", "Teacher Decision", "The teacher can approve, edit, reject, or request more evidence."],
      ["4", "Approved Action History", "Only approved decisions are copied into the local demo action history."],
    ];
    return `<section class="qwen-teacher-screen">
      <section class="card card-pad">
        <div class="card-action-head"><div><h3 class="section-title">Autopilot Agent Workflow</h3><p class="subtle">Mock local workflow with teacher-controlled approvals.</p></div>${statusChip(context.qwen.recommendationStatus)}</div>
        <div class="qwen-teacher-workflow">${steps.map(([number, title, body]) => `<div class="qwen-teacher-workflow-step"><span>${h.esc(number)}</span><div><strong>${h.esc(title)}</strong><p>${h.esc(body)}</p></div></div>`).join("")}</div>
      </section>
      ${classInsightSection(h)}
      ${agentGridCard(h)}
    </section>`;
  }

  function interventionView(context, h) {
    return `<section class="qwen-teacher-screen">
      <section class="grid two-col qwen-teacher-main-grid">
        <article class="card card-pad">
          <h3 class="section-title">Intervention Plan</h3>
          <p class="qwen-teacher-safety-label">Teacher decision support only &mdash; no automated student decisions.</p>
          <div class="qwen-teacher-intervention-list">
            ${context.interventions.map((item) => `<div class="timeline-item"><strong>${h.esc(item.title)}</strong><p>${h.esc(item.body)}</p><span class="quality">${h.esc(item.timing)}</span></div>`).join("")}
          </div>
        </article>
        ${recommendationCard(context, h, false)}
      </section>
      ${agentGridCard(h, ["Intervention Designer Agent", "Standards Coach Agent", "Teacher Approval Agent"])}
    </section>`;
  }

  function communicationsView(context, h) {
    const drafts = [
      ["Family Growth Note", "Family", "Maya is showing growth in engineering design thinking. She is using evidence from prototype tests to explain why design changes matter."],
      ["Teacher Team Note", "Instructional team", "Consider giving Maya an extension prompt that asks her to compare two design constraints and justify the stronger trade-off."],
      ["Student Conference Prompt", "Student", "Show me one part of your prototype evidence. What did it prove, and how did it change your next design choice?"],
    ];
    return `<section class="qwen-teacher-screen">
      <section class="grid three-col">
        ${drafts.map(([title, audience, body]) => `<article class="card card-pad qwen-teacher-draft-card"><span class="eyebrow">${h.esc(audience)}</span><h3>${h.esc(title)}</h3><p>${h.esc(body)}</p><span class="quality">Draft only</span></article>`).join("")}
      </section>
      <article class="card card-pad">
        <h3 class="section-title">Communication Boundary</h3>
        <p class="qwen-teacher-safety-label">Drafts are never sent automatically. A teacher must review, edit, and choose where any message goes.</p>
      </article>
      ${opportunityPanel(h)}
      ${agentGridCard(h, ["Communication Agent", "Teacher Approval Agent"])}
    </section>`;
  }

  function approvalView(context, h) {
    return `<section class="qwen-teacher-screen">
      <section class="grid two-col qwen-teacher-main-grid">
        ${recommendationCard(context, h, true)}
        <article class="card card-pad">
          <div class="card-action-head"><div><h3 class="section-title">Teacher Approval Controls</h3><p class="subtle">Local demo actions only.</p></div>${statusChip(context.qwen.recommendationStatus)}</div>
          <div class="qwen-teacher-action-buttons">
            <button class="btn" onclick="QwenTeacherIntelligence.approve()">Approve</button>
            <button class="btn secondary" onclick="QwenTeacherIntelligence.edit()">Edit</button>
            <button class="btn danger" onclick="QwenTeacherIntelligence.reject()">Reject</button>
            <button class="btn secondary" onclick="QwenTeacherIntelligence.requestMoreEvidence()">Request More Evidence</button>
          </div>
          ${decisionDetail(context, h)}
        </article>
      </section>
      ${historyPreview(context, h)}
      ${agentGridCard(h, ["Teacher Approval Agent", "Intervention Designer Agent", "Standards Coach Agent"])}
    </section>`;
  }

  function historyView(context, h) {
    return `<section class="qwen-teacher-screen">
      <article class="card card-pad">
        <div class="card-action-head"><div><h3 class="section-title">Approved Action History</h3><p class="subtle">Only teacher-approved recommendations appear here.</p></div><button class="btn secondary" onclick="QwenTeacherIntelligence.setView('approval')">Back to approval</button></div>
        ${historyList(context, h)}
      </article>
    </section>`;
  }

  function recommendationCard(context, h, showActionsLink) {
    const rec = context.qwen.currentRecommendation;
    return `<article class="card card-pad qwen-teacher-recommendation-card">
      <div class="card-action-head"><div><h3 class="section-title">Autopilot Recommendation</h3><p class="subtle">${h.esc(rec.studentName)} · ${h.esc(rec.agentSource)}</p></div>${statusChip(context.qwen.recommendationStatus)}</div>
      <div class="detail-grid">
        <span>Recommendation</span><strong>${h.esc(rec.recommendation)}</strong>
        <span>Approved intervention</span><strong>${h.esc(rec.intervention)}</strong>
        <span>Agent source</span><strong>${h.esc(rec.agentSource)}</strong>
        <span>Teacher role</span><strong>Teacher remains final decision-maker</strong>
      </div>
      ${context.qwen.editedNote ? `<p class="qwen-teacher-edit-note"><strong>Edit note:</strong> ${h.esc(context.qwen.editedNote)}</p>` : ""}
      ${showActionsLink ? `<div class="role-actions"><button class="btn secondary" onclick="QwenTeacherIntelligence.setView('approval')">Review decision</button><button class="btn secondary" onclick="QwenTeacherIntelligence.setView('history')">Approved Action History</button></div>` : ""}
    </article>`;
  }

  function decisionDetail(context, h) {
    const qwen = context.qwen;
    if (qwen.recommendationStatus === "approved") {
      return `<div class="qwen-teacher-decision-detail approved">
        <strong>Approved by teacher</strong>
        <p>Timestamp: ${h.esc(qwen.lastDecisionAt)}</p>
        <p>Approved intervention: ${h.esc(qwen.currentRecommendation.intervention)}</p>
        <p>Produced by: ${h.esc(qwen.currentRecommendation.agentSource)}</p>
        <p>Teacher remains final decision-maker.</p>
      </div>`;
    }
    if (qwen.recommendationStatus === "rejected") {
      return `<div class="qwen-teacher-decision-detail rejected">
        <strong>Rejected</strong>
        <p>Sample reason: ${h.esc(qwen.rejectionReason || "Recommendation needs stronger evidence before use.")}</p>
        <p>No student action history entry was created.</p>
      </div>`;
    }
    if (qwen.recommendationStatus === "evidence") {
      return `<div class="qwen-teacher-decision-detail evidence">
        <strong>More Evidence Needed</strong>
        <ul class="qwen-teacher-list">${qwen.neededEvidence.map((item) => `<li>${h.esc(item)}</li>`).join("")}</ul>
      </div>`;
    }
    if (qwen.recommendationStatus === "draft") {
      return `<div class="qwen-teacher-decision-detail">
        <strong>Draft Recommendation</strong>
        <p>${h.esc(qwen.editedNote || "Teacher is reviewing and editing the recommendation language before approval.")}</p>
      </div>`;
    }
    return `<div class="qwen-teacher-decision-detail">
      <strong>Waiting for Teacher Review</strong>
      <p>Select Approve, Edit, Reject, or Request More Evidence to move the local demo workflow forward.</p>
    </div>`;
  }

  function historyPreview(context, h) {
    return `<article class="card card-pad">
      <div class="card-action-head"><div><h3 class="section-title">Student Action History</h3><p class="subtle">Approved actions only. Rejected recommendations are intentionally excluded.</p></div><button class="btn secondary" onclick="QwenTeacherIntelligence.setView('history')">Open full history</button></div>
      ${historyList(context, h, 2)}
    </article>`;
  }

  function historyList(context, h, limit = Infinity) {
    const items = context.qwen.actionHistory.slice(0, limit);
    if (!items.length) return `<div class="empty">No approved actions yet. Approve the recommendation to create the first local demo history entry.</div>`;
    return `<div class="qwen-teacher-history-list">${items.map((item) => `<article class="qwen-teacher-history-item">
      <div class="card-action-head"><div><strong>${h.esc(item.recommendation)}</strong><p>${h.esc(item.studentName)} · ${h.esc(item.agentSource)}</p></div><span class="quality">${h.esc(item.teacherDecision)}</span></div>
      <div class="detail-grid">
        <span>Date/time</span><strong>${h.esc(item.timestamp)}</strong>
        <span>Next instructional step</span><strong>${h.esc(item.nextStep)}</strong>
        <span>Final decision</span><strong>Teacher remains final decision-maker</strong>
      </div>
    </article>`).join("")}</div>`;
  }

  function statusChip(status) {
    return `<span class="qwen-teacher-status qwen-teacher-status-${status}">${statusLabels[status] || statusLabels.waiting}</span>`;
  }

  function metricCard(label, value, foot, accent) {
    return `<article class="card metric ${accent}"><span class="metric-label">${label}</span><strong>${value}</strong><div class="metric-foot">${foot}</div></article>`;
  }

  function classSummaryCard(context, h) {
    const lesson = context.state.lessonSetup || {};
    const weakest = weakestMetric(context.classMetrics);
    return `<article class="card card-pad qwen-teacher-class-summary">
      <div class="card-action-head"><div><h3 class="section-title">Class Intelligence Summary</h3><p class="subtle">${h.esc(lesson.subject || "Class")} · Grade ${h.esc(lesson.gradeLevel || "7")} · Local demo analysis</p></div><span class="qwen-teacher-badge">Qwen</span></div>
      <p class="qwen-teacher-lead">${h.esc(summarySentence(context.state, context.classMetrics))}</p>
      <div class="qwen-teacher-signal-list">${Object.entries(context.classMetrics).map(([label, value]) => `<div class="bar-row"><span>${h.esc(label)}</span>${h.progress(value)}<strong>${value}%</strong></div>`).join("")}</div>
      <p class="recommendation"><strong>Teacher move:</strong> ${h.esc(recommendationForMetric(weakest[0], weakest[1]))}</p>
    </article>`;
  }

  function classHealthPanel(context, h) {
    const report = context.qwen.classAnalysis;
    if (!report) {
      return `<article class="card card-pad qwen-teacher-class-health">
        <div class="card-action-head"><div><h3 class="section-title">Class Health Panel</h3><p class="subtle">Run the classroom analysis to generate a mock STEM insight report.</p></div><button class="btn" onclick="QwenTeacherIntelligence.analyzeClassroom()">Analyze Entire Classroom</button></div>
        <p class="qwen-teacher-safety-label">The report will be mock/demo only and will not update student records.</p>
      </article>`;
    }
    return `<article class="card card-pad qwen-teacher-class-health">
      <div class="card-action-head"><div><h3 class="section-title">Class Health Report</h3><p class="subtle">Generated ${h.esc(report.generatedAt)} · Teacher review required</p></div><span class="qwen-teacher-health-score">${h.esc(report.overallClassHealthScore)}</span></div>
      <section class="grid three-col qwen-teacher-health-grid">
        ${metricCard("Need intervention", report.studentsNeedingIntervention, "students", "qwen-teacher-risk")}
        ${metricCard("Ready for enrichment", report.studentsReadyForEnrichment, "students", "qwen-teacher-evidence")}
        ${metricCard("Class health", report.overallClassHealthScore, "middle school STEM", "qwen-teacher-clusters")}
      </section>
      <div class="detail-grid qwen-teacher-report-grid">
        <span>Major misconception clusters</span><strong>${report.majorMisconceptionClusters.map(h.esc).join("; ")}</strong>
        <span>Recommended whole-class action</span><strong>${h.esc(report.recommendedWholeClassAction)}</strong>
        <span>Small group recommendation</span><strong>${h.esc(report.smallGroupRecommendation)}</strong>
        <span>Opportunity recommendations</span><strong>${report.opportunityRecommendations.map(h.esc).join("; ")}</strong>
      </div>
    </article>`;
  }

  function classInsightSection(h) {
    return `<section class="card card-pad">
      <h3 class="section-title">Class Insight Signals</h3>
      <div class="qwen-teacher-insight-grid">
        ${classInsightItems.map((item) => `<article class="qwen-teacher-insight-card">
          <div class="card-action-head"><strong>${h.esc(item.title)}</strong><span class="quality">${h.esc(item.status)}</span></div>
          <p>${h.esc(item.detail)}</p>
        </article>`).join("")}
      </div>
    </section>`;
  }

  function opportunityPanel(h) {
    return `<section class="card card-pad qwen-teacher-opportunity-panel">
      <h3 class="section-title">Opportunity Advisor Recommendations</h3>
      <p class="qwen-teacher-safety-label">These are teacher-review suggestions, not automatic placement, nomination, or enrollment decisions.</p>
      <div class="qwen-teacher-opportunity-list">
        ${opportunityMatches.map((item) => `<article class="qwen-teacher-opportunity-item"><strong>${h.esc(item.name)}</strong><p>${h.esc(item.reason)}</p></article>`).join("")}
      </div>
    </section>`;
  }

  function studentSnapshotCard(h) {
    return `<article class="card card-pad">
      <div class="card-action-head"><div><h3 class="section-title">Maya Rodriguez</h3><p class="subtle">Mock student insight profile</p></div><button class="btn secondary" onclick="QwenTeacherIntelligence.setView('maya')">Open</button></div>
      <p>${h.esc(mayaInsight.profile)}</p>
      <div class="qwen-teacher-tag-row">${mayaInsight.strengths.slice(0, 3).map((item) => `<span class="tag">${h.esc(item)}</span>`).join("")}</div>
    </article>`;
  }

  function agentGridCard(h, names) {
    const visibleAgents = names?.length ? agents.filter((agent) => names.includes(agent.name)) : agents;
    return `<section class="card card-pad"><h3 class="section-title">Agent Cards</h3><div class="qwen-teacher-agent-grid">${visibleAgents.map((agent) => agentCard(agent, h)).join("")}</div></section>`;
  }

  function agentCard(agent, h) {
    return `<article class="qwen-teacher-agent-card">
      <div class="card-action-head"><strong>${h.esc(agent.name)}</strong><span class="quality">${h.esc(agent.status)}</span></div>
      <div class="qwen-teacher-agent-detail"><span>Input evidence used</span><p>${h.esc(agent.inputEvidence)}</p></div>
      <div class="qwen-teacher-agent-detail"><span>Reasoning summary</span><p>${h.esc(agent.reasoningSummary)}</p></div>
      <div class="qwen-teacher-agent-meta">
        <span>Confidence: <strong>${h.esc(agent.confidence)}</strong></span>
        <span>Teacher approval: <strong>${h.esc(agent.teacherApprovalStatus)}</strong></span>
      </div>
      <div class="qwen-teacher-agent-detail"><span>Recommended action</span><p>${h.esc(agent.recommendedAction)}</p></div>
    </article>`;
  }

  function clusterCard(clusters, h) {
    return `<article class="card card-pad">
      <h3 class="section-title">Misconception Clusters</h3>
      <p class="subtle">Qwen synthesizes patterns before recommending individual interventions.</p>
      <div class="qwen-teacher-cluster-list">
        ${clusters.length ? clusters.map((cluster) => `<div class="qwen-teacher-cluster"><div><strong>${h.esc(cluster.label)}</strong><p>${h.esc(cluster.reason)}</p></div><span>${cluster.count}</span></div>`).join("") : `<div class="empty">No misconception clusters found.</div>`}
      </div>
    </article>`;
  }

  function evidenceCard(title, items, h) {
    return `<article class="card card-pad"><h3 class="section-title">${h.esc(title)}</h3><ul class="qwen-teacher-list">${items.map((item) => `<li>${h.esc(item)}</li>`).join("")}</ul></article>`;
  }

  function providerCard(providerStatus, h) {
    return `<article class="card card-pad qwen-teacher-provider-card">
      <h3 class="section-title">Provider Boundary</h3>
      <div class="detail-grid">
        <span>Mode</span><strong>${h.esc(providerStatus.label)}</strong>
        <span>Status</span><strong>${h.esc(providerStatus.status)}</strong>
        <span>Safety</span><strong>Teacher decision support only</strong>
      </div>
      <p class="subtle">${h.esc(providerStatus.description)} Qwen does not automatically change student records, grades, hot lists, resources, credentials, or communications.</p>
    </article>`;
  }

  function providerMode(state) {
    const mode = state.qwenTeacherIntelligence?.provider || "demo";
    if (mode === "live") return { label: "Qwen-ready mode", status: "Backend required", description: "Live Qwen calls should run through a server-side proxy so classroom data and API keys stay protected." };
    return { label: "Demo intelligence", status: "Local analysis only", description: "This view uses existing local demo data to show the teacher workflow before a live Qwen provider is connected." };
  }

  function buildPriorityStudents(students, h) {
    return students.map((student) => {
      const flags = h.studentInsightFlags?.(student) || [];
      const nonStrongFlags = flags.filter((flag) => flag.type !== "strong");
      const hotList = (student.support || []).some((tag) => String(tag).toLowerCase() === "hot list");
      const supportNeed = ["Intervention", "Below level"].includes(student.level) || (student.support || []).some((tag) => ["IEP/504", "Intervention"].includes(tag));
      const score = nonStrongFlags.length * 18 + (hotList ? 22 : 0) + (supportNeed ? 18 : 0) + Math.max(0, 70 - Number(student.progress || 0));
      const reason = nonStrongFlags[0]?.label || (hotList ? "Hot List learner" : supportNeed ? "Support plan active" : "Monitor progress");
      return { student, score: Math.min(99, Math.round(score)), reason, nextMove: nextMoveForStudent(student, nonStrongFlags) };
    }).filter((item) => item.score >= 35).sort((a, b) => b.score - a.score).slice(0, 5);
  }

  function nextMoveForStudent(student, flags) {
    if (flags.some((flag) => flag.type === "evidence")) return "Ask for one source of evidence";
    if (flags.some((flag) => flag.type === "misconception")) return "Use a misconception check";
    if ((student.support || []).includes("English Learner")) return "Add bilingual vocabulary";
    if (student.proficiency === "Distinguished") return "Give extension trade-off prompt";
    return "Schedule a quick conference";
  }

  function buildMisconceptionClusters(students, h) {
    const counts = new Map();
    students.forEach((student) => {
      (h.studentInsightFlags?.(student) || []).filter((flag) => flag.type !== "strong").forEach((flag) => counts.set(flag.label, (counts.get(flag.label) || 0) + 1));
    });
    return Array.from(counts.entries()).map(([label, count]) => ({ label, count, reason: clusterReason(label) })).sort((a, b) => b.count - a.count).slice(0, 4);
  }

  function clusterReason(label) {
    if (/evidence/i.test(label)) return "Students need help citing lesson evidence before revising claims.";
    if (/misconception/i.test(label)) return "The class may be oversimplifying a complex ecosystem trade-off.";
    if (/reasoning/i.test(label)) return "Students need a clearer because/therefore link between evidence and design decisions.";
    return "This pattern should be reviewed before the next student work block.";
  }

  function buildInterventions(metrics, priorityStudents) {
    const weakest = weakestMetric(metrics)[0];
    return [
      { title: `Mini-lesson: ${weakest || "Evidence Use"}`, body: recommendationForMetric(weakest, metrics[weakest]), timing: "Whole class · 5 minutes" },
      { title: "Priority conference", body: priorityStudents[0] ? `Meet with ${priorityStudents[0].student.name} first and use the recommended next move.` : "No immediate conference is needed from current demo evidence.", timing: "Small group · 3 minutes" },
      { title: "Exit check", body: "Ask each student to revise one sentence so it includes a claim, evidence, and reasoning connection.", timing: "Individual · 2 minutes" },
    ];
  }

  function weakestMetric(metrics) {
    const entries = Object.entries(metrics);
    return entries.length ? entries.sort((a, b) => a[1] - b[1])[0] : ["Evidence Use", 0];
  }

  function summarySentence(state, metrics) {
    const weakest = weakestMetric(metrics);
    const lessonTitle = state.lessonSetup?.lessonTitle || "the active lesson";
    return `For ${lessonTitle}, the class is strongest where evidence and reasoning are visible, while ${weakest[0].toLowerCase()} is the best target for the next teacher move.`;
  }

  function recommendationForMetric(label = "Evidence Use", value = 0) {
    if (/question/i.test(label)) return "Model how to turn a broad wonder into an investigable question with a variable or comparison.";
    if (/evidence/i.test(label)) return "Have students underline one piece of lesson evidence before they explain why it matters.";
    if (/reasoning/i.test(label)) return "Use a claim-evidence-reasoning frame and ask students to add the missing because link.";
    if (/reflection/i.test(label)) return "Ask students to name what changed in their thinking after the AI follow-up.";
    return value < 60 ? "Run a short check for understanding before students continue." : "Keep monitoring and look for students ready for extension.";
  }

  function nowLabel() {
    return new Date().toLocaleString();
  }

  function persist() {
    currentHelpers.save?.();
    currentHelpers.render?.();
  }

  function approve() {
    ensureQwenState(currentState);
    const qwen = currentState.qwenTeacherIntelligence;
    const rec = qwen.currentRecommendation;
    const timestamp = nowLabel();
    qwen.recommendationStatus = "approved";
    qwen.lastDecisionAt = timestamp;
    qwen.rejectionReason = "";
    qwen.neededEvidence = [];
    qwen.actionHistory.unshift({
      id: `qwen-action-${Date.now()}`,
      recommendation: rec.recommendation,
      studentName: rec.studentName,
      agentSource: rec.agentSource,
      teacherDecision: "Approved by Teacher",
      timestamp,
      nextStep: rec.nextStep,
      approvedIntervention: rec.intervention,
    });
    activeView = "approval";
    persist();
  }

  function reject() {
    ensureQwenState(currentState);
    const qwen = currentState.qwenTeacherIntelligence;
    qwen.recommendationStatus = "rejected";
    qwen.lastDecisionAt = nowLabel();
    qwen.rejectionReason = "Sample reason: needs a second student work sample before this intervention is used.";
    activeView = "approval";
    persist();
  }

  function requestMoreEvidence() {
    ensureQwenState(currentState);
    const qwen = currentState.qwenTeacherIntelligence;
    qwen.recommendationStatus = "evidence";
    qwen.lastDecisionAt = nowLabel();
    qwen.neededEvidence = ["additional written sample", "short student conference note", "assessment snapshot"];
    activeView = "approval";
    persist();
  }

  function edit() {
    ensureQwenState(currentState);
    const qwen = currentState.qwenTeacherIntelligence;
    qwen.recommendationStatus = "draft";
    qwen.lastDecisionAt = nowLabel();
    qwen.editedNote = "Teacher edited the draft to emphasize evidence from Maya's prototype artifact before any instructional action.";
    qwen.currentRecommendation.recommendation = "Teacher-edited draft: conference with Maya using one prototype artifact as evidence for a design constraint.";
    activeView = "approval";
    persist();
  }

  function analyzeClassroom() {
    ensureQwenState(currentState);
    currentState.qwenTeacherIntelligence.classAnalysis = {
      generatedAt: nowLabel(),
      overallClassHealthScore: "78%",
      studentsNeedingIntervention: 5,
      studentsReadyForEnrichment: 7,
      majorMisconceptionClusters: [
        "CER claims without evidence",
        "Thermal energy described as a substance instead of particle motion",
        "Graph trends described without numerical support",
      ],
      recommendedWholeClassAction: "Run a 7-minute CER repair using a palm farm design claim, one data point, and a because statement that links evidence to ecosystem stability.",
      smallGroupRecommendation: "Pull five students for a data-analysis table talk: identify one pattern, cite one value, and explain how it changes a design constraint.",
      opportunityRecommendations: [
        "Teacher-review enrichment list for TSA Engineering Design",
        "Robotics/FIRST LEGO League interest group",
        "Samsung Solve for Tomorrow community problem brainstorm",
        "Kentucky STEM camp or local ATC pathway conversation",
      ],
    };
    activeView = "dashboard";
    persist();
  }

  function setView(view) {
    activeView = screenLabels[view] ? view : "dashboard";
    if (typeof window.teacherTab === "function") window.teacherTab("qwenTeacher");
  }

  window.QwenTeacherIntelligence = { render, setView, approve, edit, reject, requestMoreEvidence, analyzeClassroom };
})();
