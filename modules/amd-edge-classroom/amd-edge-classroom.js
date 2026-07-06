(function () {
  let currentState = null;
  let currentHelpers = {};

  const runtimeItems = [
    ["Local Classroom Server", "Online", "localhost edge gateway ready for classroom traffic."],
    ["Offline Ready", "Ready", "Teacher workflows continue from local demo evidence."],
    ["Cloud Assist", "Optional", "Cloud escalation stays behind policy and teacher intent."],
    ["Local Evidence Store", "Active", "Student context is read from school-local state first."],
    ["Teacher Approval", "Required", "Recommendations wait for educator review before action."],
    ["AI PC Ready", "NPU-ready", "Designed for AMD AI PC and Ryzen AI local inference paths."],
  ];

  const privacyItems = [
    ["Student data stays local", "Classroom evidence starts in the local school environment instead of a cloud-first workflow."],
    ["Teacher controlled", "The teacher approves, edits, rejects, or asks for more evidence before any action is recorded."],
    ["Cloud optional", "Hybrid cloud support is available as assistive capacity, not as the default student data path."],
    ["Audit enabled", "Approved actions and routing choices are visible for review instead of hidden behind a chat response."],
  ];

  const performanceItems = [
    ["Latency", "1.8s", "demo local analysis target"],
    ["Cloud calls avoided", "42", "kept on classroom edge"],
    ["Offline queue", "3", "sync jobs waiting"],
    ["Teacher approvals", "8", "human-reviewed actions"],
  ];

  const runtimeMonitorItems = [
    ["Local Classroom Server status", "Ready", "Demo status from the local app shell and optional backend proxy pattern."],
    ["CPU path", "Available", "General local inference path for AMD AI PC classroom workloads."],
    ["GPU path", "Available", "Future local acceleration route for supported classroom model runtimes."],
    ["NPU path", "Ready architecture", "NPU-ready architecture only; no real NPU inference is claimed."],
    ["Model route decision", "Offline Edge first", "Use local evidence and edge agents; cloud assist remains optional."],
    ["Latency estimate", "1.8s", "Demo metric for a local-first analysis flow."],
    ["Memory/load estimate", "38%", "Demo metric for classroom edge workload headroom."],
    ["Offline queue depth", "3", "Demo metric for sync jobs waiting on connectivity."],
    ["Cloud calls avoided", "42", "Demo metric showing work kept close to the school."],
  ];

  const routingSteps = [
    "Student Evidence",
    "Local Evidence Graph",
    "Classroom Edge Agents",
    "Teacher Approval",
    "Optional Cloud Assist",
  ];

  function render({ state, helpers }) {
    currentState = state;
    currentHelpers = helpers || {};
    const h = currentHelpers;
    return `<section class="amd-edge-classroom">
      ${h.pageHead(
        "AI Classroom Edge",
        "AMD-focused edge AI classroom intelligence for local, offline, and hybrid school workflows.",
        `<button class="btn" onclick="AMDEdgeClassroom.runEdgeAnalysis()">Run Edge Classroom Analysis</button><button class="btn secondary" onclick="AMDEdgeClassroom.openRuntimeMonitor()">Open Edge Runtime Monitor</button>`
      )}
      ${hero(h)}
      ${runtimeStatus(h)}
      ${edgeRuntimeMonitor(h)}
      ${routingVisualization(h)}
      ${privacyCards(h)}
      ${performanceCards(h)}
      ${ruralConnectivity(h)}
      ${quickActions(h)}
    </section>`;
  }

  function hero(h) {
    return `<section class="amd-edge-hero">
      <div class="amd-edge-hero-copy">
        <h2>AI Classroom Edge</h2>
        <p>The Edge AI Operating System for Education</p>
        <div class="amd-edge-hero-actions">
          <button class="btn sun" onclick="AMDEdgeClassroom.runEdgeAnalysis()">Run Edge Classroom Analysis</button>
          <button class="btn secondary" onclick="AMDEdgeClassroom.openRuntimeMonitor()">Open Edge Runtime Monitor</button>
          <button class="btn secondary" onclick="AMDEdgeClassroom.openPrivacyConsole()">Open Privacy Console</button>
        </div>
      </div>
      <div class="amd-edge-chip-stack" aria-label="AI Classroom Edge signals">
        ${["AMD AI PC Ready", "NPU-ready architecture", "No real NPU inference claimed"].map((item) => `<span>${h.esc(item)}</span>`).join("")}
      </div>
    </section>`;
  }

  function runtimeStatus(h) {
    return `<section class="amd-edge-section">
      <div class="amd-edge-section-head">
        <h3>Edge Runtime Status</h3>
        <p>Classroom intelligence runs locally first, with optional hybrid cloud support when policy allows it.</p>
      </div>
      <div class="amd-edge-runtime-grid">
        ${runtimeItems.map(([title, status, detail]) => `<article class="amd-edge-runtime-card">
          <div class="amd-edge-status-dot" aria-hidden="true"></div>
          <span>${h.esc(status)}</span>
          <h4>${h.esc(title)}</h4>
          <p>${h.esc(detail)}</p>
        </article>`).join("")}
      </div>
    </section>`;
  }

  function edgeRuntimeMonitor(h) {
    const route = routeStatus();
    return `<section class="amd-edge-section amd-edge-monitor" id="amd-runtime-monitor">
      <div class="amd-edge-section-head">
        <h3>Edge Runtime Monitor</h3>
        <p>AMD platform view for route decisions, local capacity, offline continuity, and future hardware acceleration paths.</p>
      </div>
      <div class="amd-edge-monitor-layout">
        <article class="amd-edge-route-card">
          <span class="amd-edge-label">Current inference route</span>
          <h4>${h.esc(route.label)}</h4>
          <p>${h.esc(route.detail)}</p>
          <div class="amd-edge-route-options" aria-label="Inference route options">
            ${["Offline Edge", "Local Server", "Cloud Assist"].map((item) => `<span class="${item === route.label ? "active" : ""}">${h.esc(item)}</span>`).join("")}
          </div>
        </article>
        <div class="amd-edge-monitor-grid">
          ${runtimeMonitorItems.map(([label, value, detail]) => `<article class="amd-edge-monitor-card">
            <span>${h.esc(label)}</span>
            <strong>${h.esc(value)}</strong>
            <p>${h.esc(detail)}</p>
          </article>`).join("")}
        </div>
      </div>
      <div class="amd-edge-disclaimer-row">
        ${["Demo metric", "NPU-ready architecture", "Future hardware acceleration path", "No real NPU inference claimed"].map((item) => `<span>${h.esc(item)}</span>`).join("")}
      </div>
    </section>`;
  }

  function routingVisualization(h) {
    return `<section class="amd-edge-section">
      <div class="amd-edge-section-head">
        <h3>Routing Visualization</h3>
        <p>Student evidence stays close to the classroom, moves through local agents, and reaches the cloud only as an optional assistive route.</p>
      </div>
      <div class="amd-edge-routing-flow" aria-label="AI Classroom Edge routing flow">
        ${routingSteps.map((step, index) => `<article>
          <div class="amd-edge-route-node">${index + 1}</div>
          <h4>${h.esc(step)}</h4>
        </article>`).join("")}
      </div>
    </section>`;
  }

  function privacyCards(h) {
    return `<section class="amd-edge-section" id="amd-privacy-console">
      <div class="amd-edge-section-head">
        <h3>Privacy Console</h3>
        <p>Designed around school-owned context, educator judgment, and transparent routing.</p>
      </div>
      <div class="amd-edge-privacy-grid">
        ${privacyItems.map(([title, detail]) => `<article class="amd-edge-privacy-card">
          <h4>${h.esc(title)}</h4>
          <p>${h.esc(detail)}</p>
        </article>`).join("")}
      </div>
    </section>`;
  }

  function performanceCards(h) {
    return `<section class="amd-edge-section">
      <div class="amd-edge-section-head">
        <h3>Performance Monitor</h3>
        <p>Demo metrics show the operating posture for an AMD AI PC classroom edge deployment.</p>
      </div>
      <div class="amd-edge-performance-grid">
        ${performanceItems.map(([label, value, foot]) => `<article class="amd-edge-performance-card">
          <span>${h.esc(label)}</span>
          <strong>${h.esc(value)}</strong>
          <p>${h.esc(foot)}</p>
        </article>`).join("")}
      </div>
    </section>`;
  }

  function ruralConnectivity(h) {
    const steps = [
      ["Internet loss", "The classroom connection drops during an inquiry block."],
      ["Local AI continues", "Teacher insights, evidence review, and approvals stay available on the edge."],
      ["Cloud sync later", "Queued summaries can sync after connectivity returns."],
    ];
    return `<section class="amd-edge-rural-panel">
      <div class="amd-edge-section-head">
        <h3>Rural Connectivity Scenario</h3>
        <p>Built for schools where the network is not always dependable but instruction still has to continue.</p>
      </div>
      <div class="amd-edge-scenario">
        ${steps.map(([title, detail], index) => `<article>
          <div class="amd-edge-step-number">${index + 1}</div>
          <h4>${h.esc(title)}</h4>
          <p>${h.esc(detail)}</p>
        </article>`).join("")}
      </div>
    </section>`;
  }

  function quickActions() {
    return `<section class="amd-edge-actions">
      <button class="btn" onclick="AMDEdgeClassroom.runEdgeAnalysis()">Run Edge Classroom Analysis</button>
      <button class="btn secondary" onclick="AMDEdgeClassroom.openTeacherWorkspace()">Open Teacher Workspace</button>
      <button class="btn secondary" onclick="AMDEdgeClassroom.openRuntimeMonitor()">Open Edge Runtime Monitor</button>
      <button class="btn secondary" onclick="AMDEdgeClassroom.openPrivacyConsole()">Open Privacy Console</button>
    </section>`;
  }

  function routeStatus() {
    const provider = currentState?.qwenTeacherIntelligence?.provider || "demo";
    if (provider === "live") {
      return {
        label: "Cloud Assist",
        detail: "Cloud Assist is selected for teacher-triggered analysis through the backend proxy; local evidence and approval boundaries still frame the route.",
      };
    }
    return {
      label: "Offline Edge",
      detail: "Offline Edge is active by default, using local classroom evidence and demo agents before any optional cloud escalation.",
    };
  }

  function scrollToPanel(id) {
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function runEdgeAnalysis() {
    if (typeof window.teacherTab === "function") window.teacherTab("qwenTeacher");
    setTimeout(() => window.QwenTeacherIntelligence?.analyzeClassroom?.(), 0);
  }

  function openTeacherWorkspace() {
    if (typeof window.teacherTab === "function") window.teacherTab("overview");
  }

  function openRuntimeMonitor() {
    scrollToPanel("amd-runtime-monitor");
  }

  function openPrivacyConsole() {
    scrollToPanel("amd-privacy-console");
  }

  window.AMDEdgeClassroom = {
    render,
    runEdgeAnalysis,
    openTeacherWorkspace,
    openRuntimeMonitor,
    openPrivacyConsole,
  };
})();
