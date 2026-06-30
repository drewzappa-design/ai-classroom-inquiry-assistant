(function () {
  function render({ state, helpers }) {
    const h = helpers || {};
    const students = state.students || [];
    const promptLog = state.aiPromptLog || [];
    const classMetrics = h.classInsightMetrics?.() || {};
    const priorityStudents = buildPriorityStudents(students, h);
    const clusters = buildMisconceptionClusters(students, h);
    const interventions = buildInterventions(classMetrics, priorityStudents);
    const providerStatus = providerMode(state);

    return `<section class="qwen-teacher-intelligence">
      ${h.pageHead(
        "Qwen Teacher Intelligence",
        "Teacher-facing class intelligence built from student inquiry evidence, AI support history, and lesson goals.",
        `<span class="pill"><span class="dot"></span>${h.esc(providerStatus.label)}</span><button class="btn secondary" onclick="teacherTab('analytics')">Class analytics</button>`
      )}
      <section class="grid stats qwen-teacher-metrics">
        ${metricCard("Priority students", priorityStudents.length, "Need teacher attention", "qwen-teacher-risk")}
        ${metricCard("Insight clusters", clusters.length, "Pattern groups detected", "qwen-teacher-clusters")}
        ${metricCard("AI support events", promptLog.length, "Logged student nudges", "qwen-teacher-events")}
        ${metricCard("Evidence use", `${classMetrics["Evidence Use"] || 0}%`, "Class signal strength", "qwen-teacher-evidence")}
      </section>

      <section class="grid two-col qwen-teacher-main-grid">
        <div class="grid">
          ${classSummaryCard(state, classMetrics, providerStatus, h)}
          ${priorityQueueCard(priorityStudents, h)}
          ${clusterCard(clusters, h)}
        </div>
        <aside class="grid">
          ${teacherBriefCard(state, priorityStudents, clusters, h)}
          ${interventionCard(interventions, h)}
          ${providerCard(providerStatus, h)}
        </aside>
      </section>
    </section>`;
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

  function metricCard(label, value, foot, accent) {
    return `<article class="card metric ${accent}"><span class="metric-label">${label}</span><strong>${value}</strong><div class="metric-foot">${foot}</div></article>`;
  }

  function classSummaryCard(state, metrics, providerStatus, h) {
    const lesson = state.lessonSetup || {};
    const weakest = weakestMetric(metrics);
    return `<article class="card card-pad qwen-teacher-class-summary">
      <div class="card-action-head">
        <div>
          <h3 class="section-title">Class Intelligence Summary</h3>
          <p class="subtle">${h.esc(lesson.subject || "Class")} · Grade ${h.esc(lesson.gradeLevel || "7")} · Teacher decision support only</p>
        </div>
        <span class="qwen-teacher-badge">Qwen</span>
      </div>
      <p class="qwen-teacher-safety-label">Recommendations are draft teacher decision support, not automatic decisions or student record changes.</p>
      <p class="qwen-teacher-lead">${h.esc(summarySentence(state, metrics))}</p>
      <div class="qwen-teacher-signal-list">
        ${Object.entries(metrics).map(([label, value]) => `<div class="bar-row"><span>${h.esc(label)}</span>${h.progress(value)}<strong>${value}%</strong></div>`).join("")}
      </div>
      <p class="recommendation"><strong>Teacher move:</strong> ${h.esc(recommendationForMetric(weakest[0], weakest[1]))}</p>
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

  function priorityStudentRow(item, h) {
    const student = item.student;
    return `<button class="qwen-teacher-priority-row" onclick="openStudentProfile('${h.esc(student.id)}')">
      <span class="qwen-teacher-priority-score">${item.score}</span>
      <span class="qwen-teacher-student-main">${h.avatar(student)}<span><strong>${h.esc(student.name)}</strong><small>${h.esc(item.reason)}</small></span></span>
      <span class="quality">${h.esc(item.nextMove)}</span>
    </button>`;
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

  function teacherBriefCard(state, priorityStudents, clusters, h) {
    const lesson = state.lessonSetup || {};
    const topStudent = priorityStudents[0]?.student?.name || "the first priority student";
    const topCluster = clusters[0]?.label || "evidence-based reasoning";
    return `<article class="card card-pad qwen-teacher-brief-card">
      <span class="eyebrow">Draft Teacher Brief</span>
      <h3>Next 10 minutes</h3>
      <p>Start with ${h.esc(topStudent)}, then model a short revision that connects claim, evidence, and reasoning for ${h.esc(topCluster.toLowerCase())}.</p>
      <p class="subtle">Ground the mini-lesson in: ${h.esc(lesson.masteryGoal || "the current lesson goal")}</p>
    </article>`;
  }

  function interventionCard(interventions, h) {
    return `<article class="card card-pad">
      <h3 class="section-title">Recommended Interventions</h3>
      <div class="qwen-teacher-intervention-list">
        ${interventions.map((item) => `<div class="timeline-item">
          <strong>${h.esc(item.title)}</strong>
          <p>${h.esc(item.body)}</p>
          <span class="quality">${h.esc(item.timing)}</span>
        </div>`).join("")}
      </div>
    </article>`;
  }

  function providerCard(providerStatus, h) {
    return `<article class="card card-pad qwen-teacher-provider-card">
      <h3 class="section-title">Provider Boundary</h3>
      <div class="detail-grid">
        <span>Mode</span><strong>${h.esc(providerStatus.label)}</strong>
        <span>Status</span><strong>${h.esc(providerStatus.status)}</strong>
        <span>Safety</span><strong>Decision support only</strong>
      </div>
      <p class="subtle">${h.esc(providerStatus.description)} Qwen does not automatically change student records, grades, hot lists, resources, or credentials.</p>
    </article>`;
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

  window.QwenTeacherIntelligence = { render };
})();
