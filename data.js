window.InquiryData = (() => {
  const problemSummary =
    "Oil palm is a plant that provides a key ingredient for foods and cosmetics. Oil palm uses less land to grow compared to other crops, but it grows in the same places as tropical rainforests. Oil palm is a cash crop that provides farmers in Indonesia with a steady income to support their families. When farmers clear land to plant oil palm, they sometimes cut down tropical rainforests. This is related to decreases in orangutan and tiger populations.";

  const activities = [
    {
      id: "navigation",
      slide: "A",
      minutes: 3,
      eyebrow: "Turn and talk",
      title: "Connect to the problem",
      prompt: "What is one new thing we have learned about this problem, and how did it make the problem more complicated to solve?",
      hint: "Think about the needs of people and the needs of organisms living in the rainforest.",
      placeholder: "One thing we learned is...",
    },
    {
      id: "define",
      slide: "B",
      minutes: 10,
      eyebrow: "With a partner",
      title: "Define the problem",
      prompt: "What have we figured out about this problem so far?",
      hint: "Use evidence from earlier lessons. Why is palm oil useful, and what happens when the land changes?",
      placeholder: "We figured out that...",
    },
    {
      id: "goal",
      slide: "C",
      minutes: 6,
      eyebrow: "Build a better palm farm",
      title: "Set a design goal",
      prompt: "What goal can we set for living things in the ecosystem and for farmers?",
      hint: "A strong goal should work for both rainforest organisms and farmers.",
      placeholder: "Our goal is to design a palm farm that...",
      context: problemSummary,
    },
    {
      id: "criteria",
      slide: "D",
      minutes: 6,
      eyebrow: "Build a better palm farm",
      title: "Identify criteria and constraints",
      prompt: "What will we measure to decide if the design is successful? What limits must the design follow?",
      hint: "Criteria are signs of success. Constraints are the limits your design must work within.",
      placeholder: "Criteria: ...\nConstraints: ...",
    },
    {
      id: "questions",
      slide: "E",
      minutes: 7,
      eyebrow: "On your own",
      title: "Write a stronger question",
      prompt: "What do we need to investigate in order to design a system that is more stable?",
      hint: "Choose something we could investigate using evidence, measurements, or patterns.",
      placeholder: "How does...",
    },
    {
      id: "dqb",
      slide: "F",
      minutes: 6,
      eyebrow: "Driving Question Board",
      title: "Share with the class",
      prompt: "Choose a category and submit your question to the class Driving Question Board.",
      hint: "Your name stays private. Your teacher will review your question before classmates see it.",
      placeholder: "Paste or revise your investigation question...",
    },
    {
      id: "next",
      slide: "G",
      minutes: 3,
      eyebrow: "Next steps",
      title: "Decide what to investigate next",
      prompt: "What should we investigate next to understand what constitutes a good number of orangutans to support in our new palm farms?",
      hint: "Consider population data, habitat size, food availability, and evidence.",
      placeholder: "Next, we should investigate...",
    },
  ];

  const resources = [
    { id: "r1", title: "Lesson 6 Slides", type: "PPTX", meta: "Slides A-G", audience: "Class", url: "", shareability: "Copyright restricted / do not share", source: "OpenSciEd lesson material" },
    { id: "r2", title: "Lesson 6 Teacher Edition", type: "DOCX", meta: "Teacher reference", audience: "Teacher", url: "", shareability: "Private", source: "Teacher-created notes may be added" },
    { id: "r3", title: "Student Procedure", type: "DOCX", meta: "English", audience: "Student", url: "", shareability: "Share with school", source: "Classroom handout" },
    { id: "r4", title: "Palm Farm Designs", type: "DOCX", meta: "English", audience: "Student", url: "", shareability: "Share with school", source: "Classroom handout" },
    { id: "r5", title: "Procedimiento del estudiante", type: "DOCX", meta: "Spanish", audience: "Student", url: "", shareability: "Share with school", source: "Translated classroom handout" },
    { id: "r6", title: "Diseños de finca de palmeras", type: "DOCX", meta: "Spanish", audience: "Student", url: "", shareability: "Share with school", source: "Translated classroom handout" },
    { id: "r7", title: "Demo PDF Viewer Sample", type: "PDF", meta: "PDF preview", audience: "Teacher", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", shareability: "Public/open resource", source: "Public sample PDF", description: "A small public PDF used to verify the in-app PDF viewer.", tags: ["demo", "pdf"], textContent: "" },
    { id: "r8", title: "Rainforest Food Web Image", type: "Image", meta: "Image preview", audience: "Class", url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='520' viewBox='0 0 900 520'%3E%3Crect width='900' height='520' fill='%23dceef3'/%3E%3Crect y='310' width='900' height='210' fill='%23dceecb'/%3E%3Ccircle cx='145' cy='130' r='62' fill='%23f3c45f'/%3E%3Cpath d='M110 400 L170 220 L230 400 Z M310 410 L380 175 L450 410 Z M535 405 L600 225 L665 405 Z' fill='%23184d43'/%3E%3Ctext x='450' y='470' text-anchor='middle' font-family='Arial' font-size='32' fill='%23172522'%3ERainforest ecosystem image resource%3C/text%3E%3C/svg%3E", shareability: "Teacher-created", source: "Demo-generated image", description: "A simple image preview resource for the viewer.", tags: ["image", "ecosystem"] },
    { id: "r9", title: "OpenSciEd Website", type: "Website URL", meta: "External website", audience: "Teacher", url: "https://www.openscied.org/", shareability: "Public/open resource", source: "OpenSciEd website", description: "External website resource that opens safely in a new tab.", tags: ["website", "curriculum"] },
    { id: "r10", title: "Palm Oil Explainer Video", type: "YouTube URL", meta: "Embedded video", audience: "Class", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", shareability: "Public/open resource", source: "YouTube demo link", description: "YouTube resource used to verify embedded video playback.", tags: ["video", "demo"] },
    { id: "r11", title: "Google Doc Planning Template", type: "Google Docs URL", meta: "Google Doc", audience: "Teacher", url: "https://docs.google.com/document/d/1", shareability: "Private", source: "Demo Google Docs placeholder", description: "Google Docs resources open in a new tab so permissions remain with Google.", tags: ["google doc", "planning"] },
    { id: "r12", title: "Plain Text Scaffold", type: "Plain text", meta: "Text resource", audience: "Student", url: "", shareability: "Teacher-created", source: "Teacher-created", description: "A plain text resource rendered directly inside the app.", tags: ["text", "scaffold"], textContent: "Use this scaffold: A successful palm farm design should support farmers by ___ and support orangutans by ___. One constraint is ___. One criterion is ___." },
  ];

  const students = [
    { id: "s1", name: "Avery J.", initials: "AJ", grade: "7", className: "Period 2", language: "English", level: "On level", proficiency: "Apprentice", support: ["Hot List"], hotListMove: "Apprentice close to Proficient", allocation: 85, aiSupportLevel: 50, learnerDemoType: "Typical Learner", monthlyCredits: 120, used: 18, progress: 71, reading: "Grade 7", math: "Grade 7", interest: "robotics", notes: "Ready to move up with evidence-based explanations." },
    { id: "s2", name: "Camila R.", initials: "CR", grade: "7", className: "Period 2", language: "Spanish", level: "On level", proficiency: "Apprentice", support: ["English Learner"], hotListMove: "", allocation: 75, aiSupportLevel: 50, learnerDemoType: "Typical Learner", monthlyCredits: 105, used: 12, progress: 57, reading: "Grade 7", math: "Grade 7", interest: "art", notes: "Benefits from bilingual vocabulary checks." },
    { id: "s3", name: "Eli M.", initials: "EM", grade: "7", className: "Period 2", language: "English", level: "Intervention", proficiency: "Novice", support: ["IEP/504", "Intervention"], hotListMove: "", allocation: 100, aiSupportLevel: 85, learnerDemoType: "Intervention Learner", monthlyCredits: 150, used: 25, progress: 43, reading: "Grade 5", math: "Grade 6", interest: "Minecraft", notes: "Needs short chunks and concrete examples." },
    { id: "s4", name: "Jordan T.", initials: "JT", grade: "7", className: "Period 2", language: "English", level: "Above level", proficiency: "Distinguished", support: ["Gifted"], hotListMove: "", allocation: 30, aiSupportLevel: 15, learnerDemoType: "Advanced Learner", monthlyCredits: 45, used: 8, progress: 86, reading: "Grade 9", math: "Grade 8", interest: "sports", notes: "Use extension prompts and tradeoff reasoning." },
    { id: "s5", name: "Lena S.", initials: "LS", grade: "7", className: "Period 2", language: "English", level: "Below level", proficiency: "Novice", support: ["Intervention", "Hot List"], hotListMove: "Novice close to Apprentice", allocation: 100, monthlyCredits: 150, used: 20, progress: 43, reading: "Grade 6", math: "Grade 6", interest: "animals", notes: "Sentence starters help her connect habitat to population change." },
    { id: "s6", name: "Micah P.", initials: "MP", grade: "7", className: "Period 2", language: "English", level: "On level", proficiency: "Proficient", support: [], hotListMove: "Proficient close to Distinguished", allocation: 55, monthlyCredits: 75, used: 11, progress: 71, reading: "Grade 7", math: "Grade 7", interest: "video games", notes: "Push toward evidence and systems reasoning." },
  ];

  const lessonSetup = {
    lessonTitle: "If palm oil is not going away, how can we design palm farms to support orangutans and farmers?",
    gradeLevel: "7",
    subject: "Science",
    state: "Kentucky",
    standard: "MS-LS2-4",
    standardsPath: "Kentucky → Grade 7 → Science → Ecosystems → MS-LS2-4",
    masteryGoal: "Students can define a design problem that balances farmer livelihood needs with ecosystem stability, then identify measurable criteria and realistic constraints for a better palm farm.",
    prerequisites: "Land-use change, ecosystems, populations, producer/consumer relationships, prior criteria and constraints work.",
    expectedMisconceptions: "Palm oil is just bad; people should simply stop using palm oil; criteria and constraints mean the same thing; farmer income is separate from ecosystem design; habitat loss is not connected to population change.",
    supportLevel: "Guided hints only",
    sessionLimit: "10 minutes",
    promptLimit: 5,
    spanishSupport: true,
    studentResources: true,
  };

  const defaultState = {
    activeRole: null,
    teacherTab: "overview",
    studentTab: "lesson",
    activeStudentId: "s1",
    studentActivityIndex: 0,
    activePanel: null,
    selectedStudent: null,
    selectedResource: null,
    students,
    hotListStudents: ["s1", "s5"],
    responses: {
      s1: { navigation: "Oil palm helps farmers earn income, but farms can take away rainforest habitat." },
      s2: { navigation: "La palma aceitera ayuda a los agricultores, pero puede reducir el bosque tropical." },
    },
    chats: {
      s1: [
        { role: "assistant", text: "I can help you think it through. What part of the palm oil problem feels most complicated?" },
      ],
    },
    dqb: [
      { id: "q1", studentId: "s3", category: "Orangutan populations", question: "How much forest does an orangutan need to survive?", status: "pending", quality: "Investigable" },
      { id: "q2", studentId: "s2", category: "Farmer income", question: "How much palm crop do farmers need to sell to support their families?", status: "pending", quality: "Strong" },
      { id: "q3", studentId: "s4", category: "Ecosystem stability", question: "How does adding rainforest trees to a palm farm affect orangutan population stability over time?", status: "approved", quality: "Strong" },
      { id: "q4", studentId: "s5", category: "Human impact", question: "Why do farms affect animals?", status: "pending", quality: "Needs a nudge" },
      { id: "q5", studentId: "s1", category: "Rainforest plants", question: "Which rainforest plants provide food or habitat for orangutans?", status: "approved", quality: "Investigable" },
    ],
    lessonSetup,
    resources,
    resourceList: resources,
    misconceptionLog: [
      { id: "m1", studentId: "s5", type: "Palm oil is just bad", activityId: "define", createdAt: "Demo" },
      { id: "m2", studentId: "s3", type: "Confusing criteria and constraints", activityId: "criteria", createdAt: "Demo" },
      { id: "m3", studentId: "s1", type: "Ignoring farmer income", activityId: "goal", createdAt: "Demo" },
    ],
    lessonActive: true,
    spanishEnabled: true,
  };

  return {
    activities,
    problemSummary,
    defaultState,
    categories: ["Orangutan populations", "Farmer income", "Rainforest plants", "Palm farm design", "Ecosystem stability", "Criteria and constraints", "Human impact"],
    shareabilityOptions: ["Private", "Share with school", "Share with district", "Public/open resource", "AI-created", "Teacher-created", "Copyright restricted / do not share"],
    resourceTypes: ["PDF", "DOCX", "PPTX", "Google Doc link", "Google Slides link", "YouTube link", "Website URL", "Image/chart/graph"],
  };
})();
