const { activities, categories, defaultState, shareabilityOptions, resourceTypes } = window.InquiryData;
const app = document.querySelector("#app");
const storageKey = "inquiry-classroom-mvp";
const runtimeConfig = window.ClassroomAIConfig || {};
const providerMode = getProviderMode();

const viewerDemoResources = [
  { id: "demo-pdf-viewer", title: "Demo PDF Viewer Sample", type: "PDF", meta: "PDF preview", audience: "Teacher", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", shareability: "Public/open resource", source: "Public sample PDF", description: "A small public PDF used to verify the in-app PDF viewer.", tags: ["demo", "pdf"] },
  { id: "demo-image-viewer", title: "Rainforest Food Web Image", type: "Image", meta: "Image preview", audience: "Class", url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='520' viewBox='0 0 900 520'%3E%3Crect width='900' height='520' fill='%23dceef3'/%3E%3Crect y='310' width='900' height='210' fill='%23dceecb'/%3E%3Ccircle cx='145' cy='130' r='62' fill='%23f3c45f'/%3E%3Cpath d='M110 400 L170 220 L230 400 Z M310 410 L380 175 L450 410 Z M535 405 L600 225 L665 405 Z' fill='%23184d43'/%3E%3Ctext x='450' y='470' text-anchor='middle' font-family='Arial' font-size='32' fill='%23172522'%3ERainforest ecosystem image resource%3C/text%3E%3C/svg%3E", shareability: "Teacher-created", source: "Demo-generated image", description: "A simple image preview resource for the viewer.", tags: ["image", "ecosystem"] },
  { id: "demo-website-viewer", title: "OpenSciEd Website", type: "Website URL", meta: "External website", audience: "Teacher", url: "https://www.openscied.org/", shareability: "Public/open resource", source: "OpenSciEd website", description: "External website resource that opens safely in a new tab.", tags: ["website", "curriculum"] },
  { id: "demo-youtube-viewer", title: "Palm Oil Explainer Video", type: "YouTube URL", meta: "Embedded video", audience: "Class", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", shareability: "Public/open resource", source: "YouTube demo link", description: "YouTube resource used to verify embedded video playback.", tags: ["video", "demo"] },
  { id: "demo-google-viewer", title: "Google Doc Planning Template", type: "Google Docs URL", meta: "Google Doc", audience: "Teacher", url: "https://docs.google.com/document/d/1", shareability: "Private", source: "Demo Google Docs placeholder", description: "Google Docs resources open in a new tab so permissions remain with Google.", tags: ["google doc", "planning"] },
  { id: "demo-text-viewer", title: "Plain Text Scaffold", type: "Plain text", meta: "Text resource", audience: "Student", url: "", shareability: "Teacher-created", source: "Teacher-created", description: "A plain text resource rendered directly inside the app.", tags: ["text", "scaffold"], textContent: "Use this scaffold: A successful palm farm design should support farmers by ___ and support orangutans by ___. One constraint is ___. One criterion is ___." },
];
const classroomDemoResources = [
  { id: "demo-openscied-palm-oil-pdf", title: "OpenSciEd Palm Oil Inquiry PDF", type: "PDF", meta: "Student inquiry reading", audience: "Class", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", shareability: "Public/open resource", source: "local", description: "Demo PDF representing the palm oil and orangutan inquiry reading for Lesson 6.", subject: "Science", gradeLevel: "7", tags: ["palm oil", "orangutan", "pdf"], textContent: "" },
  { id: "demo-vocabulary-support", title: "Vocabulary Support Sheet", type: "Doc", meta: "Vocabulary scaffold", audience: "Student", url: "", shareability: "Teacher-created", source: "local", description: "Teacher-created vocabulary support for ecosystem and design-problem language.", subject: "Science", gradeLevel: "7", tags: ["vocabulary", "support"], textContent: "Key words: habitat, population, plantation, criteria, constraints, stakeholder, evidence, cause and effect.\n\nSentence frame: Palm oil production can affect orangutans because ___. My evidence is ___." },
  { id: "demo-evidence-organizer", title: "Evidence Organizer", type: "Doc", meta: "Evidence table", audience: "Student", url: "", shareability: "Teacher-created", source: "local", description: "Organizer for connecting claims, evidence, and reasoning during the palm farm design challenge.", subject: "Science", gradeLevel: "7", tags: ["evidence", "organizer"], textContent: "Claim: ___\nEvidence from the lesson: ___\nReasoning: This evidence matters because ___\nDesign criterion or constraint: ___" },
  { id: "demo-spanish-support", title: "Spanish Support Resource", type: "Doc", meta: "Spanish scaffold", audience: "Student", url: "", shareability: "Teacher-created", source: "local", description: "Spanish-language support for multilingual learners during the inquiry lesson.", subject: "Science", gradeLevel: "7", language: "Spanish", tags: ["spanish", "multilingual"], textContent: "Vocabulario: hábitat, población, plantación, evidencia, causa y efecto.\n\nMarco de oración: La producción de aceite de palma puede afectar a los orangutanes porque ___. Una evidencia es ___." },
  { id: "demo-extension-reading", title: "Extension Reading: Sustainable Palm Oil", type: "Link", meta: "Extension article", audience: "Student", url: "https://www.worldwildlife.org/pages/which-everyday-products-contain-palm-oil", shareability: "Public/open resource", source: "local", description: "Extension reading for advanced students to consider consumer products, trade-offs, and sustainability.", subject: "Science", gradeLevel: "7", tags: ["extension", "sustainability", "reading"] },
  { id: "demo-teacher-lesson-slides", title: "Teacher Lesson Slides", type: "Slides", meta: "Demo slide notes", audience: "Teacher", url: "", shareability: "Private", source: "local", description: "Teacher-facing slide sequence summary for the palm oil inquiry demo.", subject: "Science", gradeLevel: "7", tags: ["slides", "teacher"], textContent: "Slide A: Connect to the problem\nSlide B: Define the problem\nSlide C: Set a design goal\nSlide D: Identify criteria and constraints\nSlide E: Write a stronger question\nSlide F: Share with the class" },
];

let state = loadState();
const queryRole = new URLSearchParams(location.search).get("role");
if (queryRole === "teacher" || queryRole === "student" || queryRole === "edumemory") state.activeRole = queryRole;
state.dataProviderMode = providerMode;

const icons = {
  leaf: `<svg class="icon" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C13.4 3.7 18 4 21 4c0 3 .3 7.6-2.1 11.2A7 7 0 0 1 11 20Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6.94 2.17-1.06 5-1.56 8.92-1.56"/></svg>`,
  dashboard: `<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  users: `<svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  message: `<svg class="icon" viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/></svg>`,
  chart: `<svg class="icon" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/></svg>`,
  folder: `<svg class="icon" viewBox="0 0 24 24"><path d="M3 5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>`,
  coins: `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 6v12"/><path d="M15 9.5c0-1-1.34-1.5-3-1.5s-3 .5-3 1.5 1.34 1.5 3 1.5 3 .5 3 1.5-1.34 1.5-3 1.5-3-.5-3-1.5"/></svg>`,
  arrow: `<svg class="icon" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>`,
  check: `<svg class="icon" viewBox="0 0 24 24"><path d="m20 6-11 11-5-5"/></svg>`,
  logout: `<svg class="icon" viewBox="0 0 24 24"><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 19V5a2 2 0 0 0-2-2h-6"/></svg>`,
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return normalizeState(saved ? { ...structuredClone(defaultState), ...saved } : structuredClone(defaultState));
  } catch { return normalizeState(structuredClone(defaultState)); }
}
function normalizeState(next) {
  next.lessonSetup = { ...defaultState.lessonSetup, ...(next.lessonSetup || {}) };
  next.lessonBuilder = { ...defaultLessonBuilder(next.lessonSetup), ...(next.lessonBuilder || {}) };
  next.customLessons = normalizeLessons(next.customLessons || defaultLessonTemplates());
  next.activeLessonId = next.activeLessonId || next.customLessons.find((lesson) => lesson.status === "Launched")?.id || next.customLessons[0]?.id || null;
  next.selectedLessonId = next.selectedLessonId || next.activeLessonId;
  next.lessonLaunches = next.lessonLaunches || [];
  next.lessonBuilderMode = next.lessonBuilderMode || "list";
  next.selectedLessonStepId = next.selectedLessonStepId || null;
  next.aiSettings = { provider: "demo", customInstructions: "Science inquiry coach", ...(next.aiSettings || {}) };
  next.aiPromptLog = next.aiPromptLog || [];
  next.resourceList = next.resourceList || next.resources || structuredClone(defaultState.resourceList || defaultState.resources);
  const savedResourceIds = new Set(next.resourceList.map((resource) => resource.id));
  [...(defaultState.resourceList || defaultState.resources || []), ...viewerDemoResources, ...classroomDemoResources].forEach((resource) => {
    if (!savedResourceIds.has(resource.id)) next.resourceList.push(structuredClone(resource));
  });
  next.resources = next.resourceList;
  next.resourceSearch = next.resourceSearch || "";
  next.resourceFilter = next.resourceFilter || "All";
  next.misconceptionLog = next.misconceptionLog || structuredClone(defaultState.misconceptionLog);
  next.activePanel = next.activePanel || null;
  next.selectedStudent = next.selectedStudent || null;
  next.selectedResource = next.selectedResource || null;
  next.selectedNote = next.selectedNote || null;
  next.profileError = next.profileError || "";
  next.teacherStudentFilter = next.teacherStudentFilter || "all";
  next.students = (next.students || defaultState.students).map((student, index) => {
    const base = defaultState.students[index] || defaultState.students[0];
    const merged = { ...base, ...student, support: student.support || base.support || [] };
    const dateAdded = merged.dateAdded || "2026-06-11";
    const profileNotes = merged.profileNotes || (merged.notes ? [{
      id: `n-${merged.id}-seed`,
      date: dateAdded,
      teacher: "Ms. Rivera",
      type: isHotList(merged) ? "Hotlist check-in" : "General note",
      note: merged.notes,
    }] : []);
    const assignedResources = merged.assignedResources || (index < 2 ? [{
      resourceId: index === 0 ? "r1" : "r3",
      dateAssigned: dateAdded,
    }] : []);
    const hotlistInfo = {
      priority: isHotList(merged) ? "Medium" : "Not set",
      dateAdded: isHotList(merged) ? dateAdded : "",
      reason: merged.hotlistReason || merged.hotListMove || (isHotList(merged) ? "Targeted support toward next proficiency level." : ""),
      ...(merged.hotlistInfo || {}),
    };
    const demoProfile = aiDemoProfile(merged, base);
    return {
      ...merged,
      studentId: merged.studentId || merged.id,
      dateAdded,
      aiSupportLevel: demoProfile.aiSupportLevel,
      learnerDemoType: demoProfile.learnerDemoType,
      latestAIInteraction: merged.latestAIInteraction || null,
      profileNotes,
      assignedResources,
      hotlistInfo,
      aiHistory: merged.aiHistory || [],
      inquiryHistory: merged.inquiryHistory || sampleInquiryHistory(merged),
    };
  });
  next.resourceList = (next.resourceList || []).map((resource, index) => normalizeResource(resource, index, next.lessonSetup));
  next.resourceList = next.resourceList.filter((resource, index, list) => {
    const isFallbackDemo = viewerDemoResources.some((demo) => demo.id === resource.id);
    if (!isFallbackDemo) return true;
    return !list.some((other, otherIndex) => otherIndex < index && other.title === resource.title && other.type === resource.type);
  });
  if (!next.resourceAssignmentSeeded) seedDemoResourceAssignments(next);
  syncResourceAssignmentMetadata(next);
  next.resourceAssignmentSeeded = true;
  next.resources = next.resourceList;
  next.hotListStudents = next.students.filter(isHotList).map((student) => student.id);
  return next;
}
function seedDemoResourceAssignments(next = state) {
  const assignments = {
    "demo-openscied-palm-oil-pdf": ["s1", "s2", "s3", "s4", "s5", "s6"],
    "demo-vocabulary-support": ["s1", "s3", "s5"],
    "demo-evidence-organizer": ["s1", "s2", "s3", "s5"],
    "demo-spanish-support": ["s2"],
    "demo-extension-reading": ["s4", "s6"],
    "demo-teacher-lesson-slides": [],
  };
  (next.students || []).forEach((student) => {
    student.assignedResources = student.assignedResources || [];
    Object.entries(assignments).forEach(([resourceId, studentIds]) => {
      if (!studentIds.includes(student.id)) return;
      if (!student.assignedResources.some((assignment) => assignment.resourceId === resourceId)) {
        student.assignedResources.push({ resourceId, dateAssigned: "2026-06-12" });
      }
    });
  });
}
function defaultLessonBuilder(lessonSetup = defaultState.lessonSetup) {
  return {
    lessonTitle: lessonSetup.lessonTitle || "Palm Oil and Orangutan Habitats",
    gradeLevel: lessonSetup.gradeLevel || "7",
    subject: lessonSetup.subject || "Science",
    learningObjective: "Students explain cause-and-effect relationships between palm oil production and habitat loss.",
    successCriteria: "Uses evidence\nExplains cause and effect\nConsiders stakeholders",
    keyVocabulary: "palm oil\nhabitat loss\ncause and effect\nstakeholders\necosystem",
    discoveryGoals: "Palm oil is useful in many products.\nPalm farms can affect rainforest habitat.\nDesign solutions need to consider farmers and orangutans.",
    aiRestrictions: "Palm oil plantations directly cause habitat loss.\nThe final answer.",
    previewSupportLevel: 50,
    previewResponse: "Palm oil is bad.",
  };
}
function sampleInquiryHistory(student = {}) {
  const commonQuestion = "How can we design palm farms to support orangutans and farmers?";
  const histories = {
    s4: [{
      id: "iq-s4-1",
      originalQuestion: commonQuestion,
      studentResponse: "Palm oil affects more than one part of the ecosystem, so the farm design has to balance habitat and people.",
      aiFollowUp: "How could you evaluate the trade-offs between farmer income and orangutan habitat using evidence from the lesson?",
      revisedResponse: "One trade-off is that farmers need land and income, but orangutans need connected forest habitat. Evidence from the lesson shows that cleared forest reduces shelter and food, so a stronger design would protect forest corridors while still leaving some land for crops.",
      timestamp: "2026-06-12 09:18 AM",
    }],
    s1: [{
      id: "iq-s1-1",
      originalQuestion: commonQuestion,
      studentResponse: "Palm oil is bad.",
      aiFollowUp: "How does palm oil production connect to changes in orangutan habitat? What evidence supports that connection?",
      revisedResponse: "Palm oil can be a problem because forests can be cleared for plantations. One piece of evidence is that orangutans need forest habitat for food and shelter, so losing trees can affect where they live.",
      timestamp: "2026-06-12 09:24 AM",
    }],
    s3: [{
      id: "iq-s3-1",
      originalQuestion: commonQuestion,
      studentResponse: "They can just move somewhere else.",
      aiFollowUp: "What do orangutans need in a new habitat before they could survive there?",
      revisedResponse: "They need food and trees. I think moving could be hard if another forest does not have enough space.",
      timestamp: "2026-06-12 09:31 AM",
    }, {
      id: "iq-s3-2",
      originalQuestion: "What evidence helps explain habitat loss?",
      studentResponse: "I don't know.",
      aiFollowUp: "What is one thing you noticed about orangutans, forests, or palm oil?",
      revisedResponse: "I noticed orangutans need forests, but I still need help finding evidence.",
      timestamp: "2026-06-12 09:42 AM",
    }],
    s5: [{
      id: "iq-s5-1",
      originalQuestion: commonQuestion,
      studentResponse: "People should stop buying palm oil and then the problem is fixed.",
      aiFollowUp: "What trade-offs might happen if people stopped buying palm oil, and who would be affected?",
      revisedResponse: "Stopping palm oil might help forests, but farmers and companies could lose money. We need evidence about better farm designs.",
      timestamp: "2026-06-12 09:37 AM",
    }],
  };
  return structuredClone(histories[student.id] || [{
    id: `iq-${student.id || "student"}-1`,
    originalQuestion: commonQuestion,
    studentResponse: "Orangutans are losing their homes.",
    aiFollowUp: "What evidence from the lesson helps explain why that habitat is changing?",
    revisedResponse: "Orangutans need trees for food and shelter. I need to add more evidence about how palm farms change the forest.",
    timestamp: "2026-06-12 09:29 AM",
  }]);
}
const lessonStepTypes = ["Introduction", "Observation", "Question Generation", "Evidence Collection", "Reflection", "Claim", "Argument", "Discussion", "Exit Ticket"];
const aiSupportOptions = [0, 5, 10, 15, 20, 25, 30];
function defaultLessonTemplates() {
  return [
    createLessonTemplate({
      id: "lesson-openscied-ecosystems",
      title: "OpenSciEd Ecosystems",
      subject: "Science",
      gradeLevel: "7",
      standards: "MS-LS2-4",
      essentialQuestion: "How do changes in ecosystems affect the organisms that live there?",
      problemStatement: "Students investigate ecosystem change and explain how evidence can guide design decisions.",
      resources: ["demo-openscied-palm-oil-pdf", "demo-evidence-organizer"],
      aiSupportLevel: 15,
      status: "Draft",
    }),
    createLessonTemplate({
      id: "lesson-palm-oil-investigation",
      title: "Palm Oil Investigation",
      subject: "Science",
      gradeLevel: "7",
      standards: "MS-LS2-4",
      essentialQuestion: "If palm oil is not going away, how can we design palm farms to support orangutans and farmers?",
      problemStatement: "Students define a design problem that balances farmer livelihood with orangutan habitat stability.",
      resources: ["demo-openscied-palm-oil-pdf", "demo-vocabulary-support", "demo-spanish-support"],
      aiSupportLevel: 20,
      status: "Launched",
    }),
    createLessonTemplate({
      id: "lesson-water-quality",
      title: "Water Quality Investigation",
      subject: "Science",
      gradeLevel: "7",
      standards: "MS-ESS3-3",
      essentialQuestion: "How can evidence help us decide whether a local water source is healthy?",
      problemStatement: "Students use observations and data to explain possible causes of water-quality changes.",
      resources: ["demo-evidence-organizer"],
      aiSupportLevel: 15,
      status: "Draft",
    }),
    createLessonTemplate({
      id: "lesson-engineering-design",
      title: "Engineering Design Challenge",
      subject: "STEM",
      gradeLevel: "7",
      standards: "MS-ETS1-1",
      essentialQuestion: "How can constraints make a design solution stronger?",
      problemStatement: "Students design, test, and revise a solution using criteria and constraints.",
      resources: ["demo-evidence-organizer", "demo-teacher-lesson-slides"],
      aiSupportLevel: 10,
      status: "Draft",
    }),
    createLessonTemplate({
      id: "lesson-historical-inquiry",
      title: "Historical Inquiry Lesson",
      subject: "Social Studies",
      gradeLevel: "7",
      standards: "Historical Inquiry",
      essentialQuestion: "How do primary sources change the way we explain an event?",
      problemStatement: "Students compare sources, generate questions, and build evidence-based claims.",
      resources: ["demo-evidence-organizer"],
      aiSupportLevel: 15,
      status: "Draft",
    }),
  ];
}
function createLessonTemplate(overrides = {}) {
  const id = overrides.id || `lesson-${Date.now()}`;
  const title = overrides.title || "New Inquiry Lesson";
  return {
    id,
    title,
    subject: overrides.subject || "Science",
    gradeLevel: overrides.gradeLevel || "7",
    standards: overrides.standards || "Add standard",
    essentialQuestion: overrides.essentialQuestion || "What question will students investigate?",
    problemStatement: overrides.problemStatement || "Describe the problem students will explore.",
    successCriteria: overrides.successCriteria || "Uses evidence\nExplains reasoning\nReflects on new questions",
    constraints: overrides.constraints || "AI should ask questions, not give final answers.\nStudents should use lesson evidence.",
    resources: overrides.resources || [],
    aiGuidance: {
      supportLevel: overrides.aiSupportLevel ?? 15,
      provider: overrides.provider || "demo",
      customInstructions: overrides.customInstructions || "Science inquiry coach",
      directAnswerPolicy: "No direct answers",
      hintStyle: "Question-first scaffolding",
    },
    steps: overrides.steps || defaultLessonSteps(title),
    status: overrides.status || "Draft",
    archived: Boolean(overrides.archived),
    launchTarget: overrides.launchTarget || "",
    createdAt: overrides.createdAt || "2026-06-12",
    updatedAt: overrides.updatedAt || "2026-06-12",
    analytics: overrides.analytics || sampleLessonAnalytics(overrides.status || "Draft"),
  };
}
function defaultLessonSteps(title = "Inquiry Lesson") {
  return [
    { id: `step-${Date.now()}-intro`, type: "Introduction", title: "Launch the question", prompt: `Introduce the big question for ${title}.`, minutes: 5 },
    { id: `step-${Date.now()}-observe`, type: "Observation", title: "Notice and wonder", prompt: "What do you notice? What do you wonder?", minutes: 8 },
    { id: `step-${Date.now()}-evidence`, type: "Evidence Collection", title: "Gather evidence", prompt: "What evidence helps explain the problem?", minutes: 12 },
    { id: `step-${Date.now()}-claim`, type: "Claim", title: "Build a claim", prompt: "Make a claim and support it with evidence.", minutes: 10 },
    { id: `step-${Date.now()}-exit`, type: "Exit Ticket", title: "Reflect", prompt: "What changed in your thinking today?", minutes: 5 },
  ];
}
function sampleLessonAnalytics(status = "Draft") {
  const launched = status === "Launched";
  return {
    activeStudents: launched ? 23 : 0,
    completionRate: launched ? 68 : 0,
    questionsGenerated: launched ? 17 : 0,
    averageReflectionQuality: launched ? 74 : 0,
    studentsNeedingSupport: launched ? 4 : 0,
  };
}
function normalizeLessons(lessons = []) {
  const templates = lessons.length ? lessons : defaultLessonTemplates();
  return templates.map((lesson) => ({
    ...createLessonTemplate(lesson),
    ...lesson,
    aiGuidance: { ...createLessonTemplate(lesson).aiGuidance, ...(lesson.aiGuidance || {}) },
    steps: (lesson.steps || defaultLessonSteps(lesson.title)).map((step, index) => ({
      id: step.id || `step-${lesson.id}-${index}-${Date.now()}`,
      type: step.type || lessonStepTypes[Math.min(index, lessonStepTypes.length - 1)],
      title: step.title || `${step.type || "Inquiry"} step`,
      prompt: step.prompt || "Add student-facing prompt.",
      minutes: Number(step.minutes || 8),
    })),
    resources: Array.isArray(lesson.resources) ? lesson.resources : [],
    analytics: { ...sampleLessonAnalytics(lesson.status), ...(lesson.analytics || {}) },
  }));
}
function currentLesson() {
  return state.customLessons.find((lesson) => lesson.id === state.selectedLessonId) || state.customLessons[0];
}
function launchedLesson() {
  return state.customLessons.find((lesson) => lesson.id === state.activeLessonId) || currentLesson();
}
function syncResourceAssignmentMetadata(next = state) {
  const assignedByResource = new Map();
  (next.students || []).forEach((student) => {
    (student.assignedResources || []).forEach((assignment) => {
      const list = assignedByResource.get(assignment.resourceId) || [];
      if (!list.includes(student.id)) list.push(student.id);
      assignedByResource.set(assignment.resourceId, list);
    });
  });
  (next.resourceList || []).forEach((resource) => {
    resource.assignedStudentIds = assignedByResource.get(resource.id) || [];
    resource.assignedClassIds = Array.isArray(resource.assignedClassIds) ? resource.assignedClassIds : [];
  });
}
function aiDemoProfile(student, base = {}) {
  if (student.id === "s4") return { aiSupportLevel: 15, learnerDemoType: "Advanced Learner" };
  if (student.id === "s3") return { aiSupportLevel: 85, learnerDemoType: "Intervention Learner" };
  if (student.id === "s1") return { aiSupportLevel: 50, learnerDemoType: "Typical Learner" };
  const supportLevel = student.aiSupportLevel || base.aiSupportLevel || (student.support?.includes("Intervention") || student.support?.includes("IEP/504") ? 85 : student.support?.includes("Gifted") ? 15 : 50);
  return {
    aiSupportLevel: supportLevel,
    learnerDemoType: student.learnerDemoType || base.learnerDemoType || (supportLevel === 15 ? "Advanced Learner" : supportLevel === 85 ? "Intervention Learner" : "Typical Learner"),
  };
}
function normalizeResource(resource, index = 0, lessonSetup = defaultState.lessonSetup) {
  const type = resource.type || "PDF";
  const title = resource.title || "Untitled resource";
  const legacySource = resource.source || "";
  const source = legacySource === "google_drive" ? "google_drive" : "local";
  const shareability = resource.shareability || shareabilityFromVisibility(resource.visibility);
  const visibility = resource.visibility || visibilityFromShareability(shareability, resource.audience);
  const webViewLink = resource.webViewLink || (/^https?:/.test(resource.url || "") ? resource.url : "");
  const downloadUrl = resource.downloadUrl || (resource.url && !webViewLink ? resource.url : "");
  const createdAt = resource.createdAt || resource.dateAdded || "2026-06-11";
  return {
    ...resource,
    id: resource.id || `r${Date.now()}-${index}`,
    title,
    type,
    source,
    driveFileId: resource.driveFileId || "",
    webViewLink,
    downloadUrl,
    visibility,
    assignedStudentIds: Array.isArray(resource.assignedStudentIds) ? resource.assignedStudentIds : [],
    assignedClassIds: Array.isArray(resource.assignedClassIds) ? resource.assignedClassIds : [],
    createdBy: resource.createdBy || "Ms. Rivera",
    createdAt,
    shareability,
    licenseStatus: resource.licenseStatus || resource.copyrightStatus || (legacySource && legacySource !== "local" && legacySource !== "google_drive" ? legacySource : resource.notes || ""),
    category: resource.category || type,
    subject: resource.subject || lessonSetup?.subject || "Science",
    gradeLevel: resource.gradeLevel || resource.grade || lessonSetup?.gradeLevel || "7",
    tags: Array.isArray(resource.tags) ? resource.tags : String(resource.tags || resource.meta || "").split(",").map((tag) => tag.trim()).filter(Boolean),
    description: resource.description || resource.notes || resource.meta || `${title} resource for Lesson 6.`,
    dateAdded: resource.dateAdded || createdAt.slice(0, 10),
    textContent: resource.textContent || "",
    url: resource.url || webViewLink || downloadUrl || "",
  };
}
function visibilityFromShareability(shareability = "", audience = "") {
  const value = String(shareability).toLowerCase();
  if (value.includes("school")) return "school";
  if (value.includes("district")) return "district";
  if (value.includes("public") || value.includes("open")) return "public";
  if (value.includes("teacher-created") || value.includes("ai-created")) return "class";
  if (String(audience).toLowerCase() === "student" || String(audience).toLowerCase() === "class") return "class";
  return "private";
}
function shareabilityFromVisibility(visibility = "") {
  if (visibility === "school") return "Share with school";
  if (visibility === "district") return "Share with district";
  if (visibility === "public") return "Public/open resource";
  if (visibility === "class") return "Teacher-created";
  return "Private";
}
function getProviderMode() {
  const params = new URLSearchParams(location.search);
  const requested = params.get("provider") || params.get("data") || runtimeConfig.DATA_PROVIDER || "local";
  return String(requested).toLowerCase() === "supabase" ? "supabase" : "local";
}
function providerLabel() {
  return providerMode === "supabase" ? "Supabase read-only" : "Local demo";
}
function save() { localStorage.setItem(storageKey, JSON.stringify(state)); }
function student() { return state.students.find((item) => item.id === state.activeStudentId) || state.students[0]; }
function esc(value = "") { return String(value).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])); }
function hotListText(value) { return String(value || "").toLowerCase() === "hot list"; }
function isHotList(student) { return (student.support || []).some(hotListText); }
function tag(text) { return `<span class="tag ${hotListText(text) ? "hot" : ""}">${esc(text)}</span>`; }
function supportTag(text) { return `<span class="tag ${hotListText(text) ? "hot" : ""}">${esc(text)}</span>`; }
function progress(value) { return `<div class="progress"><span style="width:${value}%"></span></div>`; }
function avatar(person) { return `<span class="avatar">${esc(person.initials)}</span>`; }
function setRole(role) { state.activeRole = role; save(); render(); }
const resourceProvider = window.ResourceProviders.createResourceProvider(providerMode === "supabase" ? "supabase" : "localStorage", {
  getState: () => state,
  saveState: save,
  normalizeResource,
  fileToDataUrl,
  today,
  supabaseUrl: runtimeConfig.SUPABASE_URL,
  supabaseAnonKey: runtimeConfig.SUPABASE_ANON_KEY,
  onMissingResource: () => {
    alert("No URL or uploaded file is available for this resource yet.");
    state.profileError = "This resource does not have a link or file URL yet.";
    render();
  },
});
const aiProvider = {
  scaffold(input) {
    return currentAIProvider(input?.lessonSetup).scaffold(input);
  },
};
function currentAIProvider(lessonSetup = state?.lessonSetup || defaultState.lessonSetup) {
  const lesson = launchedLesson?.();
  const provider = lesson?.aiGuidance?.provider || state?.aiSettings?.provider || "demo";
  const customInstructions = lesson?.aiGuidance?.customInstructions || state?.aiSettings?.customInstructions || "Science inquiry coach";
  return window.InquiryAIProvider?.createAIProvider(provider, {
    lessonTitle: lessonSetup.lessonTitle || defaultState.lessonSetup.lessonTitle,
    customInstructions,
    openAIKey: runtimeConfig.OPENAI_API_KEY,
    anthropicKey: runtimeConfig.ANTHROPIC_API_KEY,
    geminiKey: runtimeConfig.GEMINI_API_KEY,
    openAIEndpoint: runtimeConfig.OPENAI_ENDPOINT,
    anthropicEndpoint: runtimeConfig.ANTHROPIC_ENDPOINT,
    geminiEndpoint: runtimeConfig.GEMINI_ENDPOINT,
  }) || window.InquiryAIProvider?.createAIProvider("demo", { lessonTitle: lessonSetup.lessonTitle });
}
const ResourceStorage = {
  async uploadFile(file, metadata = {}) {
    try {
      return await resourceProvider.upload({ file, metadata });
    } catch (error) {
      alert(error.message || "Resource upload is not available right now.");
      return null;
    }
  },
  async toggleShareability(resourceId) {
    try {
      await resourceProvider.share(resourceId);
    } catch (error) {
      alert(error.message || "Resource sharing is not available right now.");
    }
    render();
  },
  async deleteResource(resourceId) {
    try {
      await resourceProvider.delete(resourceId);
    } catch (error) {
      alert(error.message || "Resource deletion is not available right now.");
    }
    state.teacherTab = "resources";
    state.activePanel = null;
    render();
  },
};
function requestRestartDemo() {
  openPanel("restartDemo");
}
function confirmRestartDemo() {
  const role = state.activeRole || queryRole || "teacher";
  localStorage.removeItem(storageKey);
  state = normalizeState(structuredClone(defaultState));
  state.activeRole = role;
  state.dataProviderMode = providerMode;
  state.teacherTab = "overview";
  state.studentTab = "lesson";
  state.activePanel = null;
  state.selectedStudent = state.students[0]?.id || null;
  state.selectedResource = state.resourceList[0]?.id || null;
  save();
  render();
}
function openPanel(panel, payload = {}) {
  state.activePanel = panel;
  state.selectedStudent = payload.studentId || state.selectedStudent || state.hotListStudents[0] || state.students[0]?.id;
  state.selectedResource = payload.resourceId || state.selectedResource || state.resourceList[0]?.id;
  state.selectedNote = payload.noteId || state.selectedNote || null;
  state.profileError = "";
  save();
  render();
}
function closePanel() { state.activePanel = null; save(); render(); }
function today() { return new Date().toISOString().slice(0, 10); }
function openStudentProfile(studentId) {
  state.selectedStudent = studentId;
  state.teacherTab = "studentProfile";
  state.activePanel = null;
  state.profileError = "";
  save();
  render();
}
function openResourceViewer(resourceId, returnTab = state.teacherTab) {
  state.selectedResource = resourceId;
  state.resourceReturnTab = returnTab === "resourceViewer" ? "resources" : returnTab;
  state.teacherTab = "resourceViewer";
  state.activePanel = null;
  state.profileError = "";
  save();
  render();
}
function openStudentResourceViewer(resourceId) {
  state.selectedResource = resourceId;
  state.studentTab = "resourceViewer";
  save();
  render();
}
function openResourceUrl(resourceId) {
  openResourceExternally(resourceId);
}

function topbar(context) {
  return `<header class="topbar">
    <div class="brand"><div class="brand-mark">${icons.leaf}</div><div><strong>Inquiry Classroom</strong><span>AI-guided learning</span></div></div>
    <div class="top-actions"><small>${esc(context)}</small><button class="btn ghost" style="color:#fff;border-color:rgba(255,255,255,.25)" onclick="requestRestartDemo()">Restart Demo</button><button class="icon-btn" title="Switch role" onclick="setRole(null)">${icons.logout}</button></div>
  </header>`;
}

function rolePage() {
  return `<main class="role-page">
    <section class="role-art">
      <span class="pill"><span class="dot"></span> OpenSciEd 7.5 · Lesson 6</span>
      <h1>Think deeply. Design responsibly.</h1>
      <p>Explore how palm farms can support farmers while protecting rainforest ecosystems. Use evidence, ask sharper questions, and build a more stable system.</p>
    </section>
    <section class="role-panel">
      <div class="brand"><div class="brand-mark" style="color:var(--forest);border-color:var(--line)">${icons.leaf}</div><div><strong style="color:var(--forest)">Inquiry Classroom</strong><span style="color:var(--muted)">Purposeful classroom AI</span></div></div>
      <h2>How are you joining?</h2>
      <p>Choose a demo workspace. Everything is preloaded so you can explore the complete Lesson 6 flow.</p>
      <button class="role-card" onclick="setRole('teacher')"><span class="role-icon">${icons.users}</span><span><strong>Teacher workspace</strong><span class="subtle">Launch the lesson, review insights, and moderate questions</span></span></button>
      <button class="role-card" onclick="setRole('student')"><span class="role-icon">${icons.leaf}</span><span><strong>Student lesson</strong><span class="subtle">Join Ms. Rivera's class with code ECOSYS</span></span></button>
      <button class="role-card edumemory-entry" onclick="setRole('edumemory')"><span class="role-icon">${icons.check}</span><span><strong>EduMemory Demo</strong><span class="subtle">Sui Overflow learning passport and opportunity network</span></span></button>
      <button class="btn ghost" onclick="requestRestartDemo()">Reset demo data</button>
    </section>
  </main>`;
}

function teacherNav() {
  const items = [
    ["overview", icons.dashboard, "Overview"],
    ["setup", icons.folder, "Setup wizard"],
    ["lessonBuilderDashboard", icons.folder, "Lesson Builder"],
    ["students", icons.users, "Students"],
    ["moderation", icons.message, "DQB moderation"],
    ["analytics", icons.chart, "Analytics"],
    ["usage", icons.coins, "Inquiry Credits"],
    ["resources", icons.folder, "Resources"],
  ];
  return `<aside class="sidebar"><p class="sidebar-label">Teacher workspace</p>${items.map(([id, icon, label]) => `<button class="nav-btn ${state.teacherTab === id ? "active" : ""}" onclick="teacherTab('${id}')">${icon}<span>${label}</span></button>`).join("")}
    <button class="nav-btn edumemory-nav-entry" onclick="setRole('edumemory')">${icons.check}<span>EduMemory Demo</span></button>
    <div class="sidebar-note"><strong>Short, purposeful sessions</strong><br/>This lesson support tool is designed for focused 5-10 minute check-ins.</div></aside>`;
}
function teacherTab(tab) { state.teacherTab = tab; save(); render(); }

function teacherShell() {
  return `<div class="app">${topbar("Ms. Rivera · 7th Grade Science")}<div class="layout">${teacherNav()}<main class="content">${teacherPage()}</main></div>${activePanelMarkup()}</div>`;
}
function teacherPage() {
  return ({ overview: overviewPage, setup: setupPage, lessonBuilderDashboard: lessonBuilderDashboardPage, students: studentsPage, studentProfile: studentProfilePage, resourceViewer: resourceViewerPage, moderation: moderationPage, analytics: analyticsPage, usage: usagePage, resources: resourcesPage }[state.teacherTab] || overviewPage)();
}
function pageHead(title, subtitle, actions = "") {
  return `<header class="page-head"><div><h1>${title}</h1><p>${subtitle}</p></div><div class="role-actions">${actions}</div></header>`;
}
function metric(label, value, foot, panel = "") {
  const attrs = panel ? ` role="button" tabindex="0" onclick="openPanel('${panel}')" onkeydown="panelKey(event,'${panel}')"` : "";
  return `<div class="card metric ${panel ? "click-card" : ""}"${attrs}><span class="metric-label">${label}</span><strong>${value}</strong><div class="metric-foot">${foot}</div>${panel ? `<div class="view-details">View details ${icons.arrow}</div>` : ""}</div>`;
}
function detailCard(title, body, panel, icon = icons.arrow) {
  return `<article class="card card-pad click-card" role="button" tabindex="0" onclick="openPanel('${panel}')" onkeydown="panelKey(event,'${panel}')"><div class="card-action-head"><h3 class="section-title">${title}</h3><span class="icon-btn mini">${icon}</span></div>${body}<div class="view-details">View details ${icons.arrow}</div></article>`;
}
function panelKey(event, panel, payload = {}) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openPanel(panel, payload);
  }
}
function overviewPage() {
  const pending = state.dqb.filter((q) => q.status === "pending").length;
  const hotList = state.students.filter(isHotList);
  const usedCredits = state.students.reduce((sum, s) => sum + Number(s.used || 0), 0);
  const totalCredits = state.students.reduce((sum, s) => sum + Number(s.monthlyCredits || 0), 0);
  const supportBody = teacherAlertBody();
  const hotBody = `${hotList.map(s => `<div class="student-line" style="padding:9px 0;border-top:1px solid var(--line)">${avatar(s)}<span><strong class="student-name">${esc(s.name)}</strong><br/><span class="subtle">${esc(s.hotListMove || "Close to next proficiency level")}</span></span></div>`).join("")}`;
  const misconceptionBody = `${misconceptionSummary().map(([t,c]) => `<div class="bar-row"><span>${esc(t)}</span>${progress(Math.min(100, c * 24 + 20))}<strong>${c}</strong></div>`).join("")}`;
  const aiBody = teacherAIDashboardBody();
  return `${pageHead("Good morning, Ms. Rivera", `${esc(state.lessonSetup.subject)} · Period 2`, `<span class="pill"><span class="dot"></span> Lesson live</span><button class="btn secondary" onclick="teacherTab('setup')">Configure lesson</button>`)}
    <section class="grid stats">${metric("Students active", "23 / 27", "85% participation", "support")}${metric("Hot List students", hotList.length, "close to next level", "hotList")}${metric("Questions to review", pending, "DQB moderation queue", "questionQuality")}${metric("Inquiry Credits used", `${usedCredits}`, `${Math.max(0, totalCredits - usedCredits)} remain`, "credits")}</section>
    <section class="grid two-col" style="margin-top:14px">
      <div class="grid">
        <article class="card lesson-banner"><div class="inner"><span class="pill">Active lesson · OpenSciEd 7.5</span><h2>If palm oil is not going away, how can we design palm farms to support orangutans and farmers?</h2><p>Students define a complex design problem, co-construct criteria and constraints, and develop questions for the Driving Question Board.</p><button class="btn sun" onclick="setRole('student')">Preview student view</button></div></article>
        <article class="card card-pad"><h3 class="section-title">Teacher-defined mastery</h3><p style="line-height:1.55;margin-bottom:8px">${esc(state.lessonSetup.masteryGoal)}</p><span class="pill">${esc(state.lessonSetup.standardsPath)}</span><span class="pill">${esc(state.lessonSetup.supportLevel)}</span><span class="pill">${esc(state.lessonSetup.sessionLimit)}</span></article>
        <article class="card card-pad"><h3 class="section-title">Lesson sequence</h3><ul class="activity-list">${activities.map((a, i) => `<li class="activity-item"><span class="number">${i + 1}</span><span><strong>${esc(a.title)}</strong><br/><span class="subtle">Slide ${a.slide} · ${a.minutes} min</span></span><span class="quality">${i < 4 ? "In progress" : "Upcoming"}</span></li>`).join("")}</ul></article>
      </div>
      <div class="grid">
        ${detailCard("Makeathon Demo Script", `<p class="subtle">How to demonstrate the AI Inquiry Companion in under 90 seconds.</p><p class="quality">AI as a thinking coach, not an answer machine.</p>`, "makeathonDemo", icons.check)}
        ${detailCard("Teacher Lesson Builder", `<p class="subtle">Define lesson context so AI scaffolds from teacher goals instead of generic prompts.</p><p class="quality">Preview context-aware Question Matrix support.</p>`, "lessonBuilder", icons.folder)}
        ${detailCard("AI Support Comparison Demo", `<p class="subtle">Same student idea. Different levels of teacher-controlled AI support.</p><p class="quality">Run the 15% / 50% / 85% scaffold comparison.</p>`, "aiComparison", icons.chart)}
        ${detailCard("AI scaffold monitor", aiBody, "aiDashboard", icons.message)}
        ${detailCard("Students Needing Support", supportBody, "support", icons.users)}
        ${detailCard("Class Heat Map", classHeatMapBody(), "support", icons.chart)}
        ${detailCard("Hot List movement", hotBody, "hotList", icons.check)}
        ${detailCard("Common misconceptions", misconceptionBody, "misconceptions", icons.chart)}
        ${detailCard("Question quality trends", questionQualityBody(), "questionQuality", icons.message)}
        ${detailCard("Students ready for extension", extensionBody(), "extension", icons.arrow)}
        ${detailCard("Teacher resources", `<p class="subtle">${state.resourceList.length} resources connected to Lesson 6.</p><p class="quality">Copyright and shareability metadata included.</p>`, "resources", icons.folder)}
        ${detailCard("English/Spanish usage", `<p class="subtle">${state.students.filter(s => s.language === "Spanish").length} students using Spanish support.</p>${progress(28)}`, "language", icons.message)}
      </div>
    </section>`;
}
function extensionBody() {
  return state.students.filter((s) => s.proficiency === "Distinguished" || s.support.includes("Gifted") || s.hotListMove === "Proficient close to Distinguished").map(studentMini).join("");
}
function questionQualityBody() {
  const strong = state.dqb.filter((q) => q.quality === "Strong").length;
  const investigable = state.dqb.filter((q) => q.quality === "Investigable").length;
  return `<div class="bar-row"><span>Strong</span>${progress(strong * 22)}<strong>${strong}</strong></div><div class="bar-row"><span>Investigable</span>${progress(investigable * 22)}<strong>${investigable}</strong></div><div class="bar-row"><span>Needs revision</span>${progress(24)}<strong>1</strong></div>`;
}
function teacherAlertBody() {
  const alerts = teacherAlertStudents().slice(0, 4);
  if (!alerts.length) return `<div class="empty">No inquiry flags right now.</div>`;
  return alerts.map(({ student: s, flags, lastActivity }) => `<div class="student-line click-row" role="button" tabindex="0" onclick="event.stopPropagation(); openStudentProfile('${s.id}')" onkeydown="studentKey(event,'${s.id}')" style="padding:9px 0;border-top:1px solid var(--line)">${avatar(s)}<span><strong class="student-name">${esc(s.name)}</strong><br/><span class="subtle">${flags.length} flag${flags.length === 1 ? "" : "s"} · Last activity ${esc(lastActivity)}</span></span></div>`).join("");
}
function teacherAlertStudents() {
  return state.students
    .map((student) => {
      const flags = studentInsightFlags(student).filter((flag) => flag.type !== "strong");
      return { student, flags, lastActivity: latestInquiryTimestamp(student) || "No activity" };
    })
    .filter((item) => item.flags.length)
    .sort((a, b) => b.flags.length - a.flags.length || String(b.lastActivity).localeCompare(String(a.lastActivity)));
}
function classHeatMapBody() {
  const metrics = classInsightMetrics();
  return Object.entries(metrics).map(([label, value]) => `<div class="bar-row heat-row"><span>${esc(label)}</span>${progress(value)}<strong>${value}%</strong></div>`).join("");
}
function classInsightMetrics() {
  const profiles = state.students.map(studentInsightProfile);
  const avg = (key) => Math.round(profiles.reduce((sum, item) => sum + item[key], 0) / Math.max(1, profiles.length));
  return {
    "Questioning Skills": avg("questioning"),
    "Evidence Use": avg("evidence"),
    "Reasoning Quality": avg("reasoning"),
    "Reflection Quality": avg("reflection"),
  };
}
function studentInsightProfile(student) {
  const entries = student.inquiryHistory || [];
  if (!entries.length) return { questioning: 45, evidence: 45, reasoning: 45, reflection: 45 };
  const scores = entries.map((entry) => {
    const combined = `${entry.studentResponse || ""} ${entry.revisedResponse || ""}`.toLowerCase();
    const revised = String(entry.revisedResponse || "").toLowerCase();
    return {
      questioning: hasAny(entry.aiFollowUp, ["what", "how", "why", "evidence", "trade-off", "extent"]) ? 84 : 58,
      evidence: hasAny(combined, ["evidence", "lesson", "shows", "data", "piece", "because"]) ? 82 : 44,
      reasoning: hasAny(combined, ["because", "cause", "effect", "connect", "so", "therefore", "trade-off"]) ? 78 : 42,
      reflection: revised.length > String(entry.studentResponse || "").length + 25 ? 80 : 48,
    };
  });
  const avg = (key) => Math.round(scores.reduce((sum, item) => sum + item[key], 0) / scores.length);
  return { questioning: avg("questioning"), evidence: avg("evidence"), reasoning: avg("reasoning"), reflection: avg("reflection") };
}
function studentInsightFlags(student) {
  const flags = [];
  const misconceptionHits = new Map();
  (student.inquiryHistory || []).forEach((entry) => {
    const entryFlags = analyzeInquiryEntry(entry);
    entryFlags.forEach((flag) => {
      if (flag.type === "misconception") misconceptionHits.set(flag.reason, (misconceptionHits.get(flag.reason) || 0) + 1);
      flags.push(flag);
    });
  });
  misconceptionHits.forEach((count, reason) => {
    if (count > 1) flags.push({ type: "misconception", label: "Possible Misconception", reason: `Repeated: ${reason}` });
  });
  return dedupeFlags(flags);
}
function analyzeInquiryEntry(entry = {}) {
  const response = String(entry.studentResponse || "");
  const revised = String(entry.revisedResponse || "");
  const combined = `${response} ${revised}`.toLowerCase();
  const flags = [];
  const hasEvidence = hasAny(combined, ["evidence", "lesson", "shows", "data", "piece of evidence", "according"]);
  const hasReasoning = hasAny(combined, ["because", "cause", "effect", "connect", "so", "therefore", "trade-off"]);
  if (!hasEvidence) flags.push({ type: "evidence", label: "Needs Evidence", reason: "Response does not clearly cite lesson evidence." });
  if (hasAny(response, ["bad", "good", "should", "always", "never"]) && !hasAny(response, ["because", "evidence", "data", "lesson"])) {
    flags.push({ type: "weak", label: "Weak Reasoning", reason: "Claim needs a reason or evidence connection." });
  }
  if (hasAny(combined, ["just move", "somewhere else", "stop buying", "problem is fixed", "palm oil is bad", "i don't know", "i dont know"])) {
    flags.push({ type: "misconception", label: "Possible Misconception", reason: "May oversimplify a complex ecosystem problem." });
  }
  if (!hasReasoning || revised.split(/\s+/).filter(Boolean).length < 12) {
    flags.push({ type: "weak", label: "Weak Reasoning", reason: "Reasoning is incomplete or too brief." });
  }
  if (hasEvidence && hasReasoning && revised.length > response.length + 20) {
    flags.push({ type: "strong", label: "Strong Reasoning", reason: "Revision connects evidence with cause-and-effect reasoning." });
  }
  return dedupeFlags(flags);
}
function dedupeFlags(flags) {
  const seen = new Set();
  return flags.filter((flag) => {
    const key = `${flag.type}-${flag.label}-${flag.reason}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function hasAny(value = "", terms = []) {
  const text = String(value).toLowerCase();
  return terms.some((term) => text.includes(String(term).toLowerCase()));
}
function insightBadge(flag) {
  const iconsByType = { evidence: "🟡", weak: "🟠", misconception: "🔴", strong: "🟢" };
  return `<span class="insight-badge ${esc(flag.type)}">${iconsByType[flag.type] || "🟡"} ${esc(flag.label)}</span>`;
}
function latestInquiryTimestamp(student) {
  return (student.inquiryHistory || [])[0]?.timestamp || "";
}

function activePanelMarkup() {
  if (!state.activePanel) return "";
  const panels = {
    hotList: hotListPanel,
    support: supportPanel,
    extension: extensionPanel,
    misconceptions: misconceptionsPanel,
    questionQuality: questionQualityPanel,
    makeathonDemo: makeathonDemoPanel,
    lessonBuilder: lessonBuilderPanel,
    aiComparison: aiComparisonPanel,
    aiDashboard: aiDashboardPanel,
    credits: creditsPanel,
    language: languagePanel,
    resources: resourceManagerPanel,
    resourceDetail: resourceDetailPanel,
    editResource: editResourcePanel,
    deleteResource: deleteResourcePanel,
    studentDetail: studentDetailPanel,
    editStudent: editStudentPanel,
    addNote: addNotePanel,
    editNote: editNotePanel,
    studentInquiryReport: studentInquiryReportPanel,
    editHotlist: editHotlistPanel,
    assignResource: assignResourcePanel,
    assignResourceStudents: assignResourceStudentsPanel,
    deleteStudent: deleteStudentPanel,
    restartDemo: restartDemoPanel,
    addStudent: addStudentPanel,
    addResource: addResourcePanel,
  };
  const renderPanel = panels[state.activePanel] || supportPanel;
  return `<div class="panel-backdrop" onclick="closePanel()"></div><aside class="detail-panel" role="dialog" aria-modal="true">${renderPanel()}</aside>`;
}
function restartDemoPanel() {
  return `${panelHeader("Restart Demo", "Reset the app to the original starter state.")}
    <article class="panel-card"><p class="warning">This will clear temporary students, uploaded resources, resource edits, notes, hotlist changes, and assignments, then reload the sample students, resources, hotlist items, and assignments.</p><div class="role-actions" style="margin-top:12px"><button class="btn danger" onclick="confirmRestartDemo()">Restart Demo</button><button class="btn secondary" onclick="closePanel()">Cancel</button></div></article>`;
}
function panelHeader(title, subtitle = "") {
  return `<div class="panel-head"><div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ""}</div><button class="icon-btn" aria-label="Close panel" title="Close panel" onclick="closePanel()">×</button></div>`;
}
function studentPanelCard(s, editable = false) {
  const recommended = recommendedScaffold(s);
  return `<article class="panel-card">
    <div class="student-line">${avatar(s)}<span><strong>${esc(s.name)}</strong><br/><span class="subtle">${esc(s.proficiency)} · ${esc(s.language)} · ${esc(s.className)}</span></span></div>
    <div class="mini-grid">
      <div><span class="subtle">Target level</span>${editable ? `<select onchange="updateStudent('${s.id}','hotListMove',this.value)">${["Novice close to Apprentice","Apprentice close to Proficient","Proficient close to Distinguished",""].map(v => `<option value="${esc(v)}" ${v === s.hotListMove ? "selected" : ""}>${esc(v || "No target")}</option>`).join("")}</select>` : `<strong>${esc(s.hotListMove || "Not set")}</strong>`}</div>
      <div><span class="subtle">Reading / math</span><strong>${esc(s.reading)} / ${esc(s.math)}</strong></div>
      <div><span class="subtle">Inquiry Credits</span>${editable ? `<input type="range" min="0" max="100" step="5" value="${s.allocation}" oninput="updateAllocation('${s.id}',this.value)"><strong>${s.allocation}%</strong>` : `<strong>${s.allocation}% · ${Math.max(0, Number(s.monthlyCredits || 0) - Number(s.used || 0))} left</strong>`}</div>
      <div><span class="subtle">Support tags</span><div>${s.support.map(supportTag).join("")}</div></div>
    </div>
    <p class="recommendation">${esc(recommended)}</p>
    <button class="btn secondary" onclick="openStudentProfile('${s.id}')">Open Profile</button>
    ${editable ? `<label class="toggle-line"><input type="checkbox" ${isHotList(s) ? "checked" : ""} onchange="toggleHotList('${s.id}',this.checked)"> Mark as Hot List</label><label class="subtle">Teacher notes</label><textarea onchange="updateStudent('${s.id}','notes',this.value)">${esc(s.notes)}</textarea>` : `<p class="subtle"><strong>Teacher notes:</strong> ${esc(s.notes)}</p>`}
  </article>`;
}
function hotListPanel() {
  const hot = state.students.filter(isHotList);
  return `${panelHeader("Hot List students", "Students close to moving up a proficiency level.")}
    <div class="panel-stack">${hot.length ? hot.map((s) => studentPanelCard(s, true)).join("") : `<article class="panel-card empty"><h3>No Hot List students yet.</h3><p class="subtle">Add a student or mark an existing profile as Hot List to start tracking targeted support.</p><button class="btn" onclick="openPanel('addStudent')">Add student</button></article>`}</div>`;
}
function supportPanel() {
  const students = teacherAlertStudents();
  return `${panelHeader("Students Needing Support", "Inquiry flags help you spot missing evidence, weak reasoning, and possible misconceptions.")}
    <div class="panel-stack">
      <article class="panel-card"><h3>Class Heat Map</h3>${classHeatMapBody()}</article>
      ${students.length ? students.map(({ student: s, flags, lastActivity }) => teacherAlertPanelCard(s, flags, lastActivity)).join("") : `<article class="panel-card empty">No inquiry support flags right now.</article>`}
    </div>`;
}
function teacherAlertPanelCard(s, flags, lastActivity) {
  return `<article class="panel-card">
    <div class="card-action-head">
      <div class="student-line">${avatar(s)}<span><strong>${esc(s.name)}</strong><br/><span class="subtle">${esc(s.proficiency)} · ${esc(s.level)} · Last activity ${esc(lastActivity)}</span></span></div>
      <span class="pill">${flags.length} flag${flags.length === 1 ? "" : "s"}</span>
    </div>
    <div class="badge-row">${flags.slice(0, 4).map(insightBadge).join("")}</div>
    <p class="recommendation">${esc(recommendedScaffold(s))}</p>
    <button class="btn secondary" onclick="openStudentProfile('${s.id}')">Open Profile</button>
  </article>`;
}
function extensionPanel() {
  const students = state.students.filter((s) => s.proficiency === "Distinguished" || s.support.includes("Gifted") || s.hotListMove === "Proficient close to Distinguished");
  return `${panelHeader("Students ready for extension", "Push these students toward evidence, tradeoffs, and system-level reasoning.")}<div class="panel-stack">${students.map((s) => studentPanelCard(s)).join("")}</div>`;
}
function recommendedScaffold(s) {
  if (s.support.includes("IEP/504") || s.support.includes("Intervention")) return "Use shorter chunks, vocabulary checks, and one concrete lesson example before asking for written reasoning.";
  if (s.support.includes("Gifted") || s.proficiency === "Distinguished") return "Ask for design tradeoffs, evidence quality, and how the farm system changes over time.";
  if (isHotList(s)) return "Require one clear piece of evidence and one explanation sentence to push toward the target level.";
  if (s.language === "Spanish") return "Offer bilingual vocabulary support and ask the student to connect evidence in their preferred language.";
  return "Ask for evidence from the lesson and a clear criteria-versus-constraints distinction.";
}
function misconceptionsPanel() {
  return `${panelHeader("Common misconceptions", "Detected by the scaffolding engine and demo seed data.")}<div class="panel-stack">${misconceptionSummary().map(([type, count]) => `<article class="panel-card"><h3>${esc(type)}</h3><p class="subtle">${count} student signal${count === 1 ? "" : "s"} detected.</p><p class="recommendation">${esc(misconceptionRecommendation(type))}</p></article>`).join("")}</div>`;
}
function misconceptionRecommendation(type) {
  if (type.includes("criteria")) return "Pause and model two examples: one measurable sign of success, one design limit.";
  if (type.includes("farmer")) return "Ask students to revise the goal so it includes farmer livelihood and rainforest stability.";
  if (type.includes("Palm oil")) return "Have students explain why palm oil is complicated instead of simply good or bad.";
  return "Ask students to connect habitat changes to population stability using evidence.";
}
function questionQualityPanel() {
  return `${panelHeader("Question quality trends", "Use DQB quality signals to decide what to model next.")}<div class="panel-stack"><article class="panel-card">${questionQualityBody()}<p class="recommendation">Model how to turn a broad question into an investigable question with a variable, evidence source, or comparison.</p></article>${state.dqb.map((q) => `<article class="panel-card"><span class="quality">${esc(q.quality)}</span><p>${esc(q.question)}</p><span class="subtle">${esc(q.category)} · ${esc(q.status)}</span></article>`).join("")}</div>`;
}
function makeathonDemoPanel() {
  return `${panelHeader("Makeathon Demo Script", "How to demonstrate the AI Inquiry Companion in under 90 seconds.")}
    <div class="panel-stack">
      <article class="panel-card">
        <ol class="activity-list">
          <li class="activity-item"><span class="number">1</span><span>Teacher launches the Orangutan / Palm Oil inquiry lesson.</span></li>
          <li class="activity-item"><span class="number">2</span><span>Student submits a short response such as: "Palm oil is bad."</span></li>
          <li class="activity-item"><span class="number">3</span><span>AI scaffolds the student's thinking instead of giving the answer.</span></li>
          <li class="activity-item"><span class="number">4</span><span>Teacher sees the student response, AI scaffold, misconception tag, and support level.</span></li>
          <li class="activity-item"><span class="number">5</span><span>Teacher adjusts AI support to match student need.</span></li>
        </ol>
        <p class="recommendation">This tool helps teachers use AI as a thinking coach, not an answer machine.</p>
      </article>
      <article class="panel-card">
        <h3>Copy Demo Script</h3>
        <textarea id="makeathon-demo-script" readonly>${esc(makeathonDemoScriptText())}</textarea>
        <div class="role-actions" style="margin-top:12px"><button class="btn" onclick="copyMakeathonDemoScript()">Copy Demo Script</button><button class="btn secondary" onclick="openPanel('aiDashboard')">Open AI Dashboard</button></div>
      </article>
    </div>`;
}
function makeathonDemoScriptText() {
  return "Hi, I\u2019m Andrew Baldwin, a STEM teacher from Eastern Kentucky. I built this AI Inquiry Companion because students need support learning how to think, not just faster ways to get answers. In this demo, the teacher launches an inquiry lesson, the student submits an idea, and the AI responds with guiding questions instead of direct answers. The teacher can also control how much AI support each student receives, making the tool useful for advanced students, typical learners, and intervention students. The result is an AI classroom tool that protects inquiry, supports teachers, and gives every student a more equitable path into STEM learning.";
}
function copyMakeathonDemoScript() {
  const text = makeathonDemoScriptText();
  const area = document.querySelector("#makeathon-demo-script");
  if (area) {
    area.focus();
    area.select();
  }
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => document.execCommand?.("copy"));
  } else {
    document.execCommand?.("copy");
  }
}
function lessonBuilderPanel() {
  const builder = state.lessonBuilder || defaultLessonBuilder(state.lessonSetup);
  const preview = lessonBuilderPreview();
  return `${panelHeader("Teacher Lesson Builder", "Define lesson context so AI scaffolding follows your instructional goals.")}
    <div class="panel-stack">
      <article class="panel-card">
        <h3>Lesson context</h3>
        <div class="form-grid">
          ${lessonBuilderInput("Lesson Title", "lessonTitle", builder.lessonTitle)}
          ${lessonBuilderInput("Grade Level", "gradeLevel", builder.gradeLevel)}
          ${lessonBuilderInput("Subject", "subject", builder.subject)}
        </div>
        ${lessonBuilderTextarea("Learning Objective", "learningObjective", builder.learningObjective)}
        ${lessonBuilderTextarea("Success Criteria", "successCriteria", builder.successCriteria)}
        ${lessonBuilderTextarea("Key Vocabulary", "keyVocabulary", builder.keyVocabulary)}
        ${lessonBuilderTextarea("Things Students Should Discover", "discoveryGoals", builder.discoveryGoals)}
        ${lessonBuilderTextarea("Things AI Should Never Tell Students Directly", "aiRestrictions", builder.aiRestrictions)}
        <div class="role-actions" style="margin-top:12px"><button class="btn" onclick="refreshLessonBuilderPreview()">Preview Scaffold Generation</button><button class="btn secondary" onclick="syncLessonBuilderToSetup()">Use in Setup Wizard</button></div>
      </article>
      <article class="panel-card">
        <div class="card-action-head"><h3>Scaffold preview</h3><span class="ai-badge-row">${supportLevelBadge(preview.supportLevel)}${questionMatrixBadge(preview.questionMatrixLevel)}${questionStemBadge(preview.questionStem)}</span></div>
        <label class="subtle">Preview support level</label>
        <select onchange="updateLessonBuilder('previewSupportLevel', this.value)">${[15,50,85].map((level) => `<option value="${level}" ${Number(builder.previewSupportLevel || 50) === level ? "selected" : ""}>${level}% AI Support</option>`).join("")}</select>
        <div class="detail-grid">
          <span>Student Response</span><strong>${esc(builder.previewResponse || "Palm oil is bad.")}</strong>
          <span>AI Generated Scaffold</span><strong>${esc(preview.scaffold)}</strong>
          <span>Question Matrix Level</span><strong>${questionMatrixBadge(preview.questionMatrixLevel)}</strong>
          <span>Question Stem</span><strong>${questionStemBadge(preview.questionStem)}</strong>
          <span>Lesson Objective</span><strong>${esc(builder.learningObjective)}</strong>
          <span>Success Criteria</span><strong>${esc(listPreview(builder.successCriteria))}</strong>
          <span>AI Guardrails</span><strong>${esc(listPreview(builder.aiRestrictions))}</strong>
        </div>
        <p class="recommendation">Future Version: A live AI model can use these lesson settings to dynamically generate scaffolds for any student response.</p>
      </article>
    </div>`;
}
function lessonBuilderInput(label, key, value) {
  return `<label><span class="subtle">${label}</span><input type="text" aria-label="${esc(label)}" value="${esc(value)}" onchange="updateLessonBuilder('${key}', this.value)"></label>`;
}
function lessonBuilderTextarea(label, key, value) {
  return `<label class="lesson-builder-field"><span class="subtle">${label}</span><textarea aria-label="${esc(label)}" onchange="updateLessonBuilder('${key}', this.value)">${esc(value)}</textarea></label>`;
}
function updateLessonBuilder(key, value) {
  state.lessonBuilder ||= defaultLessonBuilder(state.lessonSetup);
  state.lessonBuilder[key] = key === "previewSupportLevel" ? Number(value) : value;
  save();
  render();
}
function refreshLessonBuilderPreview() {
  save();
  render();
}
function syncLessonBuilderToSetup() {
  const builder = state.lessonBuilder || defaultLessonBuilder(state.lessonSetup);
  state.lessonSetup.lessonTitle = builder.lessonTitle;
  state.lessonSetup.gradeLevel = builder.gradeLevel;
  state.lessonSetup.subject = builder.subject;
  state.lessonSetup.masteryGoal = builder.learningObjective;
  save();
  render();
}
function listPreview(value = "") {
  return String(value).split(/\n|,/).map((item) => item.trim()).filter(Boolean).slice(0, 4).join("; ");
}
function lessonBuilderPreview() {
  const builder = state.lessonBuilder || defaultLessonBuilder(state.lessonSetup);
  const supportLevel = Number(builder.previewSupportLevel || 50);
  const result = aiProvider?.scaffold
    ? aiProvider.scaffold({
      message: builder.previewResponse || "Palm oil is bad.",
      activity: { id: "lesson-builder", title: builder.lessonTitle, hint: builder.learningObjective },
      student: { aiSupportLevel: supportLevel, support: [], language: "English" },
      lessonSetup: lessonBuilderAsLessonSetup(builder),
      existingPromptCount: 0,
    })
    : { finalResponse: "How can evidence support your claim?", questionMatrixLevel: questionMatrixLevelForSupport(supportLevel), questionStem: questionStemForSupport(supportLevel), supportLevel };
  return {
    scaffold: contextualPreviewScaffold(result.finalResponse, builder, supportLevel),
    supportLevel: result.supportLevel || supportLevel,
    questionMatrixLevel: result.questionMatrixLevel || questionMatrixLevelForSupport(supportLevel),
    questionStem: result.questionStem || questionStemForSupport(supportLevel),
  };
}
function lessonBuilderAsLessonSetup(builder) {
  return {
    ...state.lessonSetup,
    lessonTitle: builder.lessonTitle,
    gradeLevel: builder.gradeLevel,
    subject: builder.subject,
    masteryGoal: builder.learningObjective,
    successCriteria: builder.successCriteria,
    keyVocabulary: builder.keyVocabulary,
    discoveryGoals: builder.discoveryGoals,
    aiRestrictions: builder.aiRestrictions,
    promptLimit: state.lessonSetup.promptLimit,
  };
}
function contextualPreviewScaffold(scaffold, builder, supportLevel) {
  const criteria = listPreview(builder.successCriteria);
  const vocabulary = listPreview(builder.keyVocabulary);
  if (supportLevel >= 75 && vocabulary) return `${scaffold} Use one vocabulary word such as ${vocabulary.split("; ")[0]} in your thinking.`;
  if (supportLevel <= 20 && criteria) return `${scaffold} Which success criterion would help you judge the strength of your explanation?`;
  if (criteria) return `${scaffold} Try connecting your evidence to this success criterion: ${criteria.split("; ")[0]}.`;
  return scaffold;
}
function aiComparisonPanel() {
  const current = currentAIComparison();
  return `${panelHeader("AI Support Comparison Demo", "Same student idea. Different levels of teacher-controlled AI support.")}
    <div class="panel-stack">
      <article class="panel-card">
        <span class="subtle">Demo input</span>
        <h3>"${esc(current.prompt)}"</h3>
        <div class="role-actions" style="margin-top:12px"><button class="btn" onclick="runAIComparisonDemo()">Run Comparison Demo</button><button class="btn secondary" onclick="cycleAIComparisonIdea()">Use a Different Student Idea</button></div>
      </article>
      <section class="grid ${current.results.length >= 3 ? "three-col" : ""}">
        ${current.results.map((item) => aiComparisonCard(item)).join("")}
      </section>
      <article class="panel-card">
        <p class="recommendation">This AI uses the Weiderhold Question Matrix to adjust question complexity. Students receive different levels of scaffolding based on teacher-selected support levels while maintaining inquiry-based instruction.</p>
      </article>
    </div>`;
}
function aiComparisonCard(item) {
  return `<article class="panel-card">
    <span class="ai-badge-row">${supportLevelBadge(item.supportLevel)}${questionMatrixBadge(item.questionMatrixLevel)}</span>
    <h3>${esc(item.learnerType)}</h3>
    <p>${esc(item.response)}</p>
    <div class="detail-grid ai-comparison-meta">
      <span>Matrix</span><strong>${questionMatrixBadge(item.questionMatrixLevel)}</strong>
      <span>Stem</span><strong>${questionStemBadge(item.questionStem)}</strong>
      <span>Tag</span><strong>${esc(item.tag)}</strong>
      <span>Status</span><strong>${esc(item.status)}</strong>
    </div>
  </article>`;
}
function currentAIComparison() {
  const prompt = state.aiComparisonPrompt || aiComparisonIdeas()[0];
  const results = state.aiComparisonResults || generateAIComparisonResults(prompt);
  return { prompt, results };
}
function runAIComparisonDemo() {
  const prompt = state.aiComparisonPrompt || aiComparisonIdeas()[0];
  state.aiComparisonPrompt = prompt;
  state.aiComparisonResults = generateAIComparisonResults(prompt);
  render();
}
function cycleAIComparisonIdea() {
  const ideas = aiComparisonIdeas();
  const currentIndex = ideas.indexOf(state.aiComparisonPrompt || ideas[0]);
  const nextIndex = (currentIndex + 1) % ideas.length;
  state.aiComparisonPrompt = ideas[nextIndex];
  state.aiComparisonResults = generateAIComparisonResults(state.aiComparisonPrompt);
  render();
}
function aiComparisonIdeas() {
  return [
    "Palm oil is bad.",
    "Orangutans are losing their homes.",
    "They can just move somewhere else.",
    "I don't know.",
    "People should stop buying palm oil.",
  ];
}
function generateAIComparisonResults(prompt) {
  const activity = activities.find((item) => item.id === "define") || activities[0];
  return [
    { learnerType: "Advanced Learner", supportLevel: 15 },
    { learnerType: "Typical Learner", supportLevel: 50 },
    { learnerType: "Intervention Learner", supportLevel: 85 },
  ].map((item) => {
    const result = aiProvider?.scaffold
      ? aiProvider.scaffold({
        message: prompt,
        activity,
        student: { aiSupportLevel: item.supportLevel, support: [], language: "English" },
        lessonSetup: state.lessonSetup,
        existingPromptCount: 0,
      })
      : { finalResponse: "What evidence from the lesson could help you support it?", misconceptionTag: "Needs Evidence", progressStatus: "Developing explanation", questionMatrixLevel: "Reasoning", questionStem: "How can" };
    return {
      ...item,
      response: result.finalResponse,
      tag: result.misconceptionTag || result.flags?.[0] || "Needs Evidence",
      status: result.progressStatus || "Developing explanation",
      questionMatrixLevel: result.questionMatrixLevel || questionMatrixLevelForSupport(item.supportLevel),
      questionStem: result.questionStem || questionStemForSupport(item.supportLevel),
    };
  });
}
function titleCaseAIValue(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .map((word) => word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : "")
    .join(" ");
}
function aiBadgeClass(value, prefix) {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${prefix}-${slug || "default"}`;
}
function supportLevelBadge(level) {
  const supportLevel = Number(level || 50);
  return `<span class="ai-badge support ${aiBadgeClass(supportLevel, "support")}">${supportLevel}% AI Support</span>`;
}
function progressStatusBadge(status) {
  const label = titleCaseAIValue(status || "Developing Explanation");
  return `<span class="ai-badge status ${aiBadgeClass(label, "status")}">${esc(label)}</span>`;
}
function misconceptionTagBadge(tag) {
  const label = titleCaseAIValue(tag || "Needs Evidence");
  return `<span class="ai-badge misconception ${aiBadgeClass(label, "misconception")}">${esc(label)}</span>`;
}
function questionMatrixLevelForSupport(level) {
  const supportLevel = Number(level || 15);
  if (supportLevel >= 25) return "Foundational";
  if (supportLevel <= 10) return "Transfer";
  return "Reasoning";
}
function questionStemForSupport(level) {
  const supportLevel = Number(level || 15);
  if (supportLevel >= 25) return "What did";
  if (supportLevel <= 10) return "How might";
  return "How can";
}
function questionMatrixBadge(level) {
  const label = titleCaseAIValue(level || "Reasoning");
  return `<span class="ai-badge matrix ${aiBadgeClass(label, "matrix")}">${esc(label)} Questions</span>`;
}
function questionStemBadge(stem) {
  return `<span class="ai-badge stem">Question Stem: ${esc(stem || "How can")}</span>`;
}
function teacherAIDashboardBody() {
  return aiDashboardStudents().map((s) => {
    const item = dashboardAIItem(s);
    const matrixLevel = item.questionMatrixLevel || questionMatrixLevelForSupport(s.aiSupportLevel || item.supportLevel);
    const stem = item.questionStem || questionStemForSupport(s.aiSupportLevel || item.supportLevel);
    return `<div class="student-line ai-dashboard-summary" style="padding:9px 0;border-top:1px solid var(--line)">${avatar(s)}<span><strong class="student-name">${esc(s.name)}</strong><br/><span class="ai-badge-row">${supportLevelBadge(s.aiSupportLevel || item.supportLevel)}${questionMatrixBadge(matrixLevel)}${questionStemBadge(stem)}${misconceptionTagBadge(item.misconceptionTag)}</span></span>${progressStatusBadge(item.progressStatus)}</div>`;
  }).join("");
}
function aiDashboardPanel() {
  return `${panelHeader("Teacher AI Dashboard", "See how the AI is helping students think without giving answers.")}
    <div class="panel-stack">${aiDashboardStudents().map((s) => {
      const item = dashboardAIItem(s);
      const updated = state.aiDashboardUpdatedStudent === s.id;
      const matrixLevel = item.questionMatrixLevel || questionMatrixLevelForSupport(s.aiSupportLevel || item.supportLevel);
      const stem = item.questionStem || questionStemForSupport(s.aiSupportLevel || item.supportLevel);
      return `<article class="panel-card ai-dashboard-card ${updated ? "demo-updated" : ""}">
        <div class="student-line ai-dashboard-card-head">${avatar(s)}<span><strong>${esc(s.name)}</strong><br/><span class="subtle">${esc(s.learnerDemoType || "Learner")}</span><span class="ai-badge-row">${supportLevelBadge(s.aiSupportLevel || item.supportLevel)}${questionMatrixBadge(matrixLevel)}${questionStemBadge(stem)}${misconceptionTagBadge(item.misconceptionTag)}${progressStatusBadge(item.progressStatus)}</span></span>${updated ? `<span class="demo-feedback">Demo updated</span>` : ""}</div>
        <div class="detail-grid">
          <span>Latest student response</span><strong>${esc(item.response)}</strong>
          <span>Latest AI scaffold</span><strong>${esc(item.scaffold)}</strong>
          <span>Question Matrix</span><strong>${questionMatrixBadge(matrixLevel)}</strong>
          <span>Question Stem</span><strong>${questionStemBadge(stem)}</strong>
          <span>Misconception tag</span><strong>${misconceptionTagBadge(item.misconceptionTag)}</strong>
          <span>Progress status</span><strong>${progressStatusBadge(item.progressStatus)}</strong>
        </div>
        <div class="role-actions" style="margin-top:12px"><button class="btn secondary" onclick="openStudentProfile('${s.id}')">Open Profile</button><button class="btn secondary" onclick="previewScaffoldForStudent('${s.id}')">Demo "Palm oil is bad."</button></div>
      </article>`;
    }).join("")}${aiPromptLogCard()}</div>`;
}
function aiPromptLogCard() {
  const logs = state.aiPromptLog || [];
  return `<article class="panel-card">
    <div class="card-action-head"><h3>Prompt Logging</h3><span class="pill">${logs.length} local log${logs.length === 1 ? "" : "s"}</span></div>
    ${logs.length ? logs.slice(0, 6).map((log) => `<div class="timeline-item"><strong>${esc(log.studentName)} · ${esc(log.timestamp)}</strong><p><strong>Student:</strong> ${esc(log.studentResponse)}</p><p><strong>AI:</strong> ${esc(log.aiResponse)}</p><span class="ai-badge-row">${supportLevelBadge(log.supportLevel)}${misconceptionTagBadge(log.misconceptionTag)}${progressStatusBadge(log.progressStatus)}<span class="ai-badge stem">${esc(log.provider)}</span></span></div>`).join("") : `<div class="empty">No AI prompts logged yet. Use student mode or a dashboard demo button to generate a local log.</div>`}
  </article>`;
}
function aiDashboardStudents() {
  const demoIds = ["s4", "s1", "s3"];
  const demoStudents = demoIds.map((id) => state.students.find((s) => s.id === id)).filter(Boolean);
  return demoStudents.length ? demoStudents : state.students.slice(0, 3);
}
function dashboardAIItem(student) {
  return student.latestAIInteraction?.questionMatrixLevel && student.latestAIInteraction?.questionStem
    ? student.latestAIInteraction
    : sampleAIInteraction(student);
}
function generateDemoScaffoldForStudent(student, prompt = "Palm oil is bad.") {
  const activity = activities.find((item) => item.id === "define") || activities[0];
  const lesson = launchedLesson();
  const lessonSetup = {
    ...state.lessonSetup,
    lessonTitle: lesson?.title || state.lessonSetup.lessonTitle,
    aiSupportLevel: lesson?.aiGuidance?.supportLevel ?? student.aiSupportLevel ?? 15,
    aiProvider: lesson?.aiGuidance?.provider || state.lessonSetup.aiProvider || "demo",
    aiCustomInstructions: lesson?.aiGuidance?.customInstructions || state.lessonSetup.aiCustomInstructions || state.aiSettings.customInstructions,
  };
  const aiStudent = { ...student, aiSupportLevel: lessonSetup.aiSupportLevel };
  const result = aiProvider?.scaffold
    ? aiProvider.scaffold({ message: prompt, activity, student: aiStudent, lessonSetup, existingPromptCount: 0 })
    : { finalResponse: "What evidence from the lesson supports that idea?", misconceptionTag: "Needs Evidence", progressStatus: "Developing explanation", supportLevel: student.aiSupportLevel || 50 };
  return {
    response: prompt,
    scaffold: result.finalResponse,
    misconceptionTag: result.misconceptionTag || result.flags?.[0] || "Needs Evidence",
    progressStatus: result.progressStatus || "Developing explanation",
    supportLevel: result.supportLevel || student.aiSupportLevel || 50,
    questionMatrixLevel: result.questionMatrixLevel || questionMatrixLevelForSupport(result.supportLevel || student.aiSupportLevel || 50),
    questionStem: result.questionStem || questionStemForSupport(result.supportLevel || student.aiSupportLevel || 50),
    scores: result.scores || {},
  };
}
function sampleAIInteraction(student) {
  return generateDemoScaffoldForStudent(student);
}
function previewScaffoldForStudent(studentId) {
  const s = state.students.find((student) => student.id === studentId);
  if (!s) return;
  const item = generateDemoScaffoldForStudent(s, "Palm oil is bad.");
  const timestamp = new Date().toLocaleString();
  s.latestAIInteraction = {
    ...item,
    activityId: "define",
    activityTitle: "Define the problem",
    createdAt: timestamp,
  };
  state.aiPromptLog = state.aiPromptLog || [];
  state.aiPromptLog.unshift({
    id: `log-${Date.now()}-${s.id}`,
    studentId: s.id,
    studentName: s.name,
    lessonId: launchedLesson()?.id || "",
    lessonTitle: launchedLesson()?.title || state.lessonSetup.lessonTitle,
    provider: providerLabelFor(launchedLesson()?.aiGuidance?.provider || "demo"),
    supportLevel: item.supportLevel,
    studentResponse: item.response,
    aiResponse: item.scaffold,
    misconceptionTag: item.misconceptionTag,
    progressStatus: item.progressStatus,
    scores: item.scores || {},
    timestamp,
  });
  state.aiDashboardUpdatedStudent = s.id;
  state.activePanel = "aiDashboard";
  render();
  window.setTimeout(() => {
    if (state.aiDashboardUpdatedStudent === s.id) {
      state.aiDashboardUpdatedStudent = null;
      render();
    }
  }, 1800);
}
function creditsPanel() {
  const used = state.students.reduce((n, s) => n + Number(s.used || 0), 0);
  const pool = state.students.reduce((n, s) => n + Number(s.monthlyCredits || 0), 0);
  return `${panelHeader("Inquiry Credit usage", "Demo allocation control for instructional support, not billing.")}<section class="grid stats panel-stats">${metric("Class pool", pool, "monthly demo credits")}${metric("Used", used, `${Math.round((used / pool) * 100)}% used`)}${metric("Remaining", pool - used, "available")}</section><div class="panel-stack">${state.students.map((s) => `<article class="panel-card"><div class="student-line">${avatar(s)}<span><strong>${esc(s.name)}</strong><br/><span class="subtle">${esc(s.proficiency)} · ${esc(s.support.join(", ") || "Standard")}</span></span></div><div class="allocation slim"><input type="range" min="0" max="100" step="5" value="${s.allocation}" oninput="updateAllocation('${s.id}',this.value)"><strong>${s.allocation}%</strong><span class="subtle">${s.used} used · ${Math.max(0, Number(s.monthlyCredits || 0) - Number(s.used || 0))} left</span></div></article>`).join("")}</div>`;
}
function languagePanel() {
  return `${panelHeader("English/Spanish usage", "Bilingual support is part of the teacher-controlled setup.")}<div class="panel-stack">${state.students.map((s) => `<article class="panel-card"><div class="student-line">${avatar(s)}<span><strong>${esc(s.name)}</strong><br/><span class="subtle">${esc(s.language)} · ${esc(s.reading)}</span></span></div><p class="recommendation">${s.language === "Spanish" ? "Spanish support enabled: use bilingual vocabulary checks and allow reasoning in Spanish." : "English support enabled: use evidence prompts and short checks for vocabulary."}</p></article>`).join("")}</div>`;
}
function resourceKind(resource) {
  const type = String(resource.type || resource.category || "").toLowerCase();
  const url = String(resource.url || "").toLowerCase();
  if (type.includes("youtube") || url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (type.includes("image") || ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(type) || /\.(png|jpe?g|gif|webp|svg)(\?|$)/.test(url) || url.startsWith("data:image")) return "image";
  if (type.includes("google doc") || type.includes("google slides") || url.includes("docs.google.com")) return "google";
  if (type.includes("pdf") || /\.pdf(\?|$)/.test(url) || url.startsWith("data:application/pdf")) return "pdf";
  if (type.includes("text") || type.includes("doc") || type.includes("slide") || resource.textContent) return "text";
  if (["docx", "pptx", "doc", "ppt"].includes(type) || type.includes("google slides")) return "office";
  if (url) return "website";
  return "missing";
}
function resourceDisplayType(resource) {
  const kind = resourceKind(resource);
  if (kind === "pdf") return "PDF";
  if (kind === "image") return "Image";
  if (kind === "youtube") return "Video";
  if (kind === "google") return String(resource.type || "").toLowerCase().includes("slide") ? "Slides" : "Doc";
  if (kind === "text") {
    const type = String(resource.type || "").toLowerCase();
    if (type.includes("slide")) return "Slides";
    if (type.includes("doc") || type.includes("text") || resource.textContent) return "Doc";
  }
  if (kind === "website") return "Link";
  return "Other";
}
function youtubeEmbedUrl(url) {
  const value = String(url || "");
  const short = value.match(/youtu\.be\/([^?&]+)/);
  const watch = value.match(/[?&]v=([^?&]+)/);
  const embed = value.match(/youtube\.com\/embed\/([^?&/]+)/);
  const id = short?.[1] || watch?.[1] || embed?.[1];
  return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : "";
}
function resourcePreview(resource) {
  const kind = resourceKind(resource);
  const url = resource.url || "";
  if (kind === "pdf") {
    return url ? `<div class="viewer-frame"><iframe title="${esc(resource.title)} PDF preview" src="${esc(url)}"></iframe></div><p class="subtle">If the PDF does not display in the browser, use Open externally.</p><button class="btn" onclick="openResourceExternally('${resource.id}')">Open externally</button>` : `<div class="empty">Resource link is missing. Add a PDF link to preview it here.</div>`;
  }
  if (kind === "image") {
    return url ? `<div class="image-preview"><img src="${esc(url)}" alt="${esc(resource.title)} preview" onerror="this.closest('.image-preview').innerHTML='<div class=&quot;empty&quot;>Image cannot load. Check the resource link.</div>'"></div>` : `<div class="empty">Resource link is missing. Add an image URL to preview it here.</div>`;
  }
  if (kind === "youtube") {
    const embed = youtubeEmbedUrl(url);
    return embed ? `<div class="viewer-frame video"><iframe title="${esc(resource.title)} YouTube video" src="${esc(embed)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><a class="btn secondary" href="${esc(url)}" target="_blank" rel="noreferrer">Open on YouTube</a>` : `<div class="empty">YouTube link cannot be embedded. Check the URL.</div>`;
  }
  if (kind === "google") {
    return url ? `<div class="empty">Google Docs and Slides open in a new tab so permissions stay with Google.</div><button class="btn" onclick="openResourceExternally('${resource.id}')">Open externally</button>` : `<div class="empty">Google resource link is missing.</div>`;
  }
  if (kind === "text") {
    return `<div class="text-resource">${esc(resource.textContent || resource.description || "No text content has been added yet.")}</div>${url ? `<div class="role-actions" style="margin-top:12px"><button class="btn secondary" onclick="openResourceExternally('${resource.id}')">Open externally</button></div>` : ""}`;
  }
  if (kind === "website") {
    return `<div class="empty">External website resources open safely in a new tab.</div><button class="btn" onclick="openResourceExternally('${resource.id}')">Open externally</button>`;
  }
  if (kind === "office") {
    return url ? `<div class="empty">Office files cannot be previewed directly in this demo, but the uploaded file can be opened or downloaded.</div><button class="btn" onclick="openResourceExternally('${resource.id}')">Open externally</button>` : `<div class="empty">Office file placeholder has no uploaded file yet.</div>`;
  }
  return `<div class="empty">Resource link is missing. Add a URL or text content to make this resource viewable.</div>${url ? `<button class="btn" onclick="openResourceExternally('${resource.id}')">Open externally</button>` : ""}`;
}
function resourceTags(resource) {
  return (resource.tags || []).length ? resource.tags.map(tag).join("") : `<span class="tag">No tags</span>`;
}
function isSharedResource(resource) {
  const value = String(resource.shareability || "");
  const visibility = String(resource.visibility || "");
  if (["class", "school", "district", "public"].includes(visibility)) return true;
  return Boolean(value && value !== "Private" && !value.includes("Copyright restricted"));
}
function resourceAssignmentSummary(resource) {
  const students = studentsAssignedToResource(resource.id);
  const classAssigned = students.length === state.students.length && state.students.length > 0;
  const groups = assignedGroupsForResource(resource.id);
  if (classAssigned) return "Whole class";
  const parts = [];
  if (students.length) parts.push(`${students.length} student${students.length === 1 ? "" : "s"}`);
  if (groups.length) parts.push(groups.join(", "));
  return parts.length ? parts.join(" · ") : "Not assigned";
}
function assignedGroupsForResource(resourceId) {
  const students = studentsAssignedToResource(resourceId);
  const ids = new Set(students.map((student) => student.id));
  const groups = [];
  const groupMap = {
    Advanced: state.students.filter(isAdvancedLearner).map((student) => student.id),
    Typical: state.students.filter(isTypicalLearner).map((student) => student.id),
    Struggling: state.students.filter(isStrugglingLearner).map((student) => student.id),
  };
  Object.entries(groupMap).forEach(([label, groupIds]) => {
    if (groupIds.length && groupIds.every((id) => ids.has(id))) groups.push(label);
  });
  return groups;
}
function isAdvancedLearner(student) {
  return student.proficiency === "Distinguished" || student.level === "Above level" || (student.support || []).includes("Gifted") || Number(student.aiSupportLevel) === 15;
}
function isStrugglingLearner(student) {
  return student.level === "Intervention" || student.level === "Below level" || (student.support || []).some((item) => ["IEP/504", "Intervention"].includes(item)) || Number(student.aiSupportLevel) === 85;
}
function isTypicalLearner(student) {
  return !isAdvancedLearner(student) && !isStrugglingLearner(student);
}
function resourceTypeOptions() {
  return Array.from(new Set([...resourceTypes, "Image", "Website URL", "YouTube URL", "Google Docs URL", "Plain text"]));
}
function currentResource() {
  return state.resourceList.find((item) => item.id === state.selectedResource) || state.resourceList[0];
}
function resourceViewerPage() {
  const r = currentResource();
  if (!r) {
    return `${pageHead("Resource Details", "No resource selected.", `<button class="btn secondary" onclick="teacherTab('${esc(state.resourceReturnTab || "resources")}')">Back</button>`)}
      <article class="card card-pad empty"><h3>No resources exist yet.</h3><p>Add a resource from the Teacher Resources page.</p><button class="btn" onclick="openPanel('addResource')">Add resource</button></article>`;
  }
  const assignedStudents = studentsAssignedToResource(r.id);
  return `${pageHead("Resource Details", "Open and inspect classroom materials from the library.", `<button class="btn secondary" onclick="teacherTab('${esc(state.resourceReturnTab || "resources")}')">Back</button>${r.url ? `<button class="btn" onclick="openResourceExternally('${r.id}')">Open Resource</button>` : ""}<button class="btn secondary" onclick="openPanel('assignResourceStudents',{resourceId:'${r.id}'})">Assign</button><button class="btn secondary" onclick="openPanel('editResource',{resourceId:'${r.id}'})">Edit Resource</button><button class="btn danger" onclick="openPanel('deleteResource',{resourceId:'${r.id}'})">Delete Resource</button>`)}
    <section class="grid two-col resource-view-layout">
      <article class="card card-pad">
        <div class="student-line"><span class="resource-icon">${esc(resourceDisplayType(r).slice(0,2).toUpperCase())}</span><span><h1>${esc(r.title)}</h1><span class="subtle">${esc(resourceDisplayType(r))} · ${esc(r.subject)} · Grade ${esc(r.gradeLevel)}</span></span></div>
        <div class="detail-grid">
          <span>Title</span><strong>${esc(r.title)}</strong>
          <span>Description</span><strong>${esc(r.description || "No description added.")}</strong>
          <span>Type</span><strong>${esc(resourceDisplayType(r))}</strong>
          <span>Category</span><strong>${esc(r.category || r.type)}</strong>
          <span>Subject</span><strong>${esc(r.subject || "Not set")}</strong>
          <span>Grade level</span><strong>${esc(r.gradeLevel || "Not set")}</strong>
          <span>Tags</span><strong>${resourceTags(r)}</strong>
          <span>Date added</span><strong>${esc(r.dateAdded || "Not recorded")}</strong>
          <span>Assigned</span><strong>${esc(resourceAssignmentSummary(r))}</strong>
          <span>Link / file</span><strong>${r.url ? esc(r.url) : "No link attached"}</strong>
        </div>
        <div class="role-actions" style="margin-top:14px">${r.url ? `<button class="btn" onclick="openResourceExternally('${r.id}')">Open Resource</button>` : `<span class="pill">No external link</span>`}${resourceKind(r) === "missing" ? `<span class="pill">Missing link</span>` : ""}</div>
        <div class="divider"></div>
        <h3 class="section-title">Assigned students</h3>
        ${assignedStudents.length ? assignedStudents.map((student) => `<div class="student-line click-row" role="button" tabindex="0" onclick="openStudentProfile('${student.id}')" onkeydown="studentKey(event,'${student.id}')">${avatar(student)}<span><strong class="student-name">${esc(student.name)}</strong><br/><span class="subtle">${esc(student.level)} · ${esc(student.proficiency)}</span></span></div>`).join("") : `<div class="empty">This resource is not assigned to any students yet.</div>`}
      </article>
      <article class="card card-pad">
        <h3 class="section-title">Resource Viewer</h3>
        ${resourcePreview(r)}
      </article>
    </section>`;
}
function studentsAssignedToResource(resourceId) {
  return state.students.filter((student) => (student.assignedResources || []).some((assignment) => assignment.resourceId === resourceId));
}
async function openResourceExternally(resourceId) {
  await resourceProvider.open(resourceId);
}
function filteredResources() {
  const search = String(state.resourceSearch || "").toLowerCase();
  const filter = state.resourceFilter || "All";
  return state.resourceList.filter((resource) => {
    const haystack = [resource.title, resource.description, resource.category, resource.type, resource.subject, resource.gradeLevel, ...(resource.tags || [])].join(" ").toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    const matchesFilter = filter === "All" || resourceKind(resource) === filter || resource.type === filter || resource.category === filter;
    return matchesSearch && matchesFilter;
  });
}
function setResourceSearch(value) { state.resourceSearch = value; save(); render(); }
function setResourceFilter(value) { state.resourceFilter = value; save(); render(); }
function resourceManagerPanel() {
  const resources = filteredResources();
  return `${panelHeader("Resource Library", "Open, assign, and manage classroom materials for this lesson.")}
    ${resourceManagerForm()}
    <p class="warning">Only share resources you created, have permission to share, or that are openly licensed.</p>
    <div class="panel-stack resource-list">${state.resourceList.length ? resources.length ? resources.map(resourceListItem).join("") : `<div class="empty">No resources match this search or filter.</div>` : `<div class="empty">No resources exist yet. Add a resource to start the library.</div>`}</div>`;
}
function resourceLibraryRow(r) {
  const isShared = isSharedResource(r);
  return `<div class="resource-row click-row library-resource-row" role="button" tabindex="0" onclick="openResourceViewer('${r.id}','resources')" onkeydown="resourceKey(event,'${r.id}')">
    <div class="student-line"><span class="resource-icon">${esc(resourceDisplayType(r).slice(0,2).toUpperCase())}</span><span><strong class="student-name">${esc(r.title)}</strong><br/><span class="subtle">${esc(resourceDisplayType(r))} · ${esc(resourceAssignmentSummary(r))}</span><br/><span class="quality">${resourceTags(r)} ${isShared ? `<span class="pill">Shared</span>` : ""}</span></span></div>
    <div class="role-actions" onclick="event.stopPropagation()"><button class="btn secondary" onclick="openResourceViewer('${r.id}','resources')">Open</button><button class="btn secondary" onclick="openPanel('assignResourceStudents',{resourceId:'${r.id}'})">Assign</button><button class="btn secondary" onclick="ResourceStorage.toggleShareability('${r.id}')">${isShared ? "Unshare" : "Share"}</button><button class="btn danger" onclick="openPanel('deleteResource',{resourceId:'${r.id}'})">Remove</button></div>
  </div>`;
}
function editResourcePanel() {
  const r = currentResource();
  if (!r) return `${panelHeader("Edit Resource")}<p class="empty">Resource not found.</p>`;
  return `${panelHeader("Edit Resource", "Update resource metadata and viewer content.")}
    <article class="panel-card">${formError()}
      <div class="form-grid resource-form">
        <label><span class="subtle">Resource title</span><input id="edit-resource-title" type="text" value="${esc(r.title)}"></label>
        <label><span class="subtle">Type / category</span><select id="edit-resource-type">${resourceTypeOptions().map((type) => `<option ${type === r.type ? "selected" : ""}>${esc(type)}</option>`).join("")}</select></label>
        <label><span class="subtle">Link or file URL</span><input id="edit-resource-url" type="text" value="${esc(r.url || "")}"></label>
        <label><span class="subtle">Subject</span><input id="edit-resource-subject" type="text" value="${esc(r.subject || state.lessonSetup.subject)}"></label>
        <label><span class="subtle">Grade level</span><input id="edit-resource-grade" type="text" value="${esc(r.gradeLevel || state.lessonSetup.gradeLevel)}"></label>
        <label><span class="subtle">Tags</span><input id="edit-resource-tags" type="text" value="${esc((r.tags || []).join(", "))}"></label>
      </div>
      <label class="subtle">Description</label><textarea id="edit-resource-description">${esc(r.description || "")}</textarea>
      <label class="subtle">Plain text content</label><textarea id="edit-resource-text">${esc(r.textContent || "")}</textarea>
      <div class="role-actions" style="margin-top:12px"><button class="btn" onclick="saveResourceEdits('${r.id}')">Save resource</button><button class="btn secondary" onclick="closePanel()">Cancel</button></div>
    </article>`;
}
function saveResourceEdits(resourceId) {
  const r = state.resourceList.find((resource) => resource.id === resourceId);
  const title = document.querySelector("#edit-resource-title")?.value.trim();
  if (!r || !title) { state.profileError = "Resource title is required."; render(); return; }
  r.title = title;
  r.type = document.querySelector("#edit-resource-type")?.value || r.type;
  r.category = r.type;
  r.url = document.querySelector("#edit-resource-url")?.value.trim() || "";
  r.subject = document.querySelector("#edit-resource-subject")?.value.trim() || state.lessonSetup.subject;
  r.gradeLevel = document.querySelector("#edit-resource-grade")?.value.trim() || state.lessonSetup.gradeLevel;
  r.tags = document.querySelector("#edit-resource-tags")?.value.split(",").map((tag) => tag.trim()).filter(Boolean) || [];
  r.description = document.querySelector("#edit-resource-description")?.value.trim() || "No description added.";
  r.textContent = document.querySelector("#edit-resource-text")?.value.trim() || "";
  state.resources = state.resourceList;
  closePanel();
}
function deleteResourcePanel() {
  const r = currentResource();
  if (!r) return `${panelHeader("Delete Resource")}<p class="empty">Resource not found.</p>`;
  return `${panelHeader("Delete Resource", "This removes the resource from the local demo library.")}
    <article class="panel-card"><p class="warning">Delete ${esc(r.title)}? This also removes it from student assigned-resource lists.</p><div class="role-actions" style="margin-top:12px"><button class="btn danger" onclick="confirmDeleteResource('${r.id}')">Delete Resource</button><button class="btn secondary" onclick="closePanel()">Cancel</button></div></article>`;
}
function confirmDeleteResource(resourceId) {
  ResourceStorage.deleteResource(resourceId);
}
function resourceManagerForm() {
  const filterOptions = ["All", "pdf", "image", "website", "youtube", "google", "text"];
  return `<article class="panel-card">
    <div class="card-action-head"><h3>Add or find resources</h3><button class="btn secondary" onclick="openPanel('addResource')">Add resource</button></div>
    <div class="form-grid resource-form" style="margin-top:12px">
      <label><span class="subtle">Search resources</span><input id="panel-resource-search" type="text" value="${esc(state.resourceSearch || "")}" placeholder="Search title, tag, subject..."></label>
      <label><span class="subtle">Filter</span><select id="panel-resource-filter" onchange="setResourceFilter(this.value)">${filterOptions.map((option) => `<option value="${esc(option)}" ${option === state.resourceFilter ? "selected" : ""}>${esc(option === "All" ? "All resource types" : option)}</option>`).join("")}</select></label>
    </div>
    <div class="role-actions" style="margin-top:12px"><button class="btn secondary" onclick="setResourceSearch(document.querySelector('#panel-resource-search').value)">Search</button><button class="btn ghost" onclick="setResourceSearch('')">Clear</button></div>
  </article>`;
}
function resourceListItem(r) {
  const isShared = isSharedResource(r);
  return `<article class="panel-card resource-click" role="button" tabindex="0" onclick="openResourceViewer('${r.id}','resources')" onkeydown="resourceKey(event,'${r.id}')">
    <div class="card-action-head"><div class="student-line"><span class="resource-icon">${esc(resourceDisplayType(r).slice(0,2).toUpperCase())}</span><span><strong>${esc(r.title)}</strong><br/><span class="subtle">${esc(resourceDisplayType(r))} · ${esc(resourceAssignmentSummary(r))}</span></span></div><span class="pill">${esc(resourceDisplayType(r))}</span></div>
    <p class="subtle">${esc(r.description || r.meta || "Classroom resource")}</p>
    <div class="role-actions" onclick="event.stopPropagation()"><button class="btn secondary" onclick="openResourceViewer('${r.id}','resources')">Open</button><button class="btn secondary" onclick="openPanel('assignResourceStudents',{resourceId:'${r.id}'})">Assign</button><button class="btn secondary" onclick="ResourceStorage.toggleShareability('${r.id}')">${isShared ? "Unshare" : "Share"}</button><button class="btn danger" onclick="openPanel('deleteResource',{resourceId:'${r.id}'})">Remove</button></div>
  </article>`;
}
function resourceKey(event, resourceId) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openResourceViewer(resourceId);
  }
}
function resourceDetailPanel() {
  const r = state.resourceList.find((item) => item.id === state.selectedResource) || state.resourceList[0];
  if (!r) return `${panelHeader("Resource detail")}<p class="empty">No resource selected.</p>`;
  return `${panelHeader("Resource detail", "Resource metadata for Board-demo inspection.")}
    <article class="panel-card">
      <span class="resource-icon">${esc(r.type.slice(0,2).toUpperCase())}</span>
      <h3>${esc(r.title)}</h3>
      <div class="detail-grid">
        <span>Type</span><strong>${esc(r.type)}</strong>
        <span>URL/file placeholder</span><strong>${esc(r.url || "Demo placeholder resource.")}</strong>
        <span>Lesson connected</span><strong>${esc(state.lessonSetup.lessonTitle)}</strong>
        <span>Audience</span><strong>${esc(r.audience || r.visibility || "Class")}</strong>
        <span>Language</span><strong>${esc(r.language || "English")}</strong>
        <span>Visibility</span><strong>${esc(r.visibility || r.audience || "Class")}</strong>
        <span>Shareability</span><strong>${esc(r.shareability)}</strong>
        <span>License/copyright</span><strong>${esc(r.licenseStatus || r.notes || "Demo metadata")}</strong>
        <span>Description / preview</span><strong>${esc(r.description || r.notes || r.meta || "Demo preview placeholder.")}</strong>
      </div>
      <div class="role-actions" style="margin-top:14px"><button class="btn" onclick="openResourceViewer('${r.id}','resources')">Open Resource Viewer</button><button class="btn secondary" onclick="openPanel('resources')">Back to manager</button></div>
    </article>`;
}
function addResourcePanel() {
  return `${panelHeader("Add resource", "Create a teacher resource upload/link placeholder.")}
    <article class="panel-card">
      <div class="form-grid resource-form">
        <label><span class="subtle">Resource title</span><input id="panel-resource-title" type="text" placeholder="File title"></label>
        <label><span class="subtle">Type / category</span><select id="panel-resource-type">${resourceTypeOptions().map(t => `<option>${esc(t)}</option>`).join("")}</select></label>
        <label><span class="subtle">Audience</span><select id="panel-resource-audience"><option>Teacher</option><option>Student</option><option>Class</option></select></label>
        <label><span class="subtle">Language</span><select id="panel-resource-language"><option>English</option><option>Spanish</option><option>Bilingual</option></select></label>
        <label><span class="subtle">File/link placeholder</span><input id="panel-resource-url" type="text" placeholder="URL or file placeholder"></label>
        <label><span class="subtle">Local file upload</span><input id="panel-resource-file" type="file"></label>
        <label><span class="subtle">Shareability</span><select id="panel-resource-shareability">${shareabilityOptions.map(t => `<option>${esc(t)}</option>`).join("")}</select></label>
        <label><span class="subtle">Subject</span><input id="panel-resource-subject" type="text" value="${esc(state.lessonSetup.subject)}"></label>
        <label><span class="subtle">Grade level</span><input id="panel-resource-grade" type="text" value="${esc(state.lessonSetup.gradeLevel)}"></label>
        <label><span class="subtle">Tags</span><input id="panel-resource-tags" type="text" placeholder="lesson 6, ecosystem"></label>
      </div>
      <label class="subtle">Description / preview notes</label>
      <textarea id="panel-resource-notes" placeholder="Describe the resource or copyright status."></textarea>
      <label class="subtle">Plain text content</label>
      <textarea id="panel-resource-text" placeholder="Paste text here for plain text resources."></textarea>
      <p class="warning">Only share resources you created, have permission to share, or that are openly licensed.</p>
      <div class="role-actions" style="margin-top:12px"><button class="btn" onclick="addPanelResource()">Save resource</button><button class="btn secondary" onclick="closePanel()">Cancel</button></div>
    </article>`;
}
async function addPanelResource() {
  if (providerMode === "supabase") {
    alert("Supabase mode is read-only for this phase. Switch back to local mode to add demo resources.");
    return;
  }
  const title = document.querySelector("#panel-resource-title")?.value.trim();
  if (!title) return;
  const audience = document.querySelector("#panel-resource-audience")?.value || document.querySelector("#panel-resource-visibility")?.value || "Class";
  const file = document.querySelector("#panel-resource-file")?.files?.[0];
  const type = file ? (file.name.split(".").pop()?.toUpperCase() || document.querySelector("#panel-resource-type").value) : document.querySelector("#panel-resource-type").value;
  const metadata = {
    title,
    type,
    audience,
    language: document.querySelector("#panel-resource-language")?.value || "English",
    shareability: document.querySelector("#panel-resource-shareability").value,
    description: document.querySelector("#panel-resource-notes").value.trim() || "Teacher-added preview placeholder.",
    subject: document.querySelector("#panel-resource-subject")?.value.trim() || state.lessonSetup.subject,
    gradeLevel: document.querySelector("#panel-resource-grade")?.value.trim() || state.lessonSetup.gradeLevel,
    tags: document.querySelector("#panel-resource-tags")?.value.split(",").map((tag) => tag.trim()).filter(Boolean) || [],
    textContent: document.querySelector("#panel-resource-text")?.value.trim() || "",
  };
  if (file) {
    try {
      await ResourceStorage.uploadFile(file, metadata);
      closePanel();
      teacherTab("resources");
    } catch (error) {
      state.profileError = String(error.message || error);
      render();
    }
    return;
  }
  const url = document.querySelector("#panel-resource-url").value.trim();
  const newResource = normalizeResource({
    id: `r${Date.now()}`,
    title,
    type,
    category: type,
    url,
    webViewLink: /^https?:/.test(url) ? url : "",
    downloadUrl: url && !/^https?:/.test(url) ? url : "",
    driveFileId: "",
    fileName: "",
    visibility: visibilityFromShareability(document.querySelector("#panel-resource-shareability").value, audience),
    audience,
    language: document.querySelector("#panel-resource-language")?.value || "English",
    shareability: document.querySelector("#panel-resource-shareability").value,
    notes: document.querySelector("#panel-resource-notes").value.trim() || "Teacher-added resource metadata.",
    description: document.querySelector("#panel-resource-notes").value.trim() || "Teacher-added preview placeholder.",
    subject: document.querySelector("#panel-resource-subject")?.value.trim() || state.lessonSetup.subject,
    gradeLevel: document.querySelector("#panel-resource-grade")?.value.trim() || state.lessonSetup.gradeLevel,
    tags: document.querySelector("#panel-resource-tags")?.value.split(",").map((tag) => tag.trim()).filter(Boolean) || [],
    textContent: document.querySelector("#panel-resource-text")?.value.trim() || "",
    dateAdded: today(),
    createdAt: new Date().toISOString(),
    createdBy: "Ms. Rivera",
    assignedStudentIds: [],
    assignedClassIds: [],
    meta: "Teacher-added",
    source: "local",
    licenseStatus: document.querySelector("#panel-resource-shareability").value,
  }, 0, state.lessonSetup);
  state.resourceList.unshift(newResource);
  state.resources = state.resourceList;
  save();
  openPanel("resources");
}
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
function studentMini(s) { return `<div class="student-line click-row" role="button" tabindex="0" onclick="event.stopPropagation(); openStudentProfile('${s.id}')" onkeydown="studentKey(event,'${s.id}')" style="padding:8px;border-top:1px solid var(--line)">${avatar(s)}<span style="flex:1"><strong class="student-name">${esc(s.name)}</strong><br/><span class="subtle">${esc(s.proficiency)} · ${esc(s.level)}</span></span>${supportTag(s.support[0] || "Check-in")}</div>`; }
function misconceptionSummary() {
  const counts = {};
  state.misconceptionLog.forEach((item) => counts[item.type] = (counts[item.type] || 0) + 1);
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
}

function lessonBuilderDashboardPage() {
  const lesson = currentLesson();
  return `${pageHead("Lesson Builder", "Create, edit, preview, and launch inquiry lessons without developer support.", `<button class="btn" onclick="createInquiryLesson()">Create lesson</button><button class="btn secondary" onclick="previewLesson('${lesson?.id || ""}')">Preview selected</button>`)}
    <section class="grid two-col">
      <div class="grid">
        <article class="card card-pad">
          <div class="card-action-head"><h3 class="section-title">Lesson templates and drafts</h3><span class="pill">${state.customLessons.length} lessons</span></div>
          <div class="panel-stack">${state.customLessons.map(lessonCard).join("")}</div>
        </article>
      </div>
      <div class="grid">
        ${lesson ? lessonEditorCard(lesson) : `<article class="card card-pad empty">Create a lesson to start building.</article>`}
        ${lesson && state.lessonBuilderMode === "preview" ? lessonPreviewCard(lesson) : ""}
        ${lesson ? lessonFlowEditorCard(lesson) : ""}
        ${lesson ? lessonAnalyticsCard(lesson) : ""}
      </div>
    </section>`;
}
function lessonCard(lesson) {
  const active = lesson.id === state.selectedLessonId;
  const launched = lesson.id === state.activeLessonId;
  return `<article class="panel-card ${active ? "selected-card" : ""}">
    <div class="card-action-head"><div><h3>${esc(lesson.title)}</h3><p class="subtle">${esc(lesson.subject)} · Grade ${esc(lesson.gradeLevel)} · ${esc(lesson.standards)}</p></div><span class="pill">${launched ? "Launched" : lesson.archived ? "Archived" : esc(lesson.status)}</span></div>
    <p class="recommendation">${esc(lesson.essentialQuestion)}</p>
    <div class="role-actions">
      <button class="btn secondary" onclick="selectInquiryLesson('${lesson.id}')">Edit</button>
      <button class="btn secondary" onclick="duplicateInquiryLesson('${lesson.id}')">Duplicate</button>
      <button class="btn secondary" onclick="archiveInquiryLesson('${lesson.id}')">${lesson.archived ? "Restore" : "Archive"}</button>
      <button class="btn" onclick="launchInquiryLesson('${lesson.id}')">Launch</button>
    </div>
  </article>`;
}
function lessonEditorCard(lesson) {
  return `<article class="card card-pad">
    <div class="card-action-head"><h3 class="section-title">Lesson Structure</h3><span class="pill">${lesson.steps.length} steps</span></div>
    <div class="form-grid resource-form">
      ${lessonInput("Lesson Title", "title", lesson.title)}
      ${lessonInput("Subject", "subject", lesson.subject)}
      ${lessonInput("Grade Level", "gradeLevel", lesson.gradeLevel)}
      ${lessonInput("Standards", "standards", lesson.standards)}
    </div>
    ${lessonTextarea("Essential Question", "essentialQuestion", lesson.essentialQuestion)}
    ${lessonTextarea("Problem Statement", "problemStatement", lesson.problemStatement)}
    ${lessonTextarea("Success Criteria", "successCriteria", lesson.successCriteria)}
    ${lessonTextarea("Constraints", "constraints", lesson.constraints)}
    <div class="form-grid resource-form" style="margin-top:12px">
      <label><span class="subtle">AI Support Level</span><select onchange="updateInquiryLesson('${lesson.id}','aiSupportLevel',this.value)">${aiSupportOptions.map((level) => `<option value="${level}" ${Number(lesson.aiGuidance.supportLevel) === level ? "selected" : ""}>${level}% Support</option>`).join("")}</select></label>
      <label><span class="subtle">AI Provider</span><select onchange="updateInquiryLesson('${lesson.id}','aiProvider',this.value)">${[["demo","Local Demo Provider"],["openai","OpenAI"],["anthropic","Anthropic"],["gemini","Google Gemini"]].map(([value,label]) => `<option value="${value}" ${value === (lesson.aiGuidance.provider || "demo") ? "selected" : ""}>${label}</option>`).join("")}</select></label>
    </div>
    <label class="lesson-builder-field"><span class="subtle">How should the AI behave?</span><textarea onchange="updateInquiryLesson('${lesson.id}','aiCustomInstructions',this.value)" placeholder="Socratic questioning, science inquiry coach, historical investigator, engineering design mentor...">${esc(lesson.aiGuidance.customInstructions || "")}</textarea></label>
    <div class="form-grid resource-form" style="margin-top:12px">
      <label><span class="subtle">Launch target</span><select onchange="updateInquiryLesson('${lesson.id}','launchTarget',this.value)">${["Entire Class","Advanced","Typical","Struggling"].map((target) => `<option ${target === (lesson.launchTarget || "Entire Class") ? "selected" : ""}>${target}</option>`).join("")}</select></label>
      <label><span class="subtle">Resources</span><select onchange="attachResourceToLesson('${lesson.id}',this.value)"><option value="">Attach resource...</option>${state.resourceList.map((resource) => `<option value="${esc(resource.id)}">${esc(resource.title)}</option>`).join("")}</select></label>
    </div>
    <div class="badge-row" style="margin-top:10px">${lesson.resources.length ? lesson.resources.map((id) => {
      const r = state.resourceList.find((resource) => resource.id === id);
      return r ? `<span class="tag">${esc(r.title)} <button class="tiny-remove" onclick="removeResourceFromLesson('${lesson.id}','${r.id}')" aria-label="Remove ${esc(r.title)}">×</button></span>` : "";
    }).join("") : `<span class="subtle">No resources attached yet.</span>`}</div>
  </article>`;
}
function lessonPreviewCard(lesson) {
  return `<article class="card card-pad">
    <div class="card-action-head"><h3 class="section-title">Student Preview</h3><span class="pill">${esc(lesson.aiGuidance.supportLevel)}% AI Support</span></div>
    <p class="recommendation">${esc(lesson.essentialQuestion)}</p>
    <p class="subtle">Provider: ${esc(providerLabelFor(lesson.aiGuidance.provider))} · ${esc(lesson.aiGuidance.customInstructions || "Inquiry coach")}</p>
    <div class="timeline">${lesson.steps.map((step, index) => `<div class="timeline-item"><strong>Step ${index + 1}: ${esc(step.title)}</strong><p>${esc(step.prompt)}</p><span class="quality">${esc(step.type)} · ${esc(step.minutes)} min</span></div>`).join("")}</div>
  </article>`;
}
function providerLabelFor(provider = "demo") {
  return { demo: "Local Demo Provider", openai: "OpenAI", anthropic: "Anthropic", gemini: "Google Gemini" }[provider] || "Local Demo Provider";
}
function lessonInput(label, key, value) {
  const lesson = currentLesson();
  return `<label><span class="subtle">${label}</span><input type="text" value="${esc(value)}" onchange="updateInquiryLesson('${lesson.id}','${key}',this.value)"></label>`;
}
function lessonTextarea(label, key, value) {
  const lesson = currentLesson();
  return `<label class="lesson-builder-field"><span class="subtle">${label}</span><textarea onchange="updateInquiryLesson('${lesson.id}','${key}',this.value)">${esc(value)}</textarea></label>`;
}
function lessonFlowEditorCard(lesson) {
  return `<article class="card card-pad">
    <div class="card-action-head"><h3 class="section-title">Inquiry Flow Editor</h3><button class="btn secondary" onclick="addLessonStep('${lesson.id}')">Add step</button></div>
    <div class="panel-stack">${lesson.steps.map((step, index) => lessonStepEditor(lesson, step, index)).join("")}</div>
  </article>`;
}
function lessonStepEditor(lesson, step, index) {
  return `<div class="timeline-item">
    <div class="card-action-head"><strong>Step ${index + 1}</strong><span class="role-actions"><button class="btn secondary" onclick="moveLessonStep('${lesson.id}','${step.id}',-1)">↑</button><button class="btn secondary" onclick="moveLessonStep('${lesson.id}','${step.id}',1)">↓</button><button class="btn secondary" onclick="duplicateLessonStep('${lesson.id}','${step.id}')">Duplicate</button><button class="btn danger" onclick="removeLessonStep('${lesson.id}','${step.id}')">Remove</button></span></div>
    <div class="form-grid resource-form">
      <label><span class="subtle">Step Type</span><select onchange="updateLessonStep('${lesson.id}','${step.id}','type',this.value)">${lessonStepTypes.map((type) => `<option ${type === step.type ? "selected" : ""}>${esc(type)}</option>`).join("")}</select></label>
      <label><span class="subtle">Title</span><input type="text" value="${esc(step.title)}" onchange="updateLessonStep('${lesson.id}','${step.id}','title',this.value)"></label>
    </div>
    <label class="lesson-builder-field"><span class="subtle">Student prompt</span><textarea onchange="updateLessonStep('${lesson.id}','${step.id}','prompt',this.value)">${esc(step.prompt)}</textarea></label>
    <label class="lesson-builder-field"><span class="subtle">Minutes</span><input type="number" min="1" max="60" value="${esc(step.minutes)}" onchange="updateLessonStep('${lesson.id}','${step.id}','minutes',this.value)"></label>
  </div>`;
}
function lessonAnalyticsCard(lesson) {
  const analytics = lesson.id === state.activeLessonId ? activeLessonAnalytics(lesson) : lesson.analytics;
  return `<article class="card card-pad">
    <div class="card-action-head"><h3 class="section-title">Lesson Analytics</h3><span class="pill">${lesson.id === state.activeLessonId ? "Live" : "Preview"}</span></div>
    <div class="bar-row"><span>Active Students</span>${progress(Math.min(100, analytics.activeStudents * 4))}<strong>${analytics.activeStudents}</strong></div>
    <div class="bar-row"><span>Completion Rate</span>${progress(analytics.completionRate)}<strong>${analytics.completionRate}%</strong></div>
    <div class="bar-row"><span>Questions Generated</span>${progress(Math.min(100, analytics.questionsGenerated * 5))}<strong>${analytics.questionsGenerated}</strong></div>
    <div class="bar-row"><span>Reflection Quality</span>${progress(analytics.averageReflectionQuality)}<strong>${analytics.averageReflectionQuality}%</strong></div>
    <div class="bar-row"><span>Need Support</span>${progress(Math.min(100, analytics.studentsNeedingSupport * 18))}<strong>${analytics.studentsNeedingSupport}</strong></div>
  </article>`;
}
function activeLessonAnalytics(lesson) {
  const supportCount = teacherAlertStudents().length;
  const completion = Math.round((state.studentActivityIndex + 1) / Math.max(1, activeLessonActivities().length) * 100);
  return {
    activeStudents: 23,
    completionRate: Math.max(lesson.analytics.completionRate || 0, Math.min(96, completion)),
    questionsGenerated: state.dqb.length,
    averageReflectionQuality: classInsightMetrics()["Reflection Quality"],
    studentsNeedingSupport: supportCount,
  };
}
function selectInquiryLesson(lessonId) {
  state.selectedLessonId = lessonId;
  state.lessonBuilderMode = "edit";
  save();
  render();
}
function createInquiryLesson() {
  const lesson = createLessonTemplate({ id: `lesson-${Date.now()}`, title: "New Inquiry Lesson", status: "Draft", createdAt: today(), updatedAt: today() });
  state.customLessons.unshift(lesson);
  state.selectedLessonId = lesson.id;
  save();
  render();
}
function duplicateInquiryLesson(lessonId) {
  const source = state.customLessons.find((lesson) => lesson.id === lessonId);
  if (!source) return;
  const copy = structuredClone(source);
  copy.id = `lesson-${Date.now()}`;
  copy.title = `${source.title} Copy`;
  copy.status = "Draft";
  copy.archived = false;
  copy.createdAt = today();
  copy.updatedAt = today();
  copy.steps = copy.steps.map((step, index) => ({ ...step, id: `step-${copy.id}-${index}` }));
  state.customLessons.unshift(copy);
  state.selectedLessonId = copy.id;
  save();
  render();
}
function archiveInquiryLesson(lessonId) {
  const lesson = state.customLessons.find((item) => item.id === lessonId);
  if (!lesson) return;
  lesson.archived = !lesson.archived;
  lesson.status = lesson.archived ? "Archived" : "Draft";
  if (state.activeLessonId === lessonId && lesson.archived) state.activeLessonId = state.customLessons.find((item) => !item.archived)?.id || lessonId;
  save();
  render();
}
function launchInquiryLesson(lessonId) {
  const lesson = state.customLessons.find((item) => item.id === lessonId);
  if (!lesson) return;
  state.customLessons.forEach((item) => { if (item.status === "Launched") item.status = "Draft"; });
  lesson.status = "Launched";
  lesson.archived = false;
  lesson.analytics = { activeStudents: 23, completionRate: 12, questionsGenerated: state.dqb.length, averageReflectionQuality: classInsightMetrics()["Reflection Quality"], studentsNeedingSupport: teacherAlertStudents().length };
  state.activeLessonId = lesson.id;
  state.selectedLessonId = lesson.id;
  state.lessonLaunches.unshift({ lessonId, target: lesson.launchTarget || "Entire Class", launchedAt: new Date().toLocaleString() });
  state.lessonSetup.lessonTitle = lesson.title;
  state.lessonSetup.subject = lesson.subject;
  state.lessonSetup.gradeLevel = lesson.gradeLevel;
  state.lessonSetup.standard = lesson.standards;
  state.lessonSetup.aiSupportLevel = lesson.aiGuidance.supportLevel;
  state.lessonSetup.aiProvider = lesson.aiGuidance.provider || "demo";
  state.lessonSetup.aiCustomInstructions = lesson.aiGuidance.customInstructions || "Science inquiry coach";
  state.studentActivityIndex = 0;
  assignLessonResourcesToTarget(lesson);
  save();
  render();
}
function assignLessonResourcesToTarget(lesson) {
  const target = lesson.launchTarget || "Entire Class";
  const students = state.students.filter((student) => {
    if (target === "Advanced") return isAdvancedLearner(student);
    if (target === "Struggling") return isStrugglingLearner(student);
    if (target === "Typical") return isTypicalLearner(student);
    return true;
  });
  (lesson.resources || []).forEach((resourceId) => {
    students.forEach((student) => {
      student.assignedResources = student.assignedResources || [];
      if (!student.assignedResources.some((assignment) => assignment.resourceId === resourceId)) {
        student.assignedResources.unshift({ resourceId, dateAssigned: today() });
      }
    });
  });
  syncResourceAssignmentMetadata();
}
function updateInquiryLesson(lessonId, key, value) {
  const lesson = state.customLessons.find((item) => item.id === lessonId);
  if (!lesson) return;
  if (key === "aiSupportLevel") lesson.aiGuidance.supportLevel = Number(value);
  else if (key === "aiProvider") lesson.aiGuidance.provider = value;
  else if (key === "aiCustomInstructions") lesson.aiGuidance.customInstructions = value;
  else lesson[key] = value;
  lesson.updatedAt = today();
  save();
  render();
}
function attachResourceToLesson(lessonId, resourceId) {
  if (!resourceId) return;
  const lesson = state.customLessons.find((item) => item.id === lessonId);
  if (!lesson) return;
  lesson.resources = Array.from(new Set([...(lesson.resources || []), resourceId]));
  save();
  render();
}
function removeResourceFromLesson(lessonId, resourceId) {
  const lesson = state.customLessons.find((item) => item.id === lessonId);
  if (!lesson) return;
  lesson.resources = (lesson.resources || []).filter((id) => id !== resourceId);
  save();
  render();
}
function addLessonStep(lessonId) {
  const lesson = state.customLessons.find((item) => item.id === lessonId);
  if (!lesson) return;
  lesson.steps.push({ id: `step-${Date.now()}`, type: "Observation", title: "New inquiry step", prompt: "What should students do or think about here?", minutes: 8 });
  save();
  render();
}
function updateLessonStep(lessonId, stepId, key, value) {
  const lesson = state.customLessons.find((item) => item.id === lessonId);
  const step = lesson?.steps.find((item) => item.id === stepId);
  if (!step) return;
  step[key] = key === "minutes" ? Number(value) : value;
  lesson.updatedAt = today();
  save();
  render();
}
function removeLessonStep(lessonId, stepId) {
  const lesson = state.customLessons.find((item) => item.id === lessonId);
  if (!lesson) return;
  lesson.steps = lesson.steps.filter((step) => step.id !== stepId);
  save();
  render();
}
function duplicateLessonStep(lessonId, stepId) {
  const lesson = state.customLessons.find((item) => item.id === lessonId);
  const index = lesson?.steps.findIndex((step) => step.id === stepId) ?? -1;
  if (!lesson || index < 0) return;
  const copy = { ...lesson.steps[index], id: `step-${Date.now()}`, title: `${lesson.steps[index].title} Copy` };
  lesson.steps.splice(index + 1, 0, copy);
  save();
  render();
}
function moveLessonStep(lessonId, stepId, direction) {
  const lesson = state.customLessons.find((item) => item.id === lessonId);
  const index = lesson?.steps.findIndex((step) => step.id === stepId) ?? -1;
  const nextIndex = index + direction;
  if (!lesson || index < 0 || nextIndex < 0 || nextIndex >= lesson.steps.length) return;
  const [step] = lesson.steps.splice(index, 1);
  lesson.steps.splice(nextIndex, 0, step);
  save();
  render();
}
function previewLesson(lessonId) {
  if (lessonId) state.selectedLessonId = lessonId;
  state.lessonBuilderMode = "preview";
  save();
  render();
}
function activeLessonActivities() {
  const lesson = launchedLesson();
  return (lesson?.steps?.length ? lesson.steps : activities).map((step, index) => ({
    id: step.id || `lesson-step-${index}`,
    eyebrow: step.type || "Inquiry",
    title: step.title || `Step ${index + 1}`,
    prompt: step.prompt || "Add a student response.",
    hint: lesson?.essentialQuestion || "Use evidence and reasoning.",
    context: lesson?.problemStatement || "",
    slide: index + 1,
    minutes: step.minutes || 8,
    placeholder: "Type your thinking here...",
  }));
}

function setupPage() {
  const setup = state.lessonSetup;
  return `${pageHead("Teacher Setup Wizard", "Configure the instructional guardrails before launching the lesson.", `<button class="btn secondary" onclick="openPanel('lessonBuilder')">Open Lesson Builder</button><button class="btn" onclick="teacherTab('overview')">Launch configured lesson</button>`)}
    <section class="grid two-col">
      <article class="card card-pad">
        <h3 class="section-title">Lesson identity</h3>
        <div class="form-grid">
          ${field("Lesson title", "lessonTitle", setup.lessonTitle)}
          ${field("Grade level", "gradeLevel", setup.gradeLevel)}
          ${field("Subject", "subject", setup.subject)}
          ${field("State", "state", setup.state)}
          ${selectField("Standard placeholder", "standard", ["MS-LS2-4"], setup.standard)}
          ${selectField("Allowed AI support", "supportLevel", ["Guided hints only", "Vocabulary and sentence starters", "Strategic hints plus examples"], setup.supportLevel)}
          ${selectField("Session time limit", "sessionLimit", ["5 minutes", "10 minutes", "15 minutes", "Prompt limit"], setup.sessionLimit)}
          ${selectField("Prompt limit", "promptLimit", [3, 5, 8, 10], setup.promptLimit)}
        </div>
        <div class="toggle-row"><label><input type="checkbox" ${setup.spanishSupport ? "checked" : ""} onchange="updateSetup('spanishSupport', this.checked)"> English/Spanish support</label><label><input type="checkbox" ${setup.studentResources ? "checked" : ""} onchange="updateSetup('studentResources', this.checked)"> Student-facing resources</label></div>
      </article>
      <article class="card card-pad">
        <h3 class="section-title">Mastery definition</h3>
        <label class="subtle">What does mastery look like for this lesson?</label>
        <textarea onchange="updateSetup('masteryGoal', this.value)">${esc(setup.masteryGoal)}</textarea>
        <label class="subtle">Prerequisite skills</label>
        <textarea onchange="updateSetup('prerequisites', this.value)">${esc(setup.prerequisites)}</textarea>
        <label class="subtle">Expected misconceptions</label>
        <textarea onchange="updateSetup('expectedMisconceptions', this.value)">${esc(setup.expectedMisconceptions)}</textarea>
      </article>
    </section>
    <article class="card card-pad" style="margin-top:14px"><h3 class="section-title">Sample standard route</h3><div class="route"><span>Kentucky</span>${icons.arrow}<span>Grade 7</span>${icons.arrow}<span>Science</span>${icons.arrow}<span>Ecosystems</span>${icons.arrow}<strong>MS-LS2-4</strong></div></article>
    <article class="card card-pad" style="margin-top:14px"><h3 class="section-title">AI support levels</h3>
      ${aiDashboardStudents().map((s) => `<div class="allocation"><div class="student-line">${avatar(s)}<span><strong class="student-name">${esc(s.name)}</strong><br/><span class="subtle">${esc(s.learnerDemoType || "Learner")}</span></span></div><select onchange="updateAISupportLevel('${s.id}',this.value)">${[15,50,85].map((level) => `<option value="${level}" ${Number(s.aiSupportLevel || 50) === level ? "selected" : ""}>${level}% Support</option>`).join("")}</select><span class="subtle">${aiSupportDescription(s.aiSupportLevel || 50)}</span></div>`).join("")}
    </article>`;
}
function field(label, key, value) { return `<label><span class="subtle">${label}</span><input type="text" value="${esc(value)}" onchange="updateSetup('${key}', this.value)"></label>`; }
function selectField(label, key, options, value) { return `<label><span class="subtle">${label}</span><select onchange="updateSetup('${key}', this.value)">${options.map(o => `<option ${String(o) === String(value) ? "selected" : ""}>${esc(o)}</option>`).join("")}</select></label>`; }
function updateSetup(key, value) { state.lessonSetup[key] = key === "promptLimit" ? Number(value) : value; save(); render(); }
function updateAISupportLevel(studentId, value) {
  const s = state.students.find((student) => student.id === studentId);
  if (!s) return;
  s.aiSupportLevel = Number(value);
  s.learnerDemoType = s.aiSupportLevel === 15 ? "Advanced Learner" : s.aiSupportLevel === 85 ? "Intervention Learner" : "Typical Learner";
  save();
  render();
}
function aiSupportDescription(level) {
  const value = Number(level);
  if (value === 15) return "Mostly questions, minimal hints.";
  if (value === 85) return "Vocabulary, structure, and guided prompts.";
  return "Moderate scaffolding and light sentence starters.";
}
function studentsPage() {
  const filters = [["all", "All students"], ["hot", "Hot list"], ["support", "Needs support"], ["multi", "Multilingual"]];
  const visibleStudents = filteredStudents();
  return `${pageHead("Student Support", "Filter students, open profiles, and plan targeted check-ins.", `<button class="btn secondary" onclick="openPanel('addStudent')" aria-label="Add student">Add student</button>`)}
    <article class="card card-pad"><div class="toolbar">${filters.map(([id, label]) => `<button class="btn ${state.teacherStudentFilter === id ? "active" : "secondary"}" onclick="setStudentFilter('${id}')">${label}</button>`).join("")}</div>
    ${visibleStudents.length ? visibleStudents.map(s => studentRow(s)).join("") : `<div class="empty">No students match this filter.</div>`}</article>`;
}
function filteredStudents() {
  const filter = state.teacherStudentFilter || "all";
  if (filter === "hot") return state.students.filter(isHotList);
  if (filter === "support") return state.students.filter((s) => s.level === "Intervention" || s.level === "Below level" || s.support.includes("IEP/504") || s.support.includes("Intervention"));
  if (filter === "multi") return state.students.filter((s) => s.language === "Spanish" || s.support.includes("English Learner"));
  return state.students;
}
function setStudentFilter(filter) {
  state.teacherStudentFilter = filter;
  save();
  render();
}
function studentRow(s) {
  return `<div class="student-row profile-row click-row" role="button" tabindex="0" onclick="openStudentProfile('${s.id}')" onkeydown="studentKey(event,'${s.id}')">
    <div class="student-line">${avatar(s)}<span><strong class="student-name">${esc(s.name)}</strong><br/><span>${s.support.map(supportTag).join("") || `<span class="tag">Standard</span>`}</span></span></div>
    <span class="subtle">${esc(s.proficiency)}<br/>${esc(s.language)}</span>
    <div><span class="subtle">Reading: ${esc(s.reading)} · Math: ${esc(s.math)}</span><br/><span class="subtle">Interest: ${esc(s.interest)}</span><br/>${progress(s.progress)}</div>
    <div class="profile-controls" onclick="event.stopPropagation()"><select onchange="updateStudent('${s.id}','proficiency',this.value)">${["Novice","Apprentice","Proficient","Distinguished"].map(p => `<option ${p === s.proficiency ? "selected" : ""}>${p}</option>`).join("")}</select><label class="subtle"><input type="checkbox" ${isHotList(s) ? "checked" : ""} onchange="toggleHotList('${s.id}',this.checked)"> Hot List</label><button class="btn ghost" onclick="openStudentProfile('${s.id}')">View</button></div>
  </div>`;
}
function studentKey(event, studentId) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openStudentProfile(studentId);
  }
}
function studentDetailPanel() {
  const s = state.students.find((item) => item.id === state.selectedStudent) || state.students[0];
  return `${panelHeader("Student detail", "Support status, recommended action, and check-in notes.")}
    ${studentPanelCard(s, true)}
    <article class="panel-card">
      <h3>Progress and support status</h3>
      ${progress(s.progress)}
      <div class="detail-grid">
        <span>Progress</span><strong>${s.progress}% through current lesson</strong>
        <span>Support status</span><strong>${esc(s.level)} · ${esc(s.proficiency)}</strong>
        <span>Recommended teacher action</span><strong>${esc(recommendedScaffold(s))}</strong>
        <span>Check-in area</span><strong>${esc(s.notes || "Add notes in the Teacher notes box above.")}</strong>
      </div>
    </article>`;
}
function addStudentPanel() {
  return `${panelHeader("Add student", "Create a demo student profile for the support dashboard.")}
    <article class="panel-card">
      <div class="form-grid resource-form">
        <label><span class="subtle">Student name</span><input id="panel-student-name" type="text" placeholder="Student name"></label>
        <label><span class="subtle">Grade</span><input id="panel-student-grade" type="text" placeholder="7"></label>
        <label><span class="subtle">Status / level</span><select id="panel-student-level"><option>On level</option><option>Below level</option><option>Intervention</option><option>Above level</option></select></label>
        <label><span class="subtle">Optional tag/status</span><select id="panel-student-tag"><option>Standard</option><option>Hot List</option><option>Intervention</option><option>English Learner</option><option>IEP/504</option><option>Gifted</option></select></label>
      </div>
      <label class="subtle">Notes / needs</label>
      <textarea id="panel-student-notes" placeholder="Add support needs, check-in notes, or context for this student."></textarea>
      <div class="role-actions" style="margin-top:12px"><button class="btn" onclick="addPanelStudent()">Save student</button><button class="btn secondary" onclick="closePanel()">Cancel</button></div>
    </article>`;
}
function initialsFromName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0]?.slice(0, 2) || "ST").toUpperCase();
}
function addPanelStudent() {
  const name = document.querySelector("#panel-student-name")?.value.trim();
  if (!name) return;
  const tagValue = document.querySelector("#panel-student-tag")?.value || "Standard";
  const support = tagValue === "Standard" ? [] : [tagValue];
  const addedDate = today();
  const newStudent = {
    id: `s${Date.now()}`,
    name,
    initials: initialsFromName(name),
    studentId: `SID-${Date.now().toString().slice(-6)}`,
    dateAdded: addedDate,
    grade: document.querySelector("#panel-student-grade")?.value.trim() || state.lessonSetup.gradeLevel || "7",
    className: "Period 2",
    language: tagValue === "English Learner" ? "Spanish" : "English",
    level: document.querySelector("#panel-student-level")?.value || "On level",
    proficiency: "Novice",
    support,
    hotListMove: tagValue === "Hot List" ? "Novice close to Apprentice" : "",
    allocation: tagValue === "Hot List" || tagValue === "Intervention" ? 100 : 60,
    monthlyCredits: tagValue === "Hot List" || tagValue === "Intervention" ? 150 : 90,
    used: 0,
    progress: 0,
    reading: `Grade ${document.querySelector("#panel-student-grade")?.value.trim() || state.lessonSetup.gradeLevel || "7"}`,
    math: `Grade ${document.querySelector("#panel-student-grade")?.value.trim() || state.lessonSetup.gradeLevel || "7"}`,
    interest: "new profile",
    notes: document.querySelector("#panel-student-notes")?.value.trim() || "New student profile added during the demo.",
    profileNotes: [{
      id: `n${Date.now()}`,
      date: addedDate,
      teacher: "Ms. Rivera",
      type: "Intake",
      note: document.querySelector("#panel-student-notes")?.value.trim() || "New student profile added during the demo.",
    }],
    assignedResources: [],
    hotlistInfo: {
      priority: tagValue === "Hot List" ? "Medium" : "Not set",
      dateAdded: tagValue === "Hot List" ? addedDate : "",
      reason: tagValue === "Hot List" ? "Added during student profile creation." : "",
    },
    aiHistory: [],
  };
  state.students.unshift(newStudent);
  state.hotListStudents = state.students.filter(isHotList).map((student) => student.id);
  state.teacherTab = "students";
  state.teacherStudentFilter = "all";
  state.selectedStudent = newStudent.id;
  state.activePanel = null;
  save();
  render();
}
function currentProfileStudent() {
  return state.students.find((item) => item.id === state.selectedStudent) || state.students[0];
}
function studentProfilePage() {
  const s = currentProfileStudent();
  if (!s) {
    return `${pageHead("Student Profile", "No student is currently selected.", `<button class="btn secondary" onclick="teacherTab('students')">Back to student list</button>`)}
      <article class="card card-pad empty"><h3>No profile found.</h3><p>Select a student from the Student Support list to open their profile.</p></article>`;
  }
  const assigned = assignedResourceDetails(s);
  const aiEntries = s.aiHistory || [];
  return `${pageHead("Student Profile", "Complete student support record stored in local demo state.", `<button class="btn secondary" onclick="teacherTab('students')">Back to student list</button>`)}
    <section class="profile-hero card card-pad">
      <div class="student-line">${avatar(s)}<span><h1>${esc(s.name)}</h1><span class="subtle">Grade ${esc(s.grade)} · Student ID ${esc(s.studentId || s.id)} · Added ${esc(s.dateAdded || "Not recorded")}</span></span></div>
      <div class="profile-status"><span class="pill">${esc(s.level || "Status not set")}</span>${isHotList(s) ? `<span class="pill hot-pill">Hot List</span>` : `<span class="pill">Not on Hot List</span>`}<span class="pill">Profile loaded</span></div>
    </section>
    <section class="grid two-col profile-layout">
      <div class="grid">
        <article class="card card-pad">
          <div class="card-action-head"><h3 class="section-title">Student Information</h3><button class="btn secondary" onclick="openPanel('editStudent',{studentId:'${s.id}'})">Edit Student</button></div>
          <div class="detail-grid">
            <span>Name</span><strong>${esc(s.name)}</strong>
            <span>Grade</span><strong>${esc(s.grade)}</strong>
            <span>Status</span><strong>${esc(s.level)} · ${esc(s.proficiency)}</strong>
            <span>Language</span><strong>${esc(s.language)}</strong>
            <span>Reading / Math</span><strong>${esc(s.reading)} / ${esc(s.math)}</strong>
            <span>Tags</span><strong>${s.support.length ? s.support.map(supportTag).join("") : "Standard"}</strong>
            <span>Notes</span><strong>${esc(s.notes || "No notes yet.")}</strong>
            <span>Any stored info</span><strong>${esc(`Class: ${s.className}; Interest: ${s.interest}; Progress: ${s.progress}%`)}</strong>
          </div>
        </article>
        <article class="card card-pad">
          <div class="card-action-head"><h3 class="section-title">Student Thinking Timeline</h3><button class="btn secondary" onclick="openPanel('studentInquiryReport',{studentId:'${s.id}'})">Generate Student Inquiry Report</button></div>
          ${studentThinkingTimeline(s)}
        </article>
        <article class="card card-pad">
          <h3 class="section-title">Teacher Notes / Intervention Timeline</h3>
          <p class="subtle">Teacher-only notes stored locally for this demo.</p>
          <div class="role-actions"><button class="btn" onclick="openPanel('addNote',{studentId:'${s.id}'})">Add Note</button></div>
          <div class="timeline">${(s.profileNotes || []).length ? s.profileNotes.map((note) => noteItem(s, note)).join("") : `<div class="empty">No notes yet. Add the first intervention note for this student.</div>`}</div>
        </article>
        <article class="card card-pad">
          <div class="card-action-head"><h3 class="section-title">Assigned Resources</h3><button class="btn secondary" onclick="openPanel('assignResource',{studentId:'${s.id}'})">Assign Resource</button></div>
          ${assigned.length ? assigned.map(({ item, assignedOn }) => resourceAssignmentItem(s, item, assignedOn)).join("") : `<div class="empty">No resources assigned yet.</div>`}
        </article>
      </div>
      <aside class="grid">
        <article class="card card-pad">
          <h3 class="section-title">Quick Actions</h3>
          <div class="profile-actions">
            <button class="btn secondary" onclick="openPanel('editStudent',{studentId:'${s.id}'})">Edit Student</button>
            <button class="btn secondary" onclick="openPanel('addNote',{studentId:'${s.id}'})">Add Note</button>
            ${isHotList(s) ? `<button class="btn secondary" onclick="removeStudentFromHotlist('${s.id}')">Remove from Hotlist</button>` : `<button class="btn secondary" onclick="addStudentToHotlist('${s.id}')">Add to Hotlist</button>`}
            <button class="btn secondary" onclick="openPanel('editHotlist',{studentId:'${s.id}'})">Edit Hotlist Info</button>
            <button class="btn secondary" onclick="openPanel('assignResource',{studentId:'${s.id}'})">Assign Resource</button>
            <button class="btn secondary" onclick="openPanel('studentInquiryReport',{studentId:'${s.id}'})">Generate Inquiry Report</button>
            <button class="btn danger" onclick="openPanel('deleteStudent',{studentId:'${s.id}'})">Delete Student</button>
          </div>
        </article>
        <article class="card card-pad">
          <div class="card-action-head"><h3 class="section-title">Hotlist Section</h3><button class="btn secondary" onclick="openPanel('editHotlist',{studentId:'${s.id}'})">Edit</button></div>
          <div class="detail-grid">
            <span>Status</span><strong>${isHotList(s) ? "Currently on Hot List" : "Not on Hot List"}</strong>
            <span>Priority</span><strong>${esc(s.hotlistInfo?.priority || "Not set")}</strong>
            <span>Date added</span><strong>${esc(s.hotlistInfo?.dateAdded || "Not added")}</strong>
            <span>Reason</span><strong>${esc(s.hotlistInfo?.reason || "No reason recorded.")}</strong>
          </div>
        </article>
        <article class="card card-pad">
          <h3 class="section-title">AI Learning Support History</h3>
          ${aiEntries.length ? aiEntries.map((entry) => `<div class="timeline-item"><strong>${esc(entry.date)}</strong><p>${esc(entry.summary)}</p><span class="quality">${esc(entry.type || "AI support")}</span></div>`).join("") : `<div class="empty">No AI support history yet. Future AI summaries will appear here.</div>`}
        </article>
      </aside>
    </section>`;
}
function studentThinkingTimeline(student) {
  const entries = student.inquiryHistory || [];
  if (!entries.length) return `<div class="empty">No inquiry timeline entries yet.</div>`;
  return `<div class="timeline">${entries.map((entry) => {
    const flags = analyzeInquiryEntry(entry);
    return `<div class="timeline-item thinking-entry">
      <div class="card-action-head"><strong>${esc(entry.timestamp || "Time not recorded")}</strong><span class="ai-badge-row">${flags.map(insightBadge).join("")}</span></div>
      <div class="thinking-grid">
        <span>Original Question</span><p>${esc(entry.originalQuestion || "Not recorded")}</p>
        <span>Student Response</span><p>${esc(entry.studentResponse || "No response recorded")}</p>
        <span>AI Follow-Up Question</span><p>${esc(entry.aiFollowUp || "No follow-up recorded")}</p>
        <span>Revised Student Response</span><p>${esc(entry.revisedResponse || "No revision recorded")}</p>
      </div>
    </div>`;
  }).join("")}</div>`;
}
function studentInquiryReportPanel() {
  const s = profileStudentOrError();
  if (!s) return `${panelHeader("Student Inquiry Report")}<p class="empty">Student not found.</p>`;
  const flags = studentInsightFlags(s);
  const concerns = flags.filter((flag) => flag.type !== "strong");
  const strengths = flags.filter((flag) => flag.type === "strong");
  const questions = (s.inquiryHistory || []).map((entry) => entry.originalQuestion);
  return `${panelHeader("Student Inquiry Report", "Printable local demo summary for teacher planning.")}
    <article class="panel-card report-card">
      <div class="card-action-head"><h3>${esc(s.name)}</h3><button class="btn secondary" onclick="window.print()">Print Report</button></div>
      <div class="detail-grid">
        <span>Student</span><strong>${esc(s.name)} · Grade ${esc(s.grade)} · ${esc(s.level)}</strong>
        <span>Questions Asked</span><strong>${questions.length ? questions.map(esc).join("; ") : "No inquiry questions recorded."}</strong>
        <span>Reasoning Growth</span><strong>${esc(reasoningGrowthSummary(s))}</strong>
        <span>Areas of Concern</span><strong>${concerns.length ? concerns.map((flag) => esc(flag.label)).join(", ") : "No current concerns flagged."}</strong>
        <span>Areas of Strength</span><strong>${strengths.length ? strengths.map((flag) => esc(flag.reason)).join(" ") : esc(areasOfStrength(s))}</strong>
      </div>
    </article>
    <article class="panel-card">
      <h3>Teacher Notes</h3>
      ${(s.profileNotes || []).length ? s.profileNotes.map((note) => `<div class="timeline-item"><strong>${esc(note.date)} · ${esc(note.type)}</strong><p>${esc(note.note)}</p><span class="quality">${esc(note.teacher)}</span></div>`).join("") : `<div class="empty">No teacher notes yet.</div>`}
    </article>`;
}
function reasoningGrowthSummary(student) {
  const entries = student.inquiryHistory || [];
  if (!entries.length) return "No inquiry growth evidence recorded yet.";
  const improved = entries.filter((entry) => String(entry.revisedResponse || "").length > String(entry.studentResponse || "").length + 20).length;
  return improved ? `${improved} of ${entries.length} response${entries.length === 1 ? "" : "s"} show expanded reasoning after AI follow-up.` : "Responses show early thinking; student may need more support revising with evidence.";
}
function areasOfStrength(student) {
  const profile = studentInsightProfile(student);
  const strongest = Object.entries({
    "Questioning Skills": profile.questioning,
    "Evidence Use": profile.evidence,
    "Reasoning Quality": profile.reasoning,
    "Reflection Quality": profile.reflection,
  }).sort((a, b) => b[1] - a[1])[0];
  return strongest ? `${strongest[0]} is the strongest current inquiry signal.` : "Strengths will appear after more inquiry entries.";
}
function noteItem(student, note) {
  return `<div class="timeline-item">
    <div class="card-action-head"><div><strong>${esc(note.date)}</strong><p>${esc(note.note)}</p><span class="quality">${esc(note.type)} · ${esc(note.teacher)}</span></div><div class="role-actions"><button class="btn secondary" onclick="openPanel('editNote',{studentId:'${student.id}',noteId:'${note.id}'})">Edit</button><button class="btn danger" onclick="deleteProfileNote('${student.id}','${note.id}')">Delete</button></div></div>
  </div>`;
}
function assignedResourceDetails(student) {
  return (student.assignedResources || []).map((assignment) => ({
    item: state.resourceList.find((resource) => resource.id === assignment.resourceId),
    assignedOn: assignment.dateAssigned,
  })).filter((entry) => entry.item);
}
function studentVisibleResourceDetails(student) {
  return assignedResourceDetails(student).map((entry) => ({ ...entry, access: "Assigned" }));
}
function resourceAssignmentItem(student, resource, assignedOn) {
  return `<div class="resource-row click-row" role="button" tabindex="0" onclick="openResourceViewer('${resource.id}','studentProfile')" onkeydown="resourceKey(event,'${resource.id}')"><div class="student-line"><span class="resource-icon">${esc(resourceDisplayType(resource).slice(0,2).toUpperCase())}</span><span><strong class="student-name">${esc(resource.title)}</strong><br/><span class="subtle">${esc(resourceDisplayType(resource))} · Assigned ${esc(assignedOn || "today")}</span></span></div><button class="btn danger" onclick="event.stopPropagation(); removeAssignedResource('${student.id}','${resource.id}')">Remove</button></div>`;
}
function updateStudent(id, key, value) { state.students.find(s => s.id === id)[key] = value; save(); render(); }
function toggleHotList(id, checked) {
  const s = state.students.find(student => student.id === id);
  s.support = checked ? Array.from(new Set([...s.support.filter((tag) => !hotListText(tag)), "Hot List"])) : s.support.filter((tag) => !hotListText(tag));
  s.hotlistInfo = checked ? { ...(s.hotlistInfo || {}), priority: s.hotlistInfo?.priority || "Medium", dateAdded: s.hotlistInfo?.dateAdded || today(), reason: s.hotlistInfo?.reason || "Marked for targeted support." } : { ...(s.hotlistInfo || {}), priority: "Not set", dateAdded: "", reason: "" };
  save(); render();
}
function formError() { return state.profileError ? `<p class="warning">${esc(state.profileError)}</p>` : ""; }
function profileStudentOrError() {
  const s = currentProfileStudent();
  return s || null;
}
function editStudentPanel() {
  const s = profileStudentOrError();
  if (!s) return `${panelHeader("Edit Student")}<p class="empty">Student not found.</p>`;
  return `${panelHeader("Edit Student", "Update student profile information.")}
    <article class="panel-card">${formError()}
      <div class="form-grid resource-form">
        <label><span class="subtle">Student name</span><input id="edit-student-name" type="text" value="${esc(s.name)}"></label>
        <label><span class="subtle">Grade</span><input id="edit-student-grade" type="text" value="${esc(s.grade)}"></label>
        <label><span class="subtle">Status</span><select id="edit-student-level">${["On level","Below level","Intervention","Above level"].map((level) => `<option ${level === s.level ? "selected" : ""}>${level}</option>`).join("")}</select></label>
        <label><span class="subtle">Proficiency</span><select id="edit-student-proficiency">${["Novice","Apprentice","Proficient","Distinguished"].map((level) => `<option ${level === s.proficiency ? "selected" : ""}>${level}</option>`).join("")}</select></label>
        <label><span class="subtle">Language</span><select id="edit-student-language">${["English","Spanish"].map((language) => `<option ${language === s.language ? "selected" : ""}>${language}</option>`).join("")}</select></label>
        <label><span class="subtle">Tags, comma separated</span><input id="edit-student-tags" type="text" value="${esc(s.support.join(", "))}"></label>
      </div>
      <label class="subtle">Notes / needs</label>
      <textarea id="edit-student-notes">${esc(s.notes || "")}</textarea>
      <div class="role-actions" style="margin-top:12px"><button class="btn" onclick="saveStudentEdits('${s.id}')">Save changes</button><button class="btn secondary" onclick="closePanel()">Cancel</button></div>
    </article>`;
}
function saveStudentEdits(id) {
  const s = state.students.find((student) => student.id === id);
  const name = document.querySelector("#edit-student-name")?.value.trim();
  if (!s || !name) { state.profileError = "Student name is required."; render(); return; }
  s.name = name;
  s.initials = initialsFromName(name);
  s.grade = document.querySelector("#edit-student-grade")?.value.trim() || s.grade || "7";
  s.level = document.querySelector("#edit-student-level")?.value || s.level;
  s.proficiency = document.querySelector("#edit-student-proficiency")?.value || s.proficiency;
  s.language = document.querySelector("#edit-student-language")?.value || s.language;
  s.support = document.querySelector("#edit-student-tags")?.value.split(",").map((tag) => tag.trim()).filter(Boolean) || [];
  s.notes = document.querySelector("#edit-student-notes")?.value.trim() || "";
  state.hotListStudents = state.students.filter(isHotList).map((student) => student.id);
  closePanel();
}
function addNotePanel() {
  const s = profileStudentOrError();
  if (!s) return `${panelHeader("Add Note")}<p class="empty">Student not found.</p>`;
  return `${panelHeader("Add Note", `Add an intervention note for ${s.name}.`)}
    <article class="panel-card">${formError()}
      <div class="form-grid resource-form">
        <label><span class="subtle">Date</span><input id="note-date" type="text" value="${today()}"></label>
        <label><span class="subtle">Teacher name</span><input id="note-teacher" type="text" value="Ms. Rivera"></label>
        <label><span class="subtle">Intervention type</span><select id="note-type"><option>Check-in</option><option>Small group</option><option>Vocabulary support</option><option>Family contact</option><option>Hotlist review</option><option>Resource assigned</option></select></label>
      </div>
      <label class="subtle">Note</label><textarea id="note-text" placeholder="What happened and what should happen next?"></textarea>
      <div class="role-actions" style="margin-top:12px"><button class="btn" onclick="saveProfileNote('${s.id}')">Save note</button><button class="btn secondary" onclick="closePanel()">Cancel</button></div>
    </article>`;
}
function editNotePanel() {
  const s = profileStudentOrError();
  const note = s?.profileNotes?.find((item) => item.id === state.selectedNote);
  if (!s || !note) return `${panelHeader("Edit Note")}<p class="empty">Note not found.</p>`;
  return `${panelHeader("Edit Note", `Update timeline entry for ${s.name}.`)}
    <article class="panel-card">${formError()}
      <div class="form-grid resource-form">
        <label><span class="subtle">Date</span><input id="note-date" type="text" value="${esc(note.date)}"></label>
        <label><span class="subtle">Teacher name</span><input id="note-teacher" type="text" value="${esc(note.teacher)}"></label>
        <label><span class="subtle">Intervention type</span><select id="note-type">${["Check-in","Small group","Vocabulary support","Family contact","Hotlist review","Resource assigned","Intake","General note"].map((type) => `<option ${type === note.type ? "selected" : ""}>${type}</option>`).join("")}</select></label>
      </div>
      <label class="subtle">Note</label><textarea id="note-text">${esc(note.note)}</textarea>
      <div class="role-actions" style="margin-top:12px"><button class="btn" onclick="saveProfileNote('${s.id}','${note.id}')">Save note</button><button class="btn secondary" onclick="closePanel()">Cancel</button></div>
    </article>`;
}
function saveProfileNote(studentId, noteId = "") {
  const s = state.students.find((student) => student.id === studentId);
  const text = document.querySelector("#note-text")?.value.trim();
  if (!s || !text) { state.profileError = "A note is required before saving."; render(); return; }
  const nextNote = {
    id: noteId || `n${Date.now()}`,
    date: document.querySelector("#note-date")?.value.trim() || today(),
    teacher: document.querySelector("#note-teacher")?.value.trim() || "Ms. Rivera",
    type: document.querySelector("#note-type")?.value || "Check-in",
    note: text,
  };
  s.profileNotes = s.profileNotes || [];
  const existingIndex = s.profileNotes.findIndex((item) => item.id === noteId);
  if (existingIndex >= 0) s.profileNotes[existingIndex] = nextNote;
  else s.profileNotes.unshift(nextNote);
  s.notes = text;
  closePanel();
}
function deleteProfileNote(studentId, noteId) {
  const s = state.students.find((student) => student.id === studentId);
  if (!s) return;
  s.profileNotes = (s.profileNotes || []).filter((note) => note.id !== noteId);
  s.notes = s.profileNotes[0]?.note || "";
  save();
  render();
}
function editHotlistPanel() {
  const s = profileStudentOrError();
  if (!s) return `${panelHeader("Edit Hotlist Info")}<p class="empty">Student not found.</p>`;
  return `${panelHeader("Edit Hotlist Info", "Set priority and reason for Hotlist placement.")}
    <article class="panel-card">${formError()}
      <label class="toggle-line"><input id="hotlist-active" type="checkbox" ${isHotList(s) ? "checked" : ""}> Currently on Hotlist</label>
      <div class="form-grid resource-form">
        <label><span class="subtle">Priority level</span><select id="hotlist-priority">${["Low","Medium","High","Urgent","Not set"].map((p) => `<option ${p === s.hotlistInfo?.priority ? "selected" : ""}>${p}</option>`).join("")}</select></label>
        <label><span class="subtle">Date added</span><input id="hotlist-date" type="text" value="${esc(s.hotlistInfo?.dateAdded || today())}"></label>
      </div>
      <label class="subtle">Reason for placement</label><textarea id="hotlist-reason">${esc(s.hotlistInfo?.reason || "")}</textarea>
      <div class="role-actions" style="margin-top:12px"><button class="btn" onclick="saveHotlistInfo('${s.id}')">Save hotlist info</button><button class="btn secondary" onclick="closePanel()">Cancel</button></div>
    </article>`;
}
function saveHotlistInfo(studentId) {
  const s = state.students.find((student) => student.id === studentId);
  if (!s) return;
  const active = document.querySelector("#hotlist-active")?.checked;
  const reason = document.querySelector("#hotlist-reason")?.value.trim();
  s.support = active ? Array.from(new Set([...s.support.filter((tag) => !hotListText(tag)), "Hot List"])) : s.support.filter((tag) => !hotListText(tag));
  s.hotlistInfo = {
    priority: active ? document.querySelector("#hotlist-priority")?.value || "Medium" : "Not set",
    dateAdded: active ? document.querySelector("#hotlist-date")?.value.trim() || today() : "",
    reason: active ? reason || "Targeted support toward next proficiency level." : "",
  };
  state.hotListStudents = state.students.filter(isHotList).map((student) => student.id);
  closePanel();
}
function addStudentToHotlist(studentId) {
  const s = state.students.find((student) => student.id === studentId);
  if (!s) return;
  s.support = Array.from(new Set([...s.support.filter((tag) => !hotListText(tag)), "Hot List"]));
  s.hotlistInfo = { ...(s.hotlistInfo || {}), priority: s.hotlistInfo?.priority || "Medium", dateAdded: s.hotlistInfo?.dateAdded || today(), reason: s.hotlistInfo?.reason || "Added from quick actions." };
  state.hotListStudents = state.students.filter(isHotList).map((student) => student.id);
  save();
  render();
}
function removeStudentFromHotlist(studentId) {
  const s = state.students.find((student) => student.id === studentId);
  if (!s) return;
  s.support = s.support.filter((tag) => !hotListText(tag));
  s.hotlistInfo = { ...(s.hotlistInfo || {}), priority: "Not set", dateAdded: "", reason: "" };
  state.hotListStudents = state.students.filter(isHotList).map((student) => student.id);
  save();
  render();
}
function assignResourcePanel() {
  const s = profileStudentOrError();
  if (!s) return `${panelHeader("Assign Resource")}<p class="empty">Student not found.</p>`;
  const assignedIds = new Set((s.assignedResources || []).map((item) => item.resourceId));
  const options = state.resourceList.map((resource) => `<option value="${esc(resource.id)}" ${assignedIds.has(resource.id) ? "disabled" : ""}>${esc(resource.title)}${assignedIds.has(resource.id) ? " (already assigned)" : ""}</option>`).join("");
  return `${panelHeader("Assign Resource", `Choose a resource for ${s.name}.`)}
    <article class="panel-card">${formError()}
      <label><span class="subtle">Resource</span><select id="assign-resource-id">${options}</select></label>
      <div class="role-actions" style="margin-top:12px"><button class="btn" onclick="assignResourceToStudent('${s.id}')">Assign resource</button><button class="btn secondary" onclick="closePanel()">Cancel</button></div>
    </article>`;
}
function assignResourceStudentsPanel() {
  const r = currentResource();
  if (!r) return `${panelHeader("Assign Students")}<p class="empty">Resource not found.</p>`;
  return `${panelHeader("Assign Resource", `Assign ${r.title} to the class, a group, or individual students.`)}
    <article class="panel-card">${formError()}
      <h3>Quick assignment</h3>
      <div class="role-actions" style="margin:8px 0 14px">
        <button class="btn secondary" onclick="assignResourceToClass('${r.id}')">Whole class</button>
        <button class="btn secondary" onclick="assignResourceToGroup('${r.id}','advanced')">Advanced</button>
        <button class="btn secondary" onclick="assignResourceToGroup('${r.id}','typical')">Typical</button>
        <button class="btn secondary" onclick="assignResourceToGroup('${r.id}','struggling')">Struggling</button>
        <button class="btn danger" onclick="unassignResourceFromAll('${r.id}')">Unassign all</button>
      </div>
      <h3>Individual students</h3>
      <div class="panel-stack">${state.students.map((student) => {
        const checked = (student.assignedResources || []).some((assignment) => assignment.resourceId === r.id);
        return `<label class="toggle-line"><input class="assign-student-check" type="checkbox" value="${esc(student.id)}" ${checked ? "checked" : ""}> ${esc(student.name)} <span class="subtle">${esc(student.level)} · ${esc(student.proficiency)}</span></label>`;
      }).join("")}</div>
      <div class="role-actions" style="margin-top:12px"><button class="btn" onclick="saveResourceStudentAssignments('${r.id}')">Save assignments</button><button class="btn secondary" onclick="closePanel()">Cancel</button></div>
    </article>`;
}
function saveResourceStudentAssignments(resourceId) {
  const checkedIds = new Set([...document.querySelectorAll(".assign-student-check:checked")].map((item) => item.value));
  const resource = state.resourceList.find((item) => item.id === resourceId);
  state.students.forEach((student) => {
    student.assignedResources = student.assignedResources || [];
    const hasAssignment = student.assignedResources.some((assignment) => assignment.resourceId === resourceId);
    if (checkedIds.has(student.id) && !hasAssignment) {
      student.assignedResources.unshift({ resourceId, dateAssigned: today() });
      student.profileNotes = student.profileNotes || [];
      student.profileNotes.unshift({ id: `n${Date.now()}-${student.id}`, date: today(), teacher: "Ms. Rivera", type: "Resource assigned", note: `Assigned resource: ${resource?.title || resourceId}.` });
    }
    if (!checkedIds.has(student.id)) {
      student.assignedResources = student.assignedResources.filter((assignment) => assignment.resourceId !== resourceId);
    }
  });
  syncResourceAssignmentMetadata();
  closePanel();
}
function assignResourceToClass(resourceId) {
  assignResourceToStudents(resourceId, state.students.map((student) => student.id), "Assigned to whole class");
}
function assignResourceToGroup(resourceId, group) {
  const groupStudents = state.students.filter((student) => {
    if (group === "advanced") return isAdvancedLearner(student);
    if (group === "struggling") return isStrugglingLearner(student);
    return isTypicalLearner(student);
  });
  const label = group === "advanced" ? "advanced group" : group === "struggling" ? "struggling group" : "typical group";
  assignResourceToStudents(resourceId, groupStudents.map((student) => student.id), `Assigned to ${label}`);
}
function assignResourceToStudents(resourceId, studentIds, noteType = "Resource assigned") {
  const resource = state.resourceList.find((item) => item.id === resourceId);
  const ids = new Set(studentIds);
  state.students.forEach((student) => {
    if (!ids.has(student.id)) return;
    student.assignedResources = student.assignedResources || [];
    if (!student.assignedResources.some((assignment) => assignment.resourceId === resourceId)) {
      student.assignedResources.unshift({ resourceId, dateAssigned: today() });
      student.profileNotes = student.profileNotes || [];
      student.profileNotes.unshift({ id: `n${Date.now()}-${student.id}`, date: today(), teacher: "Ms. Rivera", type: noteType, note: `Assigned resource: ${resource?.title || resourceId}.` });
    }
  });
  syncResourceAssignmentMetadata();
  save();
  render();
}
function unassignResourceFromAll(resourceId) {
  state.students.forEach((student) => {
    student.assignedResources = (student.assignedResources || []).filter((assignment) => assignment.resourceId !== resourceId);
  });
  syncResourceAssignmentMetadata();
  save();
  render();
}
function assignResourceToStudent(studentId) {
  const s = state.students.find((student) => student.id === studentId);
  const resourceId = document.querySelector("#assign-resource-id")?.value;
  if (!s || !resourceId) { state.profileError = "Choose a resource before assigning."; render(); return; }
  s.assignedResources = s.assignedResources || [];
  if (!s.assignedResources.some((item) => item.resourceId === resourceId)) {
    s.assignedResources.unshift({ resourceId, dateAssigned: today() });
    s.profileNotes = s.profileNotes || [];
    const resource = state.resourceList.find((item) => item.id === resourceId);
    s.profileNotes.unshift({ id: `n${Date.now()}`, date: today(), teacher: "Ms. Rivera", type: "Resource assigned", note: `Assigned resource: ${resource?.title || resourceId}.` });
  }
  syncResourceAssignmentMetadata();
  closePanel();
}
function removeAssignedResource(studentId, resourceId) {
  const s = state.students.find((student) => student.id === studentId);
  if (!s) return;
  s.assignedResources = (s.assignedResources || []).filter((item) => item.resourceId !== resourceId);
  syncResourceAssignmentMetadata();
  save();
  render();
}
function deleteStudentPanel() {
  const s = profileStudentOrError();
  if (!s) return `${panelHeader("Delete Student")}<p class="empty">Student not found.</p>`;
  return `${panelHeader("Delete Student", "This removes the student from the local demo roster.")}
    <article class="panel-card"><p class="warning">Delete ${esc(s.name)}? This cannot be undone in the current demo state.</p><div class="role-actions" style="margin-top:12px"><button class="btn danger" onclick="confirmDeleteStudent('${s.id}')">Delete Student</button><button class="btn secondary" onclick="closePanel()">Cancel</button></div></article>`;
}
function confirmDeleteStudent(studentId) {
  state.students = state.students.filter((student) => student.id !== studentId);
  state.hotListStudents = state.students.filter(isHotList).map((student) => student.id);
  state.selectedStudent = state.students[0]?.id || null;
  state.teacherTab = "students";
  state.activePanel = null;
  save();
  render();
}
function moderationPage() {
  const tabs = ["pending", "approved", "hidden"];
  const selected = window.moderationFilter || "pending";
  const filtered = state.dqb.filter(q => q.status === selected);
  return `${pageHead("DQB moderation", "Review student thinking before questions appear on the anonymous class board.", `<span class="pill">${state.dqb.filter(q => q.status === "pending").length} waiting</span>`)}
    <div class="toolbar">${tabs.map(t => `<button class="btn ${selected === t ? "" : "secondary"}" onclick="setModerationFilter('${t}')">${t[0].toUpperCase() + t.slice(1)}</button>`).join("")}</div>
    <article class="card card-pad">${filtered.length ? filtered.map(q => {
      const s = state.students.find(x => x.id === q.studentId);
      return `<div class="moderation-row"><div><div class="student-line">${avatar(s)}<span><strong>${esc(s.name)}</strong><br/><span class="subtle">${esc(q.category)}</span></span></div><p style="margin:10px 0 5px;font-size:14px">${esc(q.question)}</p><span class="quality">${esc(q.quality)}</span></div><div class="role-actions">${selected === "pending" ? `<button class="btn secondary" onclick="moderate('${q.id}','hidden')">Hide</button><button class="btn" onclick="moderate('${q.id}','approved')">Approve</button>` : `<button class="btn secondary" onclick="moderate('${q.id}','pending')">Move to review</button>`}</div></div>`;
    }).join("") : `<div class="empty">No ${selected} questions right now.</div>`}</article>`;
}
function setModerationFilter(filter) { window.moderationFilter = filter; render(); }
function moderate(id, status) { state.dqb.find(q => q.id === id).status = status; save(); render(); }
function analyticsPage() {
  return `${pageHead("Class insights", "A quick read on participation, student thinking, and instructional next steps.")}
    <section class="grid stats">${metric("Lesson completion", "67%", "18 students on track")}${metric("Strong questions", "42%", "+11% since last DQB")}${metric("Support signals", "7", "3 need a check-in")}${metric("English/Spanish usage", `${state.students.filter(s => s.language === "Spanish").length} Spanish`, "toggle enabled")}</section>
    <section class="grid two-col" style="margin-top:14px"><article class="card card-pad"><h3 class="section-title">Progress through Lesson 6</h3>${activities.map((a,i) => `<div class="bar-row"><span>${esc(a.title)}</span>${progress([93,85,74,67,44,28,12][i])}<strong>${[93,85,74,67,44,28,12][i]}%</strong></div>`).join("")}</article>
    <article class="card card-pad"><h3 class="section-title">Misconception detection</h3>${misconceptionSummary().map(([type,count],i) => `<div class="student-line" style="padding:10px 0;border-top:1px solid var(--line)"><span class="number">${count}</span><strong style="font-size:13px">${esc(type)}</strong></div>`).join("")}<div class="divider"></div><h3 class="section-title">Instructional next steps</h3>${["Model one measurable criterion", "Compare stable vs. increasing populations", "Reconnect farm income to design success"].map((x,i) => `<div class="student-line" style="padding:10px 0;border-top:1px solid var(--line)"><span class="number">${i+1}</span><strong style="font-size:13px">${x}</strong></div>`).join("")}</article></section>`;
}
function usagePage() {
  const total = state.students.reduce((n, s) => n + s.allocation, 0);
  const used = state.students.reduce((n, s) => n + Number(s.used || 0), 0);
  const pool = state.students.reduce((n, s) => n + Number(s.monthlyCredits || 0), 0);
  return `${pageHead("Inquiry Credit allocation", "Adjust support in 5% increments from 0% to 100%. Unused support can be pooled for students who need more help.", `<span class="pill">${total}% allocated</span>`)}
    <section class="grid stats">${metric("Class Inquiry Credit pool", pool, "demo monthly pool")}${metric("Used this month", used, `${Math.round((used / pool) * 100)}% of pool`)}${metric("Remaining credits", pool - used, "available for reallocation")}${metric("Recommended shifts", "2", "review before applying")}</section>
    <article class="card card-pad" style="margin-top:14px"><h3 class="section-title">Student allocations</h3>${state.students.map(s => `<div class="allocation"><div class="student-line">${avatar(s)}<span><strong class="student-name">${esc(s.name)}</strong><br/><span class="subtle">${esc(s.level)}</span></span></div><input type="range" min="0" max="100" step="5" value="${s.allocation}" oninput="updateAllocation('${s.id}',this.value)"/><strong>${s.allocation}%</strong><span class="subtle">${s.used} used · ${Math.max(0, Number(s.monthlyCredits || 0) - Number(s.used || 0))} left</span></div>`).join("")}</article>`;
}
function updateAllocation(id, value) { state.students.find(s => s.id === id).allocation = Number(value); save(); render(); }
function resourcesPage() {
  const resources = filteredResources();
  const filterOptions = ["All", "pdf", "image", "website", "youtube", "google", "text"];
  return `${pageHead("Lesson resources", "Search, filter, open, edit, and delete teacher resources.", `<button class="btn" onclick="openPanel('addResource')">Add resource</button>`)}
    <article class="card card-pad">
      <div class="card-action-head"><h3 class="section-title">Teacher Resource Library</h3><button class="btn secondary" onclick="openPanel('resources')">Open manager</button></div>
      <div class="form-grid resource-form" style="margin-bottom:12px">
        <label><span class="subtle">Search resources</span><input id="resource-search" type="text" value="${esc(state.resourceSearch || "")}" placeholder="Search title, tag, subject..."></label>
        <label><span class="subtle">Filter</span><select id="resource-filter" onchange="setResourceFilter(this.value)">${filterOptions.map((option) => `<option value="${esc(option)}" ${option === state.resourceFilter ? "selected" : ""}>${esc(option === "All" ? "All resource types" : option)}</option>`).join("")}</select></label>
      </div>
      <div class="role-actions" style="margin-bottom:12px"><button class="btn secondary" onclick="setResourceSearch(document.querySelector('#resource-search').value)">Search</button><button class="btn ghost" onclick="setResourceSearch('')">Clear</button></div>
      <p class="warning">Only share resources you created, have permission to share, or that are openly licensed.</p>
      ${state.resourceList.length ? resources.length ? resources.map(resourceLibraryRow).join("") : `<div class="empty">No resources match this search or filter.</div>` : `<div class="empty">No resources exist yet. Add a resource to start the library.</div>`}
    </article>`;
}
function addResource() {
  openPanel("addResource");
}

function studentShell() {
  const s = student();
  const pages = { board: studentBoard, resources: studentResourcesPage, resourceViewer: studentResourceViewerPage, lesson: studentLesson };
  return `<div class="student-shell">${topbar(`${s.name} · Period 2`)}<div class="student-layout">${studentSidebar()}<main class="student-main">${(pages[state.studentTab] || studentLesson)()}</main></div></div>`;
}
function studentSidebar() {
  const lessonActivities = activeLessonActivities();
  return `<aside class="sidebar"><p class="sidebar-label">Lesson progress</p><ul class="steps">${lessonActivities.map((a,i) => `<li class="step ${i === state.studentActivityIndex ? "active" : ""} ${i < state.studentActivityIndex ? "done" : ""}"><span class="number">${i < state.studentActivityIndex ? "✓" : i+1}</span><span>${esc(a.title)}</span></li>`).join("")}</ul><div class="toolbar" style="margin:14px 0"><button class="btn secondary" onclick="studentTab('lesson')">Lesson</button><button class="btn secondary" onclick="studentTab('resources')">My Resources</button><button class="btn secondary" onclick="studentTab('board')">Class DQB</button></div><div class="sidebar-note">Use AI for a quick nudge, then bring your thinking back to your group.</div></aside>`;
}
function studentLesson() {
  const lessonActivities = activeLessonActivities();
  const s = student(), a = lessonActivities[state.studentActivityIndex] || lessonActivities[0], response = state.responses[s.id]?.[a.id] || "";
  const isDqb = a.id === "dqb";
  return `${pageHead(`${esc(launchedLesson()?.title || "Lesson")} · Step ${state.studentActivityIndex + 1}`, `${a.eyebrow} · Step ${a.slide} · ${a.minutes} min`, `<span class="pill">${esc(state.lessonSetup.sessionLimit)} · ${state.lessonSetup.promptLimit} prompts</span><button class="btn secondary" onclick="studentTab('resources')">My Resources</button><button class="btn secondary" onclick="studentTab('board')">${icons.message} Class DQB</button>`)}
    <section class="student-grid"><article class="card activity-card"><span class="eyebrow" style="margin-left:0">${esc(a.eyebrow)}</span><h1>${esc(a.title)}</h1><p class="subtle">${esc(a.hint)}</p>${a.context ? `<div class="context">${esc(a.context)}</div>` : ""}<div class="prompt">${esc(a.prompt)}</div>
    ${isDqb ? `<label class="subtle">Question category</label><br/><select id="category">${categories.map(c => `<option>${esc(c)}</option>`).join("")}</select><br/><br/>` : ""}
    <textarea id="activity-response" placeholder="${esc(a.placeholder)}">${esc(response)}</textarea>
    ${a.id === "questions" || a.id === "dqb" ? `<div class="row" style="margin-top:9px"><button class="btn secondary" onclick="improveCurrentQuestion()">Improve my question</button><span class="subtle">AI will suggest a more investigable version.</span></div>` : ""}
    <div class="step-actions"><button class="btn secondary" ${state.studentActivityIndex === 0 ? "disabled" : ""} onclick="moveActivity(-1)">Back</button><button class="btn" onclick="${isDqb ? "submitDqb()" : "saveAndNext()"}">${isDqb ? "Submit for teacher review" : state.studentActivityIndex === lessonActivities.length - 1 ? "Finish lesson" : "Save and continue"}</button></div></article>${aiPanel(a, s)}</section>`;
}
function aiPanel(a, s) {
  const chats = state.chats[s.id] || [];
  const lesson = launchedLesson();
  const supportLevel = lesson?.aiGuidance?.supportLevel ?? state.lessonSetup.aiSupportLevel ?? s.aiSupportLevel ?? 15;
  return `<aside class="card ai-card"><div class="ai-head"><strong>Scaffolding Engine</strong><span>${esc(providerLabelFor(lesson?.aiGuidance?.provider || "demo"))} · ${Number(supportLevel)}% support · no direct answers</span></div><div class="chat">${chats.map(m => `<div class="bubble ${m.role === "user" ? "user" : ""}">${esc(m.text)}${m.meta ? `<br/><small>${esc(m.meta)}</small>` : ""}</div>`).join("")}</div><form class="chat-form" onsubmit="sendChat(event,'${a.id}')"><input id="chat-input" type="text" placeholder="Ask for a hint..."/><button class="icon-btn" title="Send message">${icons.arrow}</button></form></aside>`;
}
function sendChat(event, activityId) {
  event.preventDefault();
  const input = document.querySelector("#chat-input");
  const text = input.value.trim();
  if (!text) return;
  const s = student(), chats = state.chats[s.id] ||= [];
  chats.push({ role: "user", text });
  const activity = activities.find((item) => item.id === activityId) || activities[0];
  const existingPromptCount = chats.filter((msg) => msg.role === "user").length;
  const lesson = launchedLesson();
  const lessonSetup = {
    ...state.lessonSetup,
    lessonTitle: lesson?.title || state.lessonSetup.lessonTitle,
    aiSupportLevel: lesson?.aiGuidance?.supportLevel ?? state.lessonSetup.aiSupportLevel,
    aiProvider: lesson?.aiGuidance?.provider || state.lessonSetup.aiProvider || "demo",
    aiCustomInstructions: lesson?.aiGuidance?.customInstructions || state.lessonSetup.aiCustomInstructions || state.aiSettings.customInstructions,
  };
  const aiStudent = { ...s, aiSupportLevel: lessonSetup.aiSupportLevel ?? s.aiSupportLevel };
  const result = aiProvider?.scaffold
    ? aiProvider.scaffold({ message: text, activity, student: aiStudent, lessonSetup, existingPromptCount })
    : window.AIScaffoldingEngine.run({ message: text, activity, student: s, lessonSetup: state.lessonSetup, existingPromptCount });
  const tagText = result.misconceptionTag || result.flags?.[0] || result.ruleAction;
  const matrixLevel = result.questionMatrixLevel || questionMatrixLevelForSupport(result.supportLevel || s.aiSupportLevel || 50);
  const stem = result.questionStem || questionStemForSupport(result.supportLevel || s.aiSupportLevel || 50);
  chats.push({ role: "assistant", text: result.finalResponse, meta: `${result.supportLevel || s.aiSupportLevel || 50}% support · ${matrixLevel} Questions · Stem: ${stem} · ${tagText}` });
  const timestamp = new Date().toLocaleString();
  s.latestAIInteraction = {
    activityId,
    activityTitle: activity.title,
    response: text,
    scaffold: result.finalResponse,
    misconceptionTag: result.misconceptionTag || result.flags?.[0] || "Needs Evidence",
    progressStatus: result.progressStatus || "Needs evidence",
    supportLevel: result.supportLevel || s.aiSupportLevel || 50,
    questionMatrixLevel: matrixLevel,
    questionStem: stem,
    scores: result.scores || {},
    provider: result.providerFallback || providerLabelFor(lessonSetup.aiProvider),
    createdAt: timestamp,
  };
  s.inquiryHistory = s.inquiryHistory || [];
  s.inquiryHistory.unshift({
    id: `iq-${Date.now()}-${s.id}`,
    originalQuestion: activity.prompt || lessonSetup.lessonTitle,
    studentResponse: text,
    aiFollowUp: result.finalResponse,
    revisedResponse: "",
    timestamp,
  });
  s.aiHistory = s.aiHistory || [];
  s.aiHistory.unshift({ date: today(), type: "Inquiry coach", summary: `${text} → ${result.finalResponse}` });
  state.aiPromptLog = state.aiPromptLog || [];
  state.aiPromptLog.unshift({
    id: `log-${Date.now()}-${s.id}`,
    studentId: s.id,
    studentName: s.name,
    lessonId: lesson?.id || "",
    lessonTitle: lesson?.title || state.lessonSetup.lessonTitle,
    provider: result.providerFallback || providerLabelFor(lessonSetup.aiProvider),
    supportLevel: result.supportLevel || lessonSetup.aiSupportLevel || s.aiSupportLevel || 15,
    studentResponse: text,
    aiResponse: result.finalResponse,
    misconceptionTag: result.misconceptionTag || "Needs Evidence",
    progressStatus: result.progressStatus || "Developing",
    scores: result.scores || {},
    timestamp,
  });
  s.used = Number(s.used || 0) + result.creditsUsed;
  (result.flags || []).forEach((type) => state.misconceptionLog.push({ id: `m${Date.now()}-${Math.random()}`, studentId: s.id, type, activityId, createdAt: new Date().toLocaleTimeString() }));
  save(); render();
}
function persistCurrentResponse() {
  const area = document.querySelector("#activity-response");
  if (!area) return;
  const s = student(), a = activeLessonActivities()[state.studentActivityIndex];
  state.responses[s.id] ||= {};
  state.responses[s.id][a.id] = area.value.trim();
}
function saveAndNext() { persistCurrentResponse(); if (state.studentActivityIndex < activeLessonActivities().length - 1) state.studentActivityIndex++; save(); render(); }
function moveActivity(delta) { persistCurrentResponse(); state.studentActivityIndex = Math.max(0, Math.min(activeLessonActivities().length - 1, state.studentActivityIndex + delta)); save(); render(); }
function improveCurrentQuestion() {
  const area = document.querySelector("#activity-response");
  area.value = window.InquiryAI.improveQuestion(area.value);
}
function submitDqb() {
  persistCurrentResponse();
  const s = student(), a = activeLessonActivities()[state.studentActivityIndex], question = state.responses[s.id][a.id];
  if (!question) return;
  state.dqb.push({ id: `q${Date.now()}`, studentId: s.id, category: document.querySelector("#category").value, question, status: "pending", quality: "Ready to review" });
  if (state.studentActivityIndex < activeLessonActivities().length - 1) state.studentActivityIndex++;
  save(); render();
}
function studentBoard() {
  const approved = state.dqb.filter(q => q.status === "approved");
  return `${pageHead("Class Driving Question Board", "Explore anonymous, teacher-approved questions from your classmates.", `<button class="btn secondary" onclick="studentTab('lesson')">Back to lesson</button>`)}
    <section class="dqb-board">${approved.map(q => `<article class="card question-card"><p>${esc(q.question)}</p><span>${esc(q.category)} · Anonymous classmate</span></article>`).join("")}</section>`;
}
function studentResourcesPage() {
  const s = student();
  const resources = studentVisibleResourceDetails(s);
  return `${pageHead("My Resources", "Open assigned and teacher-shared materials for this lesson.", `<button class="btn secondary" onclick="studentTab('lesson')">Back to lesson</button>`)}
    <article class="card card-pad">${resources.length ? resources.map(({ item, assignedOn, access }) => `<div class="resource-row click-row" role="button" tabindex="0" onclick="openStudentResourceViewer('${item.id}')" onkeydown="studentResourceKey(event,'${item.id}')"><div class="student-line"><span class="resource-icon">${esc(resourceDisplayType(item).slice(0,2).toUpperCase())}</span><span><strong class="student-name">${esc(item.title)}</strong><br/><span class="subtle">${esc(resourceDisplayType(item))} · ${esc(access)} ${esc(assignedOn || "today")}</span><br/><span class="quality">${resourceTags(item)}</span></span></div><button class="btn secondary" onclick="event.stopPropagation(); openStudentResourceViewer('${item.id}')">Open Resource</button></div>`).join("") : `<div class="empty">No resources assigned yet.</div>`}</article>`;
}
function studentResourceKey(event, resourceId) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openStudentResourceViewer(resourceId);
  }
}
function studentResourceViewerPage() {
  const r = currentResource();
  if (!r) return `${pageHead("Resource", "No resource selected.", `<button class="btn secondary" onclick="studentTab('resources')">Back to resources</button>`)}<article class="card card-pad empty">Resource not found.</article>`;
  return `${pageHead("Resource", "Teacher-assigned resource viewer.", `<button class="btn secondary" onclick="studentTab('resources')">Back to resources</button>${r.url ? `<button class="btn" onclick="openResourceExternally('${r.id}')">Open Resource</button>` : ""}`)}
    <section class="grid two-col resource-view-layout"><article class="card card-pad"><div class="student-line"><span class="resource-icon">${esc(r.type.slice(0,2).toUpperCase())}</span><span><h1>${esc(r.title)}</h1><span class="subtle">${esc(r.category)} · Grade ${esc(r.gradeLevel)}</span></span></div><div class="detail-grid"><span>Description</span><strong>${esc(r.description || "No description added.")}</strong><span>Type</span><strong>${esc(r.type)}</strong><span>Tags</span><strong>${resourceTags(r)}</strong></div></article><article class="card card-pad"><h3 class="section-title">Resource Viewer</h3>${resourcePreview(r)}</article></section>`;
}
function studentTab(tab) { state.studentTab = tab; save(); render(); }

const edumemoryDemo = {
  student: {
    name: "Maya Rodriguez",
    initials: "MR",
    grade: "7th Grade Engineering Student",
    focus: "Engineering design, robotics, and TSA preparation",
    reflection: "My first tower was tall but it bent when the fan turned on. I changed the base to a triangle, shortened the top section, and used cross braces. The second version held more weight because I thought about wind and material limits before rebuilding.",
  },
  analysis: "Maya shows growth in engineering design. She identified constraints, tested a prototype, diagnosed failure, and improved the structure through iteration. Recommended evidence summary: Engineering Design Level 1.",
  walrusMemory: {
    id: "walrus-memory-maya-tower-v2",
    uri: "walrus://maya-rodriguez/engineering-tower-v2",
    type: "learning_evidence_bundle",
    owner: "Maya Rodriguez",
    evidence: ["engineering reflection", "tower prototype notes", "iteration photo", "teacher rubric"],
    skillTags: ["constraints", "iteration", "prototype testing", "reflection"],
  },
  suiCredential: {
    id: "sui-credential-engineering-design-level-1",
    uri: "sui://credential/engineering-design-level-1/maya-rodriguez",
    achievement: "Engineering Design Level 1",
    owner: "Maya Rodriguez",
    issuer: "Ms. Chen",
    status: "teacher_verified",
    evidenceHash: "0xEDU-MAYA-TOWER-V2",
  },
  opportunities: [
    ["NASA STEM Fellowship", 92, "Strong fit for engineering reflection, prototype testing, and sustained STEM interest."],
    ["Engineering Summer Academy", 87, "Good fit for design challenge experience and readiness for structured engineering coursework."],
    ["Robotics Leadership Scholarship", 95, "Excellent fit for robotics evidence, reflection quality, and team-based problem solving."],
  ],
};

function edumemoryShell() {
  return `<div class="app edumemory-app">${topbar("Sui Overflow 2026 · EduMemory")}
    <div class="edumemory-layout">${edumemoryNav()}<main class="content">${edumemoryPage()}</main></div>
  </div>`;
}
function edumemoryNav() {
  const selected = state.edumemoryView || "student";
  const items = [
    ["student", icons.leaf, "Student"],
    ["teacher", icons.users, "Teacher"],
    ["portfolio", icons.folder, "Portfolio"],
    ["opportunities", icons.chart, "Opportunities"],
  ];
  return `<aside class="sidebar edumemory-sidebar"><p class="sidebar-label">EduMemory Demo</p>${items.map(([id, icon, label]) => `<button class="nav-btn ${selected === id ? "active" : ""}" onclick="edumemoryTab('${id}')">${icon}<span>${label}</span></button>`).join("")}
    <div class="sidebar-note"><strong>Mock-first Sui + Walrus</strong><br/>Credential ownership and long-term learning memory are represented with realistic demo records.</div></aside>`;
}
function edumemoryPage() {
  const pages = {
    student: edumemoryStudentPage,
    teacher: edumemoryTeacherPage,
    portfolio: edumemoryPortfolioPage,
    opportunities: edumemoryOpportunitiesPage,
  };
  return (pages[state.edumemoryView || "student"] || edumemoryStudentPage)();
}
function edumemoryHeroActions() {
  return `<button class="btn sun" onclick="edumemoryTab('student')">Start demo</button><button class="btn secondary" onclick="setRole('teacher')">Back to classroom app</button>`;
}
function edumemoryStudentPage() {
  const memoryReady = state.edumemoryMemoryCreated;
  const analysisReady = state.edumemoryAnalysisVisible || memoryReady;
  return `${pageHead("EduMemory Demo Mode", "A lifelong AI-powered learning passport and opportunity network.", edumemoryHeroActions())}
    <section class="edumemory-hero card">
      <div class="edumemory-hero-copy">
        <span class="pill"><span class="dot"></span> Maya Rodriguez · 7th Grade Engineering</span>
        <h2>Preserve verified learning before students forget what they built.</h2>
        <p>EduMemory observes classroom evidence, recommends achievements, routes them to teachers, creates mock Sui credentials, and updates a student-owned opportunity portfolio.</p>
      </div>
      <div class="tower-sketch" role="img" aria-label="Wind-resistant engineering tower prototype"></div>
    </section>
    <section class="grid two-col">
      <article class="card card-pad">
        <div class="student-line"><span class="avatar">${edumemoryDemo.student.initials}</span><span><h3>${esc(edumemoryDemo.student.name)}</h3><span class="subtle">${esc(edumemoryDemo.student.grade)}</span></span></div>
        <div class="tags-block"><span class="tag">Engineering Design</span><span class="tag">Robotics</span><span class="tag hot">TSA Prep</span></div>
        <p class="recommendation">${esc(edumemoryDemo.student.reflection)}</p>
        <div class="role-actions"><button class="btn" onclick="edumemoryAnalyze()">Analyze Growth</button><button class="btn secondary" onclick="edumemoryMemory()">Create Learning Memory</button></div>
      </article>
      <article class="card card-pad">
        <h3 class="section-title">EduMemory Agent Role</h3>
        <div class="mini-grid"><div><span class="subtle">Observe</span><strong>Conversations, reflections, artifacts</strong></div><div><span class="subtle">Analyze</span><strong>Skills, misconceptions, mastery</strong></div><div><span class="subtle">Act</span><strong>Recommend next steps</strong></div><div><span class="subtle">Preserve</span><strong>Verified learning evidence</strong></div></div>
      </article>
    </section>
    ${analysisReady ? `<section class="card card-pad edumemory-signal"><h3>AI Growth Analysis</h3><p>${esc(edumemoryDemo.analysis)}</p><div class="grid three-col panel-stats"><div class="metric"><span class="metric-label">Evidence signals</span><strong>4</strong><div class="metric-foot">Constraints, iteration, testing, reflection</div></div><div class="metric"><span class="metric-label">Recommendation</span><strong>Strong</strong><div class="metric-foot">Teacher review needed</div></div><div class="metric"><span class="metric-label">Credential target</span><strong>Level 1</strong><div class="metric-foot">Engineering Design</div></div></div></section>` : ""}
    ${memoryReady ? `<section class="card card-pad edumemory-signal"><h3>Mock Walrus Memory Object</h3>${edumemoryObjectCard(edumemoryDemo.walrusMemory)}<div class="tags-block">${edumemoryDemo.walrusMemory.skillTags.map((item) => `<span class="tag">${esc(item)}</span>`).join("")}</div></section>` : ""}`;
}
function edumemoryTeacherPage() {
  const reviewed = state.edumemoryEvidenceReviewed;
  const approved = state.edumemoryCredentialApproved;
  return `${pageHead("Teacher Verification", "The teacher verifies AI-recommended achievements before credentials are created.", `<button class="btn secondary" onclick="edumemoryTab('student')">Student evidence</button><button class="btn" onclick="edumemoryApproveCredential()">Approve Engineering Design Level 1</button>`)}
    <section class="grid three-col">
      <article class="card metric"><span class="metric-label">Pending recommendation</span><strong>1</strong><div class="metric-foot">Engineering Design Level 1</div></article>
      <article class="card metric"><span class="metric-label">Evidence quality</span><strong>Strong</strong><div class="metric-foot">Ready for teacher review</div></article>
      <article class="card metric"><span class="metric-label">Credential status</span><strong>${approved ? "Approved" : "Pending"}</strong><div class="metric-foot">Mock Sui record</div></article>
    </section>
    <section class="card card-pad">
      <div class="card-action-head"><div><h3>Achievement Recommendation</h3><p class="subtle">Maya Rodriguez · Engineering Design Level 1</p></div><button class="btn secondary" onclick="edumemoryReviewEvidence()">Review Evidence</button></div>
      <p class="recommendation">${esc(edumemoryDemo.analysis)}</p>
    </section>
    ${reviewed ? `<section class="card card-pad"><h3>Evidence Review</h3><div class="timeline"><div class="timeline-item"><strong>Reflection</strong><p>${esc(edumemoryDemo.student.reflection)}</p></div><div class="timeline-item"><strong>AI analysis</strong><p>Improved use of constraints, iteration, and prototype testing.</p></div><div class="timeline-item"><strong>Artifact</strong><p>Engineering notebook image and tower version notes stored as mock Walrus learning evidence.</p></div></div></section>` : ""}
    <section class="card card-pad ${approved ? "edumemory-approved" : ""}"><h3>Mock Sui Credential Object</h3>${approved ? edumemoryObjectCard(edumemoryDemo.suiCredential) : `<p>Waiting for teacher approval.</p>`}</section>`;
}
function edumemoryPortfolioPage() {
  const approved = state.edumemoryCredentialApproved;
  return `${pageHead("Maya's Portfolio", "Verified achievements, STEM artifacts, and evidence history.", `<button class="btn secondary" onclick="edumemoryTab('teacher')">Teacher approval</button><button class="btn" onclick="edumemoryTab('opportunities')">Match opportunities</button>`)}
    <section class="grid three-col">
      <article class="card card-pad ${approved ? "edumemory-approved" : ""}"><h3>Engineering Design Level 1</h3><p class="subtle">${approved ? "Verified by Ms. Chen; mock Sui credential created" : "Pending teacher verification"}</p></article>
      <article class="card card-pad"><h3>Robotics Examples</h3><p>Drive train prototype notes, team debugging reflection, and sensor calibration checklist.</p></article>
      <article class="card card-pad"><h3>TSA Examples</h3><p>Prepared design brief, competition planning artifact, and presentation practice feedback.</p></article>
    </section>
    <section class="card card-pad"><h3>Evidence History</h3><div class="timeline"><div class="timeline-item"><strong>May 2026</strong><p>Wind-resistant tower challenge reflection and prototype evidence.</p></div><div class="timeline-item"><strong>Apr 2026</strong><p>Robotics sensor troubleshooting reflection.</p></div><div class="timeline-item"><strong>Mar 2026</strong><p>TSA engineering design notebook checkpoint.</p></div></div></section>`;
}
function edumemoryOpportunitiesPage() {
  return `${pageHead("Opportunity Matching", "Matches generated from Maya's verified and emerging STEM evidence.", `<button class="btn secondary" onclick="edumemoryTab('portfolio')">Portfolio</button>`)}
    <section class="edumemory-match-list">${edumemoryDemo.opportunities.map(([title, score, description]) => `<article class="card card-pad edumemory-match"><div><h3>${esc(title)}</h3><p>${esc(description)}</p></div><div class="match-score">${score}%</div></article>`).join("")}</section>`;
}
function edumemoryObjectCard(record) {
  return `<pre class="edumemory-object">${esc(JSON.stringify(record, null, 2))}</pre>`;
}
function edumemoryTab(tab) { state.edumemoryView = tab; save(); render(); }
function edumemoryAnalyze() { state.edumemoryAnalysisVisible = true; save(); render(); }
function edumemoryMemory() { state.edumemoryAnalysisVisible = true; state.edumemoryMemoryCreated = true; save(); render(); }
function edumemoryReviewEvidence() { state.edumemoryEvidenceReviewed = true; save(); render(); }
function edumemoryApproveCredential() { state.edumemoryEvidenceReviewed = true; state.edumemoryCredentialApproved = true; save(); render(); }

function render() {
  app.innerHTML = !state.activeRole ? rolePage() + activePanelMarkup() : state.activeRole === "teacher" ? teacherShell() : state.activeRole === "edumemory" ? edumemoryShell() : studentShell();
}
async function hydrateSupabaseReadOnly() {
  if (providerMode !== "supabase") return;
  state.supabaseStatus = "loading";
  try {
    const [resources, students, classes, hotlistItems] = await Promise.all([
      resourceProvider.listResources(),
      resourceProvider.listStudents(),
      resourceProvider.listClasses(),
      resourceProvider.listHotlistItems(),
    ]);
    if (Array.isArray(resources) && resources.length) {
      state.resourceList = resources;
      state.resources = resources;
      state.selectedResource = state.selectedResource && resources.some((resource) => resource.id === state.selectedResource)
        ? state.selectedResource
        : resources[0]?.id || null;
    }
    if (Array.isArray(students) && students.length) {
      const classLabel = classes?.[0]?.period || classes?.[0]?.name || "Supabase class";
      state.students = students.map((student) => ({
        ...student,
        className: student.className === "Supabase class" ? classLabel : student.className,
        inquiryHistory: student.inquiryHistory || sampleInquiryHistory(student),
      }));
      applySupabaseHotlistItems(hotlistItems || []);
      state.selectedStudent = state.selectedStudent && state.students.some((student) => student.id === state.selectedStudent)
        ? state.selectedStudent
        : state.students[0]?.id || null;
      state.activeStudentId = state.students[0]?.id || state.activeStudentId;
    }
    state.classes = Array.isArray(classes) ? classes : [];
    state.hotListStudents = state.students.filter(isHotList).map((student) => student.id);
    syncResourceAssignmentMetadata(state);
    state.supabaseStatus = "ready";
    save();
  } catch (error) {
    console.warn("Supabase read-only hydration failed. Local demo data remains active.", error);
    state.supabaseStatus = "error";
    state.supabaseError = error.message || String(error);
  }
}
function applySupabaseHotlistItems(items = []) {
  items.forEach((item) => {
    const student = state.students.find((entry) => entry.id === item.student_id);
    if (!student) return;
    if (!student.support.includes("Hot List")) student.support = [...student.support, "Hot List"];
    student.hotListMove = item.target_level || student.hotListMove || "";
    student.hotlistInfo = {
      ...(student.hotlistInfo || {}),
      priority: item.priority || "Medium",
      dateAdded: item.created_at ? item.created_at.slice(0, 10) : student.dateAdded,
      reason: item.reason || student.notes,
      supportNotes: item.support_notes || "",
      inquiryCreditPercent: item.inquiry_credit_percent ?? student.allocation,
    };
    student.allocation = Number(item.inquiry_credit_percent ?? student.allocation ?? 85);
  });
}
Object.assign(window, {
  ResourceStorage,
  addPanelResource,
  addPanelStudent,
  addLessonStep,
  addResource,
  addStudentToHotlist,
  assignResourceToClass,
  assignResourceToGroup,
  assignResourceToStudent,
  archiveInquiryLesson,
  closePanel,
  confirmDeleteResource,
  confirmDeleteStudent,
  confirmRestartDemo,
  createInquiryLesson,
  copyMakeathonDemoScript,
  cycleAIComparisonIdea,
  deleteProfileNote,
  duplicateInquiryLesson,
  duplicateLessonStep,
  edumemoryAnalyze,
  edumemoryApproveCredential,
  edumemoryMemory,
  edumemoryReviewEvidence,
  edumemoryTab,
  improveCurrentQuestion,
  launchInquiryLesson,
  moderate,
  moveActivity,
  moveLessonStep,
  openPanel,
  openResourceExternally,
  openResourceUrl,
  openResourceViewer,
  openStudentProfile,
  openStudentResourceViewer,
  panelKey,
  previewScaffoldForStudent,
  previewLesson,
  refreshLessonBuilderPreview,
  removeLessonStep,
  removeResourceFromLesson,
  removeAssignedResource,
  removeStudentFromHotlist,
  requestRestartDemo,
  resourceKey,
  runAIComparisonDemo,
  saveAndNext,
  saveHotlistInfo,
  saveProfileNote,
  saveResourceEdits,
  saveResourceStudentAssignments,
  saveStudentEdits,
  sendChat,
  selectInquiryLesson,
  setModerationFilter,
  setResourceFilter,
  setResourceSearch,
  setRole,
  setStudentFilter,
  studentKey,
  studentResourceKey,
  studentTab,
  submitDqb,
  syncLessonBuilderToSetup,
  teacherTab,
  toggleHotList,
  unassignResourceFromAll,
  updateAISupportLevel,
  updateAllocation,
  updateInquiryLesson,
  updateLessonStep,
  updateLessonBuilder,
  updateSetup,
  updateStudent,
});
render();
hydrateSupabaseReadOnly().then(render);
