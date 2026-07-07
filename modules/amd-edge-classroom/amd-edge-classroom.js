(function () {
  let currentState = null;
  let currentHelpers = {};
  let intermittentTimer = null;

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

  const connectivityModes = {
    normal: {
      icon: "●",
      label: "Normal Connectivity",
      tone: "green",
      cloudConnection: "Online",
      edgeRuntime: "Active",
      teacherWorkflow: "Fully Operational",
      studentEvidence: "Local + background sync",
      cloudSyncQueue: "0",
      inferenceRoute: "Hybrid edge/cloud",
      latency: "84 ms",
      expectedBehavior: "Hybrid edge/cloud routing is available. Background sync is active, while student evidence remains available locally for teacher review.",
    },
    limited: {
      icon: "●",
      label: "Limited Bandwidth",
      tone: "yellow",
      cloudConnection: "Constrained",
      edgeRuntime: "Active",
      teacherWorkflow: "Operational",
      studentEvidence: "Local first",
      cloudSyncQueue: "2 priority items",
      inferenceRoute: "Hybrid routing",
      latency: "118 ms",
      expectedBehavior: "Cloud assist runs only when necessary. Priority sync keeps teacher-approved summaries moving while local evidence and edge agents carry the workflow.",
    },
    intermittent: {
      icon: "●",
      label: "Intermittent Internet",
      tone: "orange",
      cloudConnection: "Reconnecting",
      edgeRuntime: "Taking over",
      teacherWorkflow: "Operational",
      studentEvidence: "Local with queued sync",
      cloudSyncQueue: "4 and changing",
      inferenceRoute: "Edge takeover",
      latency: "46 ms",
      expectedBehavior: "The edge runtime takes over when the connection drops, then reconnects and drains the queue as cloud access returns.",
    },
    outage: {
      icon: "●",
      label: "Internet Outage",
      tone: "red",
      cloudConnection: "Offline",
      edgeRuntime: "Active",
      teacherWorkflow: "Fully Operational",
      studentEvidence: "Local Only",
      cloudSyncQueue: "Queued",
      inferenceRoute: "Local Edge Agents",
      latency: "32 ms",
      expectedBehavior: "Teacher continues working normally. Student evidence remains available. Recommendations are generated locally. Cloud synchronization resumes automatically when connectivity returns.",
    },
  };

  const intermittentFrames = [
    {
      cloudConnection: "Dropped",
      edgeRuntime: "Taking over",
      teacherWorkflow: "Operational",
      studentEvidence: "Local only",
      cloudSyncQueue: "5 queued",
      inferenceRoute: "Local Edge Agents",
      latency: "34 ms",
      expectedBehavior: "Connection dropped. Edge agents continue the teacher workflow and preserve student evidence locally.",
    },
    {
      cloudConnection: "Reconnecting",
      edgeRuntime: "Active",
      teacherWorkflow: "Operational",
      studentEvidence: "Local with queued sync",
      cloudSyncQueue: "7 queued",
      inferenceRoute: "Edge takeover",
      latency: "41 ms",
      expectedBehavior: "Internet is unstable. The edge runtime keeps recommendations local while sync jobs wait for a reliable connection.",
    },
    {
      cloudConnection: "Online burst",
      edgeRuntime: "Active",
      teacherWorkflow: "Operational",
      studentEvidence: "Local + priority sync",
      cloudSyncQueue: "3 draining",
      inferenceRoute: "Hybrid recovery",
      latency: "76 ms",
      expectedBehavior: "Cloud access briefly returns. Priority sync resumes, then the system remains ready to fall back to edge operation.",
    },
  ];

  const simulatorFields = [
    ["Cloud Connection", "cloudConnection"],
    ["Edge Runtime", "edgeRuntime"],
    ["Teacher Workflow", "teacherWorkflow"],
    ["Student Evidence", "studentEvidence"],
    ["Cloud Sync Queue", "cloudSyncQueue"],
    ["Inference Route", "inferenceRoute"],
    ["Latency", "latency"],
  ];

  const architectureNodes = [
    "Browser",
    "Teacher Laptop",
    "AMD AI PC",
    "Local Classroom Server",
    "Edge Agents",
    "Local Evidence Store",
    "Optional Cloud Sync",
  ];

  const twinNodes = [
    ["Teacher Laptop", "Teacher command surface"],
    ["AMD AI PC", "Local inference-ready classroom device"],
    ["Local Classroom Server", "School-owned edge gateway"],
    ["Edge Agent Cluster", "Learning, intervention, privacy, sync agents"],
    ["Local Evidence Graph", "Student context stays close to school"],
    ["Student Devices", "Classroom activity and evidence capture"],
    ["Optional Cloud Sync", "Policy-controlled external route"],
  ];

  const twinScenarios = {
    normal: {
      label: "Normal",
      tone: "green",
      edgeRuntime: "Active",
      syncQueue: "0",
      teacherWorkflow: "Fully Operational",
      evidenceFlow: "Bidirectional local + background sync",
      cloudStatus: "Online",
      pulse: "steady",
    },
    limited: {
      label: "Limited Bandwidth",
      tone: "yellow",
      edgeRuntime: "Active",
      syncQueue: "2 priority",
      teacherWorkflow: "Operational",
      evidenceFlow: "Local first, priority sync",
      cloudStatus: "Constrained",
      pulse: "throttled",
    },
    outage: {
      label: "Internet Outage",
      tone: "red",
      edgeRuntime: "Active",
      syncQueue: "8 queued",
      teacherWorkflow: "Fully Operational",
      evidenceFlow: "Local only",
      cloudStatus: "Offline",
      pulse: "edge",
    },
    recovery: {
      label: "Recovery",
      tone: "orange",
      edgeRuntime: "Active",
      syncQueue: "3 draining",
      teacherWorkflow: "Operational",
      evidenceFlow: "Local plus queued sync drain",
      cloudStatus: "Reconnecting",
      pulse: "recovering",
    },
  };

  const twinMetrics = [
    ["Edge Runtime Active", "edgeRuntime"],
    ["Sync Queue", "syncQueue"],
    ["Teacher Workflow", "teacherWorkflow"],
    ["Evidence Flow", "evidenceFlow"],
    ["Cloud Status", "cloudStatus"],
  ];

  const dataBoundaryItems = [
    ["Student Evidence", "Local by default", "Evidence is read from the school-local classroom context first."],
    ["Teacher Notes", "Local by default", "Teacher observations stay in the local evidence workspace in this demo."],
    ["Approved Actions", "Local audit log", "Approved recommendations are represented as teacher-reviewed local records."],
    ["Cloud Assist", "Optional", "Cloud support is framed as a policy-controlled assistive route."],
    ["Sync Queue", "Teacher/district controlled", "Sync is shown as a governed queue instead of automatic upload."],
  ];

  const policyControls = [
    ["localOnly", "Local Only Mode"],
    ["hybridAssist", "Hybrid Cloud Assist Allowed"],
    ["teacherApproval", "Teacher Approval Required"],
    ["cloudSyncPaused", "Cloud Sync Paused"],
    ["auditTrail", "Audit Trail Enabled"],
  ];

  const privacyFlowSteps = [
    "Student Evidence",
    "Local Evidence Graph",
    "Edge Agent Analysis",
    "Teacher Approval",
    "Local Action Log",
    "Optional Cloud Sync",
  ];

  const safetyNotes = [
    "Demo policy controls",
    "No real student data",
    "No automatic student decisions",
    "No cloud upload without approval in the product vision",
    "No legal compliance claim is made",
  ];

  const baseAuditEntries = [
    ["09:12 AM", "Recommendation generated locally", "Edge Agent Analysis"],
    ["09:14 AM", "Teacher approved intervention", "Teacher Approval"],
    ["09:16 AM", "Cloud sync queued", "Sync Queue"],
    ["09:17 AM", "Cloud assist denied by policy", "Policy Control"],
  ];

  function render({ state, helpers }) {
    currentState = state;
    currentHelpers = helpers || {};
    const h = currentHelpers;
    ensureSimulatorState();
    ensurePrivacyState();
    ensureDigitalTwinState();
    syncIntermittentTimer();
    return `<section class="amd-edge-classroom">
      ${h.pageHead(
        "AI Classroom Edge",
        "AMD-focused edge AI classroom intelligence for local, offline, and hybrid school workflows.",
        `<button class="btn" onclick="AMDEdgeClassroom.runEdgeAnalysis()">Run Edge Classroom Analysis</button><button class="btn secondary" onclick="AMDEdgeClassroom.openRuntimeMonitor()">Open Edge Runtime Monitor</button>`
      )}
      ${hero(h)}
      ${runtimeStatus(h)}
      ${edgeRuntimeMonitor(h)}
      ${classroomDigitalTwin(h)}
      ${routingVisualization(h)}
      ${ruralConnectivitySimulator(h)}
      ${privacyDataOwnershipConsole(h)}
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

  function ruralConnectivitySimulator(h) {
    const selectedKey = currentState.amdEdgeConnectivity.mode;
    const selectedMode = connectivityModes[selectedKey] || connectivityModes.normal;
    const snapshot = simulatorSnapshot();
    return `<section class="amd-edge-section amd-edge-simulator" id="amd-rural-simulator">
      <div class="amd-edge-section-head">
        <h3>Rural Connectivity Simulator</h3>
        <p>Demo Scenario. No real networking changes occur. This simulator shows why edge AI matters when school connectivity changes.</p>
      </div>
      <div class="amd-edge-demo-labels">
        <span>Demo Scenario</span>
        <span>No real networking changes occur</span>
        <span>Everything is simulated</span>
      </div>
      <div class="amd-edge-simulator-layout">
        <div class="amd-edge-mode-panel">
          ${Object.entries(connectivityModes).map(([key, mode]) => `<button type="button" class="amd-edge-mode-button ${selectedKey === key ? "active" : ""} ${mode.tone}" onclick="AMDEdgeClassroom.setConnectivityMode('${h.esc(key)}')">
            <span aria-hidden="true">${h.esc(mode.icon)}</span>
            <strong>${h.esc(mode.label)}</strong>
          </button>`).join("")}
        </div>
        <article class="amd-edge-simulator-readout ${selectedMode.tone}">
          <div class="amd-edge-simulator-title">
            <span>${h.esc(selectedMode.icon)}</span>
            <div>
              <h4>${h.esc(selectedMode.label)}</h4>
              <p>${selectedKey === "intermittent" ? "Animated demo state changes every few seconds." : "Static demo state."}</p>
            </div>
          </div>
          <div class="amd-edge-simulator-grid">
            ${simulatorFields.map(([label, key]) => `<div>
              <span>${h.esc(label)}</span>
              <strong>${h.esc(snapshot[key])}</strong>
            </div>`).join("")}
          </div>
          <div class="amd-edge-expected-behavior">
            <span>Expected Behavior</span>
            <p>${h.esc(snapshot.expectedBehavior)}</p>
          </div>
        </article>
      </div>
      <div class="amd-edge-architecture-panel">
        <div class="amd-edge-section-head">
          <h3>Architecture Visualization</h3>
          <p>Local-first classroom path from browser workflow to optional cloud synchronization.</p>
        </div>
        <div class="amd-edge-architecture-flow">
          ${architectureNodes.map((node, index) => `<article>
            <span>${index + 1}</span>
            <strong>${h.esc(node)}</strong>
          </article>`).join("")}
        </div>
      </div>
      <div class="amd-edge-actions amd-edge-simulator-actions">
        <button class="btn secondary" onclick="AMDEdgeClassroom.simulateOutage()">Simulate Outage</button>
        <button class="btn secondary" onclick="AMDEdgeClassroom.restoreInternet()">Restore Internet</button>
        <button class="btn secondary" onclick="AMDEdgeClassroom.flushSyncQueue()">Flush Sync Queue</button>
        <button class="btn" onclick="AMDEdgeClassroom.runEdgeAnalysis()">Run Edge Analysis</button>
      </div>
    </section>`;
  }

  function privacyCards(h) {
    return `<section class="amd-edge-section" id="amd-privacy-cards">
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

  function privacyDataOwnershipConsole(h) {
    const policy = currentState.amdEdgePrivacy;
    const auditEntries = auditTrailEntries();
    return `<section class="amd-edge-section amd-edge-privacy-console" id="amd-privacy-console">
      <div class="amd-edge-section-head">
        <h3>Privacy & Local Data Ownership</h3>
        <p>Student intelligence stays close to the school by default. Cloud use is optional, policy-controlled, and teacher-mediated in the product vision.</p>
      </div>
      <div class="amd-edge-demo-labels">
        ${safetyNotes.map((item) => `<span>${h.esc(item)}</span>`).join("")}
      </div>
      <div class="amd-edge-boundary-grid">
        ${dataBoundaryItems.map(([title, status, detail]) => `<article class="amd-edge-boundary-card">
          <span>${h.esc(status)}</span>
          <h4>${h.esc(title)}</h4>
          <p>${h.esc(detail)}</p>
        </article>`).join("")}
      </div>
      <div class="amd-edge-policy-layout">
        <article class="amd-edge-policy-panel">
          <div class="amd-edge-section-head">
            <h3>Policy Controls</h3>
            <p>Demo status chips only. They update the local UI state and do not enforce real network, storage, or compliance policy.</p>
          </div>
          <div class="amd-edge-policy-grid">
            ${policyControls.map(([key, label]) => `<button type="button" class="amd-edge-policy-chip ${policy[key] ? "active" : ""}" onclick="AMDEdgeClassroom.togglePrivacyPolicy('${h.esc(key)}')">
              <span>${policy[key] ? "On" : "Off"}</span>
              <strong>${h.esc(label)}</strong>
            </button>`).join("")}
          </div>
        </article>
        <article class="amd-edge-audit-panel" id="amd-local-audit-log">
          <div class="amd-edge-section-head">
            <h3>Audit Trail Preview</h3>
            <p>Sample local audit events for teacher review and district policy conversations.</p>
          </div>
          <div class="amd-edge-audit-list">
            ${auditEntries.map(([time, event, source]) => `<div class="amd-edge-audit-row">
              <span>${h.esc(time)}</span>
              <strong>${h.esc(event)}</strong>
              <small>${h.esc(source)}</small>
            </div>`).join("")}
          </div>
        </article>
      </div>
      <div class="amd-edge-privacy-flow" aria-label="Privacy data flow">
        ${privacyFlowSteps.map((step, index) => `<article>
          <span>${index + 1}</span>
          <strong>${h.esc(step)}</strong>
        </article>`).join("")}
      </div>
      <div class="amd-edge-actions amd-edge-privacy-actions">
        <button class="btn secondary" onclick="AMDEdgeClassroom.enableLocalOnlyMode()">Enable Local Only Mode</button>
        <button class="btn secondary" onclick="AMDEdgeClassroom.allowHybridAssist()">Allow Hybrid Assist</button>
        <button class="btn secondary" onclick="AMDEdgeClassroom.pauseCloudSync()">Pause Cloud Sync</button>
        <button class="btn" onclick="AMDEdgeClassroom.viewLocalAuditLog()">View Local Audit Log</button>
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
      <button class="btn secondary" onclick="AMDEdgeClassroom.openDigitalTwin()">Open Classroom Digital Twin</button>
      <button class="btn secondary" onclick="AMDEdgeClassroom.openRuralSimulator()">Open Rural Connectivity Simulator</button>
      <button class="btn secondary" onclick="AMDEdgeClassroom.openPrivacyConsole()">Open Privacy Console</button>
    </section>`;
  }

  function classroomDigitalTwin(h) {
    const scenarioKey = currentState.amdEdgeDigitalTwin.scenario;
    const scenario = twinScenarios[scenarioKey] || twinScenarios.normal;
    return `<section class="amd-edge-section amd-edge-twin ${scenario.tone}" id="amd-digital-twin">
      <div class="amd-edge-section-head">
        <h3>Classroom Digital Twin</h3>
        <p>Operations-center view of the simulated classroom edge stack, from teacher laptop to optional cloud sync.</p>
      </div>
      <div class="amd-edge-demo-labels">
        <span>Everything is simulated</span>
        <span>Demo operations center</span>
        <span>No real networking or hardware control</span>
      </div>
      <div class="amd-edge-twin-layout">
        <article class="amd-edge-twin-map">
          <div class="amd-edge-twin-scenarios" aria-label="Digital twin scenarios">
            ${Object.entries(twinScenarios).map(([key, item]) => `<button type="button" class="${scenarioKey === key ? "active" : ""} ${item.tone}" onclick="AMDEdgeClassroom.setTwinScenario('${h.esc(key)}')">${h.esc(item.label)}</button>`).join("")}
          </div>
          <div class="amd-edge-twin-stack ${scenario.pulse}">
            ${twinNodes.map(([title, detail], index) => `<div class="amd-edge-twin-node ${index === twinNodes.length - 1 ? "cloud" : ""}">
              <span>${index + 1}</span>
              <strong>${h.esc(title)}</strong>
              <small>${h.esc(detail)}</small>
            </div>`).join("")}
          </div>
        </article>
        <aside class="amd-edge-twin-status">
          <div class="amd-edge-twin-current">
            <span>Active Simulation</span>
            <strong>${h.esc(scenario.label)}</strong>
            <p>${h.esc(twinSummary(scenarioKey))}</p>
          </div>
          <div class="amd-edge-twin-metrics">
            ${twinMetrics.map(([label, key]) => `<div>
              <span>${h.esc(label)}</span>
              <strong>${h.esc(scenario[key])}</strong>
            </div>`).join("")}
          </div>
        </aside>
      </div>
      <div class="amd-edge-actions amd-edge-twin-actions">
        <button class="btn secondary" onclick="AMDEdgeClassroom.resetTwinSimulation()">Reset Simulation</button>
        <button class="btn secondary" onclick="AMDEdgeClassroom.runTwinOutageScenario()">Run Outage Scenario</button>
        <button class="btn secondary" onclick="AMDEdgeClassroom.restoreTwinConnectivity()">Restore Connectivity</button>
        <button class="btn" onclick="AMDEdgeClassroom.flushTwinQueue()">Flush Queue</button>
      </div>
    </section>`;
  }

  function twinSummary(scenarioKey) {
    if (scenarioKey === "limited") return "Bandwidth is constrained, so the edge runtime preserves teacher workflow while syncing only priority items.";
    if (scenarioKey === "outage") return "Cloud is offline, but local evidence, agents, and teacher approval remain operational on the edge.";
    if (scenarioKey === "recovery") return "Cloud reconnects and the queue drains while the classroom continues using local edge services.";
    return "All routes are healthy: local edge runtime is active and background cloud sync is available.";
  }

  function ensureSimulatorState() {
    currentState.amdEdgeConnectivity ||= {};
    currentState.amdEdgeConnectivity.mode ||= "normal";
    currentState.amdEdgeConnectivity.intermittentStep ||= 0;
    currentState.amdEdgeConnectivity.queueFlushed ||= false;
  }

  function ensureDigitalTwinState() {
    currentState.amdEdgeDigitalTwin ||= {};
    currentState.amdEdgeDigitalTwin.scenario ||= "normal";
  }

  function setTwinScenario(scenario) {
    ensureDigitalTwinState();
    currentState.amdEdgeDigitalTwin.scenario = twinScenarios[scenario] ? scenario : "normal";
    currentHelpers.save?.();
    currentHelpers.render?.();
  }

  function resetTwinSimulation() {
    setTwinScenario("normal");
    scrollToPanel("amd-digital-twin");
  }

  function runTwinOutageScenario() {
    setTwinScenario("outage");
    scrollToPanel("amd-digital-twin");
  }

  function restoreTwinConnectivity() {
    setTwinScenario("recovery");
    scrollToPanel("amd-digital-twin");
  }

  function flushTwinQueue() {
    setTwinScenario("normal");
    scrollToPanel("amd-digital-twin");
  }

  function ensurePrivacyState() {
    currentState.amdEdgePrivacy ||= {};
    const policy = currentState.amdEdgePrivacy;
    if (typeof policy.localOnly !== "boolean") policy.localOnly = true;
    if (typeof policy.hybridAssist !== "boolean") policy.hybridAssist = false;
    if (typeof policy.teacherApproval !== "boolean") policy.teacherApproval = true;
    if (typeof policy.cloudSyncPaused !== "boolean") policy.cloudSyncPaused = true;
    if (typeof policy.auditTrail !== "boolean") policy.auditTrail = true;
    policy.lastPolicyAction ||= "Local Only Mode enabled";
  }

  function auditTrailEntries() {
    ensurePrivacyState();
    const policy = currentState.amdEdgePrivacy;
    const entries = [...baseAuditEntries];
    if (policy.lastPolicyAction) entries.unshift(["Now", policy.lastPolicyAction, "Demo Policy Control"]);
    if (policy.localOnly) entries.push(["09:18 AM", "Local Only Mode active", "Privacy Console"]);
    if (policy.hybridAssist) entries.push(["09:19 AM", "Hybrid assist allowed by demo policy", "Privacy Console"]);
    if (policy.cloudSyncPaused) entries.push(["09:20 AM", "Cloud sync paused by teacher/district control", "Privacy Console"]);
    return entries.slice(0, 7);
  }

  function setPrivacyPolicy(nextPolicy, action) {
    ensurePrivacyState();
    currentState.amdEdgePrivacy = {
      ...currentState.amdEdgePrivacy,
      ...nextPolicy,
      lastPolicyAction: action,
    };
    currentHelpers.save?.();
    currentHelpers.render?.();
  }

  function togglePrivacyPolicy(key) {
    ensurePrivacyState();
    if (!Object.prototype.hasOwnProperty.call(currentState.amdEdgePrivacy, key)) return;
    setPrivacyPolicy({ [key]: !currentState.amdEdgePrivacy[key] }, `${policyLabel(key)} ${currentState.amdEdgePrivacy[key] ? "disabled" : "enabled"}`);
  }

  function policyLabel(key) {
    return policyControls.find(([policyKey]) => policyKey === key)?.[1] || "Demo policy";
  }

  function enableLocalOnlyMode() {
    setPrivacyPolicy({
      localOnly: true,
      hybridAssist: false,
      cloudSyncPaused: true,
      teacherApproval: true,
      auditTrail: true,
    }, "Local Only Mode enabled");
    scrollToPanel("amd-privacy-console");
  }

  function allowHybridAssist() {
    setPrivacyPolicy({
      localOnly: false,
      hybridAssist: true,
      cloudSyncPaused: false,
      teacherApproval: true,
      auditTrail: true,
    }, "Hybrid Cloud Assist allowed by demo policy");
    scrollToPanel("amd-privacy-console");
  }

  function pauseCloudSync() {
    setPrivacyPolicy({
      cloudSyncPaused: true,
      auditTrail: true,
    }, "Cloud Sync paused");
    scrollToPanel("amd-privacy-console");
  }

  function viewLocalAuditLog() {
    scrollToPanel("amd-local-audit-log");
  }

  function simulatorSnapshot() {
    ensureSimulatorState();
    const mode = currentState.amdEdgeConnectivity.mode;
    if (mode === "intermittent") {
      const step = currentState.amdEdgeConnectivity.intermittentStep || 0;
      return intermittentFrames[step % intermittentFrames.length];
    }
    const base = connectivityModes[mode] || connectivityModes.normal;
    if (currentState.amdEdgeConnectivity.queueFlushed && mode !== "outage") {
      return {
        ...base,
        cloudSyncQueue: "0 flushed",
        expectedBehavior: `${base.expectedBehavior} The demo sync queue has been flushed.`,
      };
    }
    return base;
  }

  function setConnectivityMode(mode) {
    ensureSimulatorState();
    currentState.amdEdgeConnectivity.mode = connectivityModes[mode] ? mode : "normal";
    currentState.amdEdgeConnectivity.queueFlushed = false;
    if (mode === "intermittent") currentState.amdEdgeConnectivity.intermittentStep = 0;
    currentHelpers.save?.();
    currentHelpers.render?.();
  }

  function syncIntermittentTimer() {
    const mode = currentState?.amdEdgeConnectivity?.mode;
    if (mode !== "intermittent") {
      if (intermittentTimer) {
        clearInterval(intermittentTimer);
        intermittentTimer = null;
      }
      return;
    }
    if (intermittentTimer) return;
    intermittentTimer = setInterval(() => {
      if (!currentState?.amdEdgeConnectivity || currentState.amdEdgeConnectivity.mode !== "intermittent") {
        clearInterval(intermittentTimer);
        intermittentTimer = null;
        return;
      }
      currentState.amdEdgeConnectivity.intermittentStep = (currentState.amdEdgeConnectivity.intermittentStep + 1) % intermittentFrames.length;
      currentHelpers.save?.();
      currentHelpers.render?.();
    }, 3200);
  }

  function simulateOutage() {
    setConnectivityMode("outage");
    scrollToPanel("amd-rural-simulator");
  }

  function restoreInternet() {
    setConnectivityMode("normal");
    scrollToPanel("amd-rural-simulator");
  }

  function flushSyncQueue() {
    ensureSimulatorState();
    currentState.amdEdgeConnectivity.queueFlushed = true;
    if (currentState.amdEdgeConnectivity.mode === "outage") {
      currentState.amdEdgeConnectivity.mode = "limited";
    }
    currentHelpers.save?.();
    currentHelpers.render?.();
    scrollToPanel("amd-rural-simulator");
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

  function openDigitalTwin() {
    scrollToPanel("amd-digital-twin");
  }

  function openRuralSimulator() {
    scrollToPanel("amd-rural-simulator");
  }

  function openPrivacyConsole() {
    scrollToPanel("amd-privacy-console");
  }

  window.AMDEdgeClassroom = {
    render,
    setConnectivityMode,
    runEdgeAnalysis,
    openTeacherWorkspace,
    openRuntimeMonitor,
    openDigitalTwin,
    openRuralSimulator,
    openPrivacyConsole,
    setTwinScenario,
    resetTwinSimulation,
    runTwinOutageScenario,
    restoreTwinConnectivity,
    flushTwinQueue,
    togglePrivacyPolicy,
    enableLocalOnlyMode,
    allowHybridAssist,
    pauseCloudSync,
    viewLocalAuditLog,
    simulateOutage,
    restoreInternet,
    flushSyncQueue,
  };
})();
