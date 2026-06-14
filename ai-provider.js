window.InquiryAIProvider = (() => {
  const misconceptionRules = [
    { tag: "Needs Evidence", pattern: /\bpalm oil\b.*\b(bad|hurts|kills)\b|\bpalm oil bad\b/i },
    { tag: "Missing Cause and Effect", pattern: /\borangutans?\b.*\b(dying|disappearing|extinct|losing (their )?homes|lost their habitat|home|habitat|forest)\b|\btrees?\b.*\bcut|loss|gone\b/i },
    { tag: "Oversimplified Cause", pattern: /\b(they can just move|orangutans can move|animals can move somewhere else|they will find another forest|companies are bad|farmers are bad|people are greedy|companies fault)\b/i },
    { tag: "Limited Understanding", pattern: /\b(i don't know|idk|not sure|confused|nothing)\b/i },
    { tag: "Limited Understanding", pattern: /\b(habitats grow back|trees grow back|forest grows back|they can replant)\b/i },
    { tag: "Developing Explanation", pattern: /\bbecause|so that|therefore|this means|causes?\b/i },
    { tag: "Developing Explanation", pattern: /\b(people should stop buying palm oil|don't buy palm oil|ban palm oil|stop using palm oil|palm oil is in food|palm oil is in products|we use palm oil|consumer|customers)\b/i },
    { tag: "Ready to Share", pattern: /\bevidence|criteria|constraint|population|stable|farmers?\b.*\borangutans?\b/i },
    { tag: "Developing Explanation", pattern: /\b(ecosystem|food web|biodiversity|species|environment)\b/i },
    { tag: "Needs Evidence", pattern: /\b(bad|good|better|worse|help|hurt)\b/i },
  ];

  const QUESTION_MATRIX = {
    foundational: [
      "What is",
      "Who is",
      "Where is",
      "When is",
      "What did",
      "What can",
      "Who can",
      "Where can",
      "What do you notice",
    ],
    reasoning: [
      "Why is",
      "How is",
      "Why did",
      "How did",
      "Why can",
      "How can",
      "How does",
    ],
    transfer: [
      "What would",
      "Why would",
      "How would",
      "What might",
      "Why might",
      "How might",
    ],
  };

  const scriptedCases = [
    {
      tag: "Needs Evidence",
      status: "Developing explanation",
      statuses: { 15: "Developing explanation", 50: "Developing explanation", 85: "Needs support" },
      pattern: /\b(palm oil is bad|palm oil bad|palm oil hurts|palm oil kills)\b/i,
      responses: {
        15: "How might you determine whether palm oil production is the primary cause of habitat loss? What evidence would strengthen that conclusion?",
        50: "How does palm oil production connect to changes in orangutan habitat? What evidence supports that connection?",
        85: "What evidence did you see that connects palm oil to changes in the forest?",
      },
      stems: { 15: "How might", 50: "How does", 85: "What did" },
    },
    {
      tag: "Missing Cause and Effect",
      status: "Developing explanation",
      pattern: /\b(orangutans are dying|orangutans are disappearing|orangutans are going extinct|orangutans are losing (their )?homes|orangutans lost their habitat)\b/i,
      responses: {
        15: "How might habitat loss affect the larger ecosystem beyond just orangutans?",
        50: "How can forest clearing for palm oil change the habitat orangutans depend on?",
        85: "What do you notice about what orangutans need from their habitat to survive?",
      },
      stems: { 15: "How might", 50: "How can", 85: "What do you notice" },
    },
    {
      tag: "Oversimplified Cause",
      status: "Needs support",
      pattern: /\b(they can just move|orangutans can move|animals can move somewhere else|they will find another forest)\b/i,
      responses: {
        15: "What trade-offs or ecosystem effects might happen if many orangutans are forced into a smaller area?",
        50: "How can moving to a new forest be difficult for orangutans?",
        85: "What can happen if orangutans move to a habitat without enough food, shelter, or space?",
      },
      stems: { 15: "What might", 50: "How can", 85: "What can" },
    },
    {
      tag: "Limited Understanding",
      status: "Needs support",
      pattern: /\b(habitats grow back|trees grow back|forest grows back|they can replant)\b/i,
      responses: {
        15: "How might you evaluate whether a replanted habitat can support the same ecosystem as an old forest?",
        50: "How can replanting help, and why might some features of a mature forest take time to return?",
        85: "What can a mature forest provide for orangutans besides trees?",
      },
      stems: { 15: "How might", 50: "How can", 85: "What can" },
    },
    {
      tag: "Developing Explanation",
      status: "Ready to share",
      pattern: /\b(people should stop buying palm oil|don't buy palm oil|ban palm oil|stop using palm oil)\b/i,
      responses: {
        15: "Why might different stakeholders disagree about whether people should stop buying palm oil?",
        50: "How can evidence help you compare the benefits and problems of that solution?",
        85: "What can happen if people stop buying a product that farmers depend on?",
      },
      stems: { 15: "Why might", 50: "How can", 85: "What can" },
    },
    {
      tag: "Oversimplified Cause",
      status: "Developing explanation",
      pattern: /\b(it is the companies fault|companies are bad|farmers are bad|people are greedy)\b/i,
      responses: {
        15: "Why might different groups in this system make different choices about palm oil?",
        50: "How can you identify the stakeholders connected to palm oil production and use?",
        85: "Who is involved in this problem besides companies or farmers?",
      },
      stems: { 15: "Why might", 50: "How can", 85: "Who is" },
    },
    {
      tag: "Limited Understanding",
      status: "Needs support",
      pattern: /\b(i don't know|idk|not sure|i am confused|confused)\b/i,
      responses: {
        15: "What would you ask to explain the relationship between consumer choices and ecosystem change?",
        50: "How did palm oil production and habitat changes seem connected in the lesson?",
        85: "What is one thing you noticed about orangutans, forests, or palm oil?",
      },
      stems: { 15: "What would", 50: "How did", 85: "What is" },
    },
    {
      tag: "Developing Explanation",
      status: "Ready to share",
      pattern: /\b(palm oil is in food|palm oil is in products|we use palm oil|consumer|customers)\b/i,
      responses: {
        15: "How might consumer demand affect ecosystems beyond the palm oil plantation?",
        50: "How can consumer demand affect how much land is used for palm oil production?",
        85: "What can happen when many people buy products made with palm oil?",
      },
      stems: { 15: "How might", 50: "How can", 85: "What can" },
    },
    {
      tag: "Developing Explanation",
      status: "Ready to share",
      pattern: /\b(ecosystem|food web|biodiversity|species|environment)\b/i,
      responses: {
        15: "How could one habitat change affect other parts of the ecosystem?",
        50: "How can a change in forest habitat affect other organisms or resources?",
        85: "What do you notice changing in the ecosystem when forest habitat changes?",
      },
      stems: { 15: "How would", 50: "How can", 85: "What do you notice" },
    },
  ];

  class DemoAIProvider {
    constructor(options = {}) {
      this.mode = "demo";
      this.lessonTitle = options.lessonTitle || "OpenSciEd palm oil and orangutan design problem";
    }

    scaffold({ message = "", activity = {}, student = {}, lessonSetup = {}, existingPromptCount = 0 }) {
      const cleanMessage = String(message).trim();
      const supportLevel = normalizeSupportLevel(student.aiSupportLevel ?? student.allocation ?? 50);
      const scriptedCase = findScriptedCase(cleanMessage);
      const tag = scriptedCase?.tag || detectMisconception(cleanMessage);
      const status = scriptedCase?.status || progressStatus(tag, supportLevel, cleanMessage);
      const limitReached = Number(lessonSetup.promptLimit || 5) <= Number(existingPromptCount || 0);

      if (limitReached) {
        return response({
          scaffold: "Pause here and bring your current idea back to your notebook, group, or teacher. What is the strongest evidence you have so far?",
          supportLevel,
          tag,
          status: "Ready for teacher check-in",
          ruleAction: "session-limit",
          questionStem: getQuestionStem({ supportLevel, misconceptionTag: tag, lessonTopic: lessonSetup.lessonTitle }),
          creditsUsed: 0,
        });
      }

      const directAnswerRequest = /\b(answer|tell me|do it for me|write it for me|complete it|solve it)\b/i.test(cleanMessage);
      if (directAnswerRequest) {
        return response({
          scaffold: bySupportLevel(supportLevel, {
            low: "I will not give the answer. What evidence from the lesson could you use first?",
            mid: "I will not give the answer. Try this starter: One piece of evidence is ___. How does that evidence connect to the design problem?",
            high: "I will not give the answer. Evidence means information from the lesson. Start with: The lesson says ___, so I think ___. What part of the resource can you use?",
          }),
          supportLevel,
          tag: "Needs Evidence",
          status: "Needs revision",
          ruleAction: "direct-answer-guard",
          questionStem: getQuestionStem({ supportLevel, misconceptionTag: "Needs Evidence", lessonTopic: lessonSetup.lessonTitle }),
          creditsUsed: 1,
        });
      }

      if (scriptedCase) {
        return response({
          scaffold: scriptedCase.responses[supportLevel],
          supportLevel,
          tag: scriptedCase.tag,
          status: scriptedCase.statuses?.[supportLevel] || scriptedCase.status,
          ruleAction: "scripted-inquiry-scaffold",
          questionStem: scriptedCase.stems?.[supportLevel] || getQuestionStem({ supportLevel, misconceptionTag: scriptedCase.tag, lessonTopic: lessonSetup.lessonTitle }),
          creditsUsed: 1,
        });
      }

      return response({
        scaffold: buildScaffold(cleanMessage, activity, supportLevel, tag),
        supportLevel,
        tag,
        status,
        ruleAction: tag === "Ready to Share" ? "ready-to-share" : "inquiry-scaffold",
        questionStem: getQuestionStem({ supportLevel, misconceptionTag: tag, lessonTopic: lessonSetup.lessonTitle || activityHintFromActivity(activity) }),
        creditsUsed: 1,
      });
    }
  }

  class OpenAIReadyProvider {
    constructor(options = {}) {
      this.mode = "openai-ready";
      this.endpoint = options.endpoint || "";
    }

    async scaffold() {
      // Production Note:
      // This is where a secure server-side AI endpoint should be called.
      // Do not expose OpenAI API keys in frontend code. Send only the minimum
      // lesson/student context needed, enforce no-direct-answer behavior on the
      // server, and log teacher-visible scaffold metadata for review.
      throw new Error("OpenAI provider is not enabled. Use DemoAIProvider until a secure server endpoint exists.");
    }
  }

  function createAIProvider(mode = "demo", options = {}) {
    if (mode === "openai") return new OpenAIReadyProvider(options);
    return new DemoAIProvider(options);
  }

  function buildScaffold(message, activity, supportLevel, tag) {
    const lower = message.toLowerCase();
    const activityHint = activityHintFromActivity(activity);

    if (tag === "Oversimplified Cause") {
      return bySupportLevel(supportLevel, {
        low: "What trade-offs might appear if that idea were used as the solution?",
        mid: "Why might that idea be too simple for a system with farmers, consumers, forests, and orangutans? Try: Palm oil affects ___ because ___.",
        high: "What groups or needs are part of this problem? Try: One group is ___, and they need ___.",
      });
    }

    if (tag === "Missing Cause and Effect" || /orangutans?|habitat|forest/.test(lower)) {
      return bySupportLevel(supportLevel, {
        low: "How might that habitat change affect the larger ecosystem over time?",
        mid: "What cause-and-effect relationship connects habitat change to orangutan survival? Try: When ___ happens, orangutans ___.",
        high: "What do you notice changing in the orangutans' habitat?",
      });
    }

    if (tag === "Limited Understanding") {
      return bySupportLevel(supportLevel, {
        low: "What question could help you connect consumer choices, palm oil, and ecosystem change?",
        mid: "What pattern do you notice in the lesson resources about palm oil, forests, or orangutans?",
        high: "What is one thing you noticed about orangutans, forests, or palm oil?",
      });
    }

    if (tag === "Ready to Share") {
      return bySupportLevel(supportLevel, {
        low: "How would you evaluate whether your explanation accounts for both farmer needs and ecosystem stability?",
        mid: "What evidence or measurement would show your idea works for both farmers and orangutans?",
        high: "Which evidence shows your farm design helps farmers and protects habitat?",
      });
    }

    if (tag === "Developing Explanation") {
      return bySupportLevel(supportLevel, {
        low: "How could this connect to another ecosystem or human design problem?",
        mid: `How could you connect that explanation to ${activityHint}? Try: This matters because ___.`,
        high: `What evidence from the lesson could go in this sentence: My idea is ___ because ___?`,
      });
    }

    return bySupportLevel(supportLevel, {
      low: getQuestionStem({ supportLevel, misconceptionTag: tag, lessonContext: activityHint }),
      mid: `${getQuestionStem({ supportLevel, misconceptionTag: tag, lessonContext: activityHint })} Try starting with: I think ___ because ___.`,
      high: `${getQuestionStem({ supportLevel, misconceptionTag: tag, lessonContext: activityHint })} Sentence starter: I noticed ___ in the lesson.`,
    });
  }

  function activityHintFromActivity(activity = {}) {
    if (activity?.id === "criteria") return "criteria and constraints";
    if (activity?.id === "goal") return "farmers and orangutans";
    return "lesson evidence";
  }

  function detectMisconception(message = "") {
    const match = misconceptionRules.find((rule) => rule.pattern.test(message));
    return match?.tag || "Needs Evidence";
  }

  function findScriptedCase(message = "") {
    return scriptedCases.find((item) => item.pattern.test(message));
  }

  function progressStatus(tag, supportLevel, message) {
    if (tag === "Ready to Share") return "Ready to share";
    if (tag === "Developing Explanation") return supportLevel >= 85 ? "Developing with support" : "Developing";
    if (tag === "Limited Understanding") return "Needs teacher check-in";
    if (String(message).trim().length < 12) return "Needs more detail";
    return "Needs evidence";
  }

  function normalizeSupportLevel(value) {
    const number = Number(value);
    if (number <= 20) return 15;
    if (number >= 75) return 85;
    return 50;
  }

  function bySupportLevel(level, variants) {
    if (level === 15) return variants.low;
    if (level === 85) return variants.high;
    return variants.mid;
  }

  function getQuestionMatrixLevel(supportLevel) {
    const level = normalizeSupportLevel(supportLevel);
    if (level === 85) return "Foundational";
    if (level === 15) return "Transfer";
    return "Reasoning";
  }

  function getQuestionStem({ supportLevel, misconceptionTag = "Needs Evidence", lessonContext = "lesson evidence", lessonTopic = "" } = {}) {
    const matrixLevel = getQuestionMatrixLevel(supportLevel);
    if (matrixLevel === "Foundational") {
      if (misconceptionTag === "Missing Cause and Effect") return "What do you notice";
      if (misconceptionTag === "Limited Understanding") return "What is";
      if (String(lessonTopic).toLowerCase().includes("orangutan")) return "Where can";
      return "What did";
    }
    if (matrixLevel === "Transfer") {
      if (misconceptionTag === "Oversimplified Cause") return "What might";
      if (misconceptionTag === "Missing Cause and Effect") return "How might";
      if (misconceptionTag === "Developing Explanation") return "How would";
      return "How might";
    }
    if (misconceptionTag === "Missing Cause and Effect") return "How can";
    if (misconceptionTag === "Limited Understanding") return "How did";
    if (String(lessonContext).toLowerCase().includes("evidence")) return "How can";
    return "How does";
  }

  function response({ scaffold, supportLevel, tag, status, ruleAction, questionStem, creditsUsed }) {
    const questionMatrixLevel = getQuestionMatrixLevel(supportLevel);
    const selectedStem = questionStem || getQuestionStem({ supportLevel, misconceptionTag: tag });
    return {
      finalResponse: scaffold,
      scaffold,
      scaffoldText: scaffold,
      supportLevel,
      questionMatrixLevel,
      questionStem: selectedStem,
      misconceptionTag: tag,
      progressStatus: status,
      flags: [tag],
      ruleAction,
      mode: ruleAction === "scripted-inquiry-scaffold" ? "scripted-demo" : "demo",
      creditsUsed,
    };
  }

  return {
    DemoAIProvider,
    OpenAIReadyProvider,
    createAIProvider,
    detectMisconception,
    getQuestionMatrixLevel,
    getQuestionStem,
    QUESTION_MATRIX,
    misconceptionRules,
    scriptedCases,
  };
})();
