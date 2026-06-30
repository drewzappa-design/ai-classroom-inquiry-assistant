(function () {
  let activeView = "dashboard";

  const screenLabels = {
    dashboard: "Qwen Teacher Dashboard",
    maya: "Student Insight Page",
    workflow: "Agent Workflow Page",
    intervention: "Intervention Plan Page",
    communications: "Communication Drafts Page",
    approval: "Teacher Approval Page",
  };

  const agents = [
    {
      name: "Learning Analyst Agent",
      status: "Synthesizing",
      purpose: "Reads inquiry evidence, AI follow-up logs, and revision patterns.",
      output: "Maya is improving at connecting constraints to design choices.",
    },
    {
      name: "Intervention Designer Agent",
      status: "Drafting",
      purpose: "Turns insight patterns into short teacher-led moves.",
      output: "Use a 5-minute claim-evidence-reasoning revision conference.",
    },
    {
      name: "Standards Coach Agent",
      status: "Aligned",
      purpose: "Checks recommendations against the teacher's lesson goal and standard.",
      output: "Keep focus on MS-LS2-4 design criteria, constraints, and ecosystem stability.",
    },
    {
      name: "Communication Agent",
      status: "Ready",
      purpose: "Drafts teacher-reviewable messages for families or support teams.",
      output: "Prepare a concise growth note with evidence and next step.",
    },
    {
      name: "Opportunity Advisor Agent",
      status: "Watching",
      purpose: "Looks for enrichment, extension, or portfolio opportunities.",
      output: "Maya may be ready for an engineering design extension task.",
    },
    {
      name: "Teacher Approval Agent",
      status: "Required",
      purpose: "Keeps every recommendation behind teacher review.",
      output: "No student decisions are applied automatically.",
    },
  ];

  const mayaInsight = {
    name: "Maya Rodriguez",
    initials: "MR",
    grade: "7",
    className: "Period 2",
    profile: "Engineering-minded learner with strong revision habits and emerging evidence-based reasoning.",
    evidence: [
      "Uses prototype failure as evidence before revising a design.",
      "Names constraints such as wind, material limits, and base stability.",
      "Benefits from a teacher prompt that asks for one more evidence link.",
    ],
    strengths: ["Iteration", "Design constraints", "Reflection", "STEM persistence"],
    needs: ["Cite one source before making a claim", "Explain why a design choice improved the outcome"],
  };

  function render({ state, helpers }) {
    const h = helpers || {};
    const context = buildContext(state, h);
    const view = screenLabels[activeView] ? activeView : "dashboard";

    return `<section class="qwen-teacher-intelligence">
      ${h.pageHead(
        screenLabels[view],
        "Mock Qwen teacher intelligence for planning, reflection, and human-approved support.",
        `<span class="pill"><span class="dot"></span>Demo mode</span><button class="btn secondary" onclick="teacherTab('analytics')">Class analytics</button>`
      )}
      ${decisionSupportBanner()}
      ${moduleNav(view, h)}
      ${renderView(view, context, h)}
    </section>`;
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
      <strong>Teacher decision support only — no automated student decisions.</strong>
      <span>Qwen recommendations are read-only drafts. Teachers decide what to use, revise, approve, or ignore.</span>
    </aside>`;
  }

  function moduleNav(active, h) {
    return `<nav class="qwen-teacher-tabs" aria-label="Qwen Teacher Intelligence screens">
      ${Object.entries(screenLabels).map(([id, label]) => `<button type="button" class="qwen-teacher-tab ${active === id ? "active" : ""}" onclick="QwenTeacherIntelligence.setView('${h.esc(id)}')">${h.esc(shortLabel(label))}</button>`).join("")}
    </nav>`;
  }

  function shortLabel(label) {
    return label.replace(" Page", "").replace("Qwen Teacher ", "");
  }

  function renderView(view, context, h) {
    const views = {
      dashboard: dashboardView,
      maya: mayaInsightView,
      workflow: workflowView,
      intervention: interventionView,
      communications: communicationsView,
      approval: approvalView,
    };
    return (views[view] || dashboardView)(context, h);
  }

  function dashboardView(context, h) {
    const evidenceUse = context.classMetrics["Evidence Use"] || 0;
    return `<section class="qwen-teacher-screen">
      <section class="grid stats qwen-teacher-metrics">
        ${metricCard("Priority students", context.priorityStudents.length, "Need teacher attention", "qwen-teacher-risk")}
        ${metricCard("Insight clusters", context.clusters.length, "Pattern groups detected", "qwen-teacher-clusters")}
        ${metricCard("AI support events", context.promptLog.length, "Logged student nudges", "qwen-teacher-events")}
        ${metricCard("Evidence use", `${evidenceUse}%`, "Class signal strength", "qwen-teacher-evidence")}
      </section>
      <section class="grid two-col qwen-teacher-main-grid">
        <div class="grid">
          ${classSummaryCard(context, h)}
          ${agentGridCard(h)}
          ${priorityQueueCard(context.priorityStudents, h)}
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
          <div class="student-line"><span class="avatar">${h.esc(mayaInsight.initials)}</span><span><h2>${h.esc(mayaInsight.name)}</h2><span class="subtle">Grade ${h.esc(mayaInsight.grade)} · ${h.esc(mayaInsight.className)}</span></span></div>
          <p class="qwen-teacher-lead">${h.esc(mayaInsight.profile)}</p>
          <div class="qwen-teacher-tag-row">${mayaInsight.strengths.map((item) => `<span class="tag">${h.esc(item)}</span>`).join("")}</div>
        </article>
        <article class="card card-pad">
          <h3 class="section-title">Read-Only Student Insight</h3>
          <p class="qwen-teacher-safety-label">No profile fields, grades, notes, hot list status, or credentials are changed by this screen.</p>
          <div class="detail-grid">
            <span>Primary signal</span><strong>Improving engineering design reasoning</strong>
            <span>Teacher check</span><strong>Ask Maya to cite one artifact before approving the next step</strong>
            <span>Confidence</span><strong>Demo estimate: 86%</strong>
          </div>
        </article>
      </section>
      <section class="grid two-col">
        ${evidenceCard("Evidence Qwen Would Review", mayaInsight.evidence, h)}
        ${evidenceCard("Suggested Teacher Moves", mayaInsight.needs, h)}
      </section>
      ${agentGridCard(h, ["Learning Analyst Agent", "Opportunity Advisor Agent", "Teacher Approval Agent"])}
    </section>`;
  }

  function workflowView(context, h) {
    const steps = [
      ["1", "Collect signals", "Read lesson context, student responses, AI prompt logs, resources, and teacher-defined mastery."],
      ["2", "Analyze patterns", "Group evidence-use, reasoning, reflection, and misconception signals."],
      ["3", "Draft support", "Generate intervention, communication, and extension drafts for teacher review."],
      ["4", "Require approval", "Hold every action until the teacher chooses what to do."],
    ];
    return `<section class="qwen-teacher-screen">
      <section class="card card-pad">
        <h3 class="section-title">Agent Workflow</h3>
        <p class="subtle">The workflow is intentionally read-only in this version. It produces drafts and explanations, not automatic actions.</p>
        <div class="qwen-teacher-workflow">${steps.map(([number, title, body]) => `<div class="qwen-teacher-workflow-step"><span>${h.esc(number)}</span><div><strong>${h.esc(title)}</strong><p>${h.esc(body)}</p></div></div>`).join("")}</div>
      </section>
      ${agentGridCard(h)}
    </section>`;
  }

  function interventionView(context, h) {
    return `<section class="qwen-teacher-screen">
      <section class="grid two-col qwen-teacher-main-grid">
        <article class="card card-pad">
          <h3 class="section-title">Intervention Plan</h3>
          <p class="qwen-teacher-safety-label">Teacher decision support only — no automated student decisions.</p>
          <div class="qwen-teacher-intervention-list">
            ${context.interventions.map((item) => `<div class="timeline-item"><strong>${h.esc(item.title)}</strong><p>${h.esc(item.body)}</p><span class="quality">${h.esc(item.timing)}</span></div>`).join("")}
          </div>
        </article>
        <article class="card card-pad">
          <h3 class="section-title">Small Group Focus</h3>
          ${context.priorityStudents.length ? context.priorityStudents.slice(0, 3).map((item) => priorityStudentRow(item, h, false)).join("") : `<div class="empty">No small group suggested from current demo data.</div>`}
        </article>
      </section>
      ${agentGridCard(h, ["Intervention Designer Agent", "Standards Coach Agent", "Teacher Approval Agent"])}
    </section>`;
  }

  function communicationsView(context, h) {
    const drafts = [
      {
        title: "Family Growth Note",
        audience: "Family",
        body: "Maya is showing growth in engineering design thinking. She is using evidence from prototype tests to explain why design changes matter.",
      },
      {
        title: "Teacher Team Note",
        audience: "Instructional team",
        body: "Consider giving Maya an extension prompt that asks her to compare two design constraints and justify the stronger trade-off.",
      },
      {
        title: "Student Conference Prompt",
        audience: "Student",
        body: "Show me one part of your prototype evidence. What did it prove, and how did it change your next design choice?",
      },
    ];
    return `<section class="qwen-teacher-screen">
      <section class="grid three-col">
        ${drafts.map((draft) => `<article class="card card-pad qwen-teacher-draft-card"><span class="eyebrow">${h.esc(draft.audience)}</span><h3>${h.esc(draft.title)}</h3><p>${h.esc(draft.body)}</p><span class="quality">Draft only</span></article>`).join("")}
      </section>
      <article class="card card-pad">
        <h3 class="section-title">Communication Boundary</h3>
        <p class="qwen-teacher-safety-label">Drafts are never sent automatically. A teacher must review, edit, and choose where any message goes.</p>
      </article>
      ${agentGridCard(h, ["Communication Agent", "Teacher Approval Agent"])}
    </section>`;
  }

  function approvalView(context, h) {
    const approvals = [
      ["Review insight", "Teacher checks the evidence and decides whether the recommendation is instructionally useful.", "Required"],
      ["Revise language", "Teacher edits drafts for accuracy, tone, privacy, and family context.", "Required"],
      ["Apply action", "Future versions may create notes or plans only after explicit teacher approval.", "Not enabled"],
    ];
    return `<section class="qwen-teacher-screen">
      <section class="grid two-col qwen-teacher-main-grid">
        <article class="card card-pad">
          <h3 class="section-title">Teacher Approval Queue</h3>
          <p class="qwen-teacher-safety-label">Teacher decision support only — no automated student decisions.</p>
          <div class="qwen-teacher-approval-list">
            ${approvals.map(([title, body, status]) => `<div class="qwen-teacher-approval-item"><div><strong>${h.esc(title)}</strong><p>${h.esc(body)}</p></div><span class="quality">${h.esc(status)}</span></div>`).join("")}
          </div>
        </article>
        ${providerCard(context.providerStatus, h)}
      </section>
      ${agentGridCard(h, ["Teacher Approval Agent", "Standards Coach Agent"])}
    </section>`;
  }

  function metricCard(label, value, foot, accent) {
    return `<article class="card metric ${accent}"><span class="metric-label">${label}</span><strong>${value}</strong><div class="metric-foot">${foot}</div></article>`;
  }

  function classSummaryCard(context, h) {
    const lesson = context.state.lessonSetup || {};
    const weakest = weakestMetric(context.classMetrics);
    return `<article class="card card-pad qwen-teacher-class-summary">
      <div class="card-action-head">
        <div>
          <h3 class="section-title">Class Intelligence Summary</h3>
          <p class="subtle">${h.esc(lesson.subject || "Class")} · Grade ${h.esc(lesson.gradeLevel || "7")} · Local demo analysis</p>
        </div>
        <span class="qwen-teacher-badge">Qwen</span>
      </div>
      <p class="qwen-teacher-lead">${h.esc(summarySentence(context.state, context.classMetrics))}</p>
      <div class="qwen-teacher-signal-list">
        ${Object.entries(context.classMetrics).map(([label, value]) => `<div class="bar-row"><span>${h.esc(label)}</span>${h.progress(value)}<strong>${value}%</strong></div>`).join("")}
      </div>
      <p class="recommendation"><strong>Teacher move:</strong> ${h.esc(recommendationForMetric(weakest[0], weakest[1]))}</p>
    </article>`;
  }

  function studentSnapshotCard(h) {
    return `<article class="card card-pad">
      <div class="card-action-head"><div><h3 class="section-title">Maya Rodriguez</h3><p class="subtle">Student insight demo profile</p></div><button class="btn secondary" onclick="QwenTeacherIntelligence.setView('maya')">Open</button></div>
      <p>${h.esc(mayaInsight.profile)}</p>
      <div class="qwen-teacher-tag-row">${mayaInsight.strengths.slice(0, 3).map((item) => `<span class="tag">${h.esc(item)}</span>`).join("")}</div>
    </article>`;
  }

  function agentGridCard(h, names) {
    const visibleAgents = names?.length ? agents.filter((agent) => names.includes(agent.name)) : agents;
    return `<section class="card card-pad">
      <h3 class="section-title">Agent Cards</h3>
      <div class="qwen-teacher-agent-grid">
        ${visibleAgents.map((agent) => agentCard(agent, h)).join("")}
      </div>
    </section>`;
  }

  function agentCard(agent, h) {
    return `<article class="qwen-teacher-agent-card">
      <div class="card-action-head"><strong>${h.esc(agent.name)}</strong><span class="quality">${h.esc(agent.status)}</span></div>
      <p>${h.esc(agent.purpose)}</p>
      <small>${h.esc(agent.output)}</small>
    </article>`;
  }

  function priorityQueueCard(priorityStudents, h) {
    return `<article class="card card-pad">
      <div class="card-action-head">
        <div><h3 class="section-title">Student Priority Queue</h3><p class="subtle">Ranked by inquiry flags, support status, and readiness for a teacher check-in.</p></div>
      </div>
      <div class="qwen-teacher-priority-list">
        ${priorityStudents.length ? priorityStudents.map((item) => priorityStudentRow(item, h)).join("") : `<div class="empty">No priority students detected from the current evidence.</div>`}
      </div>
    </article>`;
  }

  function priorityStudentRow(item, h, clickable = true) {
    const student = item.student;
    const tagName = clickable ? "button" : "div";
    const attrs = clickable ? ` type="button" onclick="openStudentProfile('${h.esc(student.id)}')"` : "";
    return `<${tagName} class="qwen-teacher-priority-row"${attrs}>
      <span class="qwen-teacher-priority-score">${item.score}</span>
      <span class="qwen-teacher-student-main">${h.avatar(student)}<span><strong>${h.esc(student.name)}</strong><small>${h.esc(item.reason)}</small></span></span>
      <span class="quality">${h.esc(item.nextMove)}</span>
    </${tagName}>`;
  }

  function clusterCard(clusters, h) {
    return `<article class="card card-pad">
      <h3 class="section-title">Misconception Clusters</h3>
      <p class="subtle">Qwen should synthesize patterns before recommending individual interventions.</p>
      <div class="qwen-teacher-cluster-list">
        ${clusters.length ? clusters.map((cluster) => `<div class="qwen-teacher-cluster">
          <div><strong>${h.esc(cluster.label)}</strong><p>${h.esc(cluster.reason)}</p></div>
          <span>${cluster.count}</span>
        </div>`).join("") : `<div class="empty">No misconception clusters found.</div>`}
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
    if (mode === "live") {
      return {
        label: "Qwen-ready mode",
        status: "Backend required",
        description: "Live Qwen calls should run through a server-side proxy so classroom data and API keys stay protected.",
      };
    }
    return {
      label: "Demo intelligence",
      status: "Local analysis only",
      description: "This view uses existing local demo data to show the teacher workflow before a live Qwen provider is connected.",
    };
  }

  function buildPriorityStudents(students, h) {
    return students.map((student) => {
      const flags = h.studentInsightFlags?.(student) || [];
      const nonStrongFlags = flags.filter((flag) => flag.type !== "strong");
      const hotList = (student.support || []).some((tag) => String(tag).toLowerCase() === "hot list");
      const supportNeed = ["Intervention", "Below level"].includes(student.level) || (student.support || []).some((tag) => ["IEP/504", "Intervention"].includes(tag));
      const score = nonStrongFlags.length * 18 + (hotList ? 22 : 0) + (supportNeed ? 18 : 0) + Math.max(0, 70 - Number(student.progress || 0));
      const reason = nonStrongFlags[0]?.label || (hotList ? "Hot List learner" : supportNeed ? "Support plan active" : "Monitor progress");
      return {
        student,
        score: Math.min(99, Math.round(score)),
        reason,
        nextMove: nextMoveForStudent(student, nonStrongFlags),
      };
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
      (h.studentInsightFlags?.(student) || [])
        .filter((flag) => flag.type !== "strong")
        .forEach((flag) => counts.set(flag.label, (counts.get(flag.label) || 0) + 1));
    });
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count, reason: clusterReason(label) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
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
      {
        title: `Mini-lesson: ${weakest || "Evidence Use"}`,
        body: recommendationForMetric(weakest, metrics[weakest]),
        timing: "Whole class · 5 minutes",
      },
      {
        title: "Priority conference",
        body: priorityStudents[0] ? `Meet with ${priorityStudents[0].student.name} first and use the recommended next move.` : "No immediate conference is needed from current demo evidence.",
        timing: "Small group · 3 minutes",
      },
      {
        title: "Exit check",
        body: "Ask each student to revise one sentence so it includes a claim, evidence, and reasoning connection.",
        timing: "Individual · 2 minutes",
      },
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

  function setView(view) {
    activeView = screenLabels[view] ? view : "dashboard";
    if (typeof window.teacherTab === "function") window.teacherTab("qwenTeacher");
  }

  window.QwenTeacherIntelligence = { render, setView };
})();
