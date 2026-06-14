window.AIScaffoldingEngine = (() => {
  /**
   * @typedef {Object} StudentProfile
   * @property {string} id
   * @property {string} proficiency
   * @property {string[]} support
   * @property {string} language
   * @property {number} allocation
   */

  const misconceptionRules = [
    { type: "Palm oil is just bad", pattern: /\bpalm oil\b.*\b(bad|evil|terrible)\b/i },
    { type: "They should just stop using palm oil", pattern: /\b(stop|ban|get rid of)\b.*\bpalm oil\b/i },
    { type: "Confusing criteria and constraints", pattern: /\bcriteria\b.*\b(can't|cannot|limit|allowed|not allowed)\b|\bconstraints\b.*\bmeasure|success|know it works\b/i },
    { type: "Ignoring farmer income", pattern: /\bonly\b.*\b(orangutan|forest|animal)\b|\bfarmers?\b.*\b(don't matter|not important)\b/i },
    { type: "Ignoring ecosystem stability", pattern: /\bjust plant\b|\bmore palm\b.*\bsolve\b/i },
    { type: "Not connecting habitat loss to population change", pattern: /\bhabitat\b.*\bdoesn't\b.*\bpopulation\b|\btrees\b.*\bnot\b.*\bmatter\b/i },
  ];

  const blockedRules = [
    { reason: "direct answer request", pattern: /\b(answer|tell me|do it for me|write it for me|complete it)\b/i },
    { reason: "off-topic", pattern: /\b(fortnite|pizza|youtube|tiktok|unrelated|game cheats)\b/i },
    { reason: "not tied to lesson materials", pattern: /\bcelebrity|movie|dating|weather\b/i },
  ];

  function run({ message, activity, student, lessonSetup, existingPromptCount = 0 }) {
    const spanish = student.language === "Spanish";
    const limitReached = Number(lessonSetup.promptLimit || 5) <= existingPromptCount;
    const flags = misconceptionRules.filter((rule) => rule.pattern.test(message)).map((rule) => rule.type);

    if (limitReached) {
      return {
        finalResponse: spanish
          ? "Buen pensamiento. Ahora vuelve a tu cuaderno, grupo o actividad con tu maestro y aplica tu idea."
          : "Great thinking. Now return to your notebook, group, or teacher-led activity and apply your idea.",
        flags,
        ruleAction: "session-limit",
        creditsUsed: 0,
      };
    }

    const blocked = blockedRules.find((rule) => rule.pattern.test(message));
    if (blocked) {
      return {
        finalResponse: spanish
          ? "No puedo darte la respuesta final, pero puedo ayudarte a pensarla. ¿Qué evidencia de la lección conecta la agricultura de palma con el hábitat del bosque tropical?"
          : "I can’t give you the final answer, but I can help you think it through. What evidence from today’s lesson connects palm oil farming to rainforest habitat?",
        flags,
        ruleAction: blocked.reason,
        creditsUsed: 1,
      };
    }

    const draft = buildDraft(activity, student, lessonSetup, flags);
    return {
      finalResponse: enforceLength(draft, student),
      flags,
      ruleAction: flags.length ? "misconception-scaffold" : "approved-scaffold",
      creditsUsed: 1,
    };
  }

  function buildDraft(activity, student, lessonSetup, flags) {
    const hotList = student.support?.includes("Hot List");
    const intervention = student.support?.includes("IEP/504") || student.support?.includes("Intervention") || student.level === "Below level" || student.level === "Intervention";
    const gifted = student.support?.includes("Gifted") || student.proficiency === "Distinguished" || student.level === "Above level";
    const masteryNudge = `Mastery target: ${lessonSetup.masteryGoal}`;

    if (intervention) {
      return `Let’s break it into one small step. First name who is affected: farmers, orangutans, rainforest plants, or tigers. Then use one piece of lesson evidence. ${flags.length ? "Watch for this misconception: " + flags[0] + "." : ""}`;
    }
    if (gifted) {
      return `Push your reasoning further: what tradeoff does your idea create, and what evidence would prove the design is stable over time? ${masteryNudge}`;
    }
    if (hotList) {
      return `You are close to the next proficiency level. Add one clear piece of evidence and explain how it connects to the design goal. ${student.hotListMove || ""}`;
    }
    if (activity.id === "criteria") {
      return "Sort your idea: if it measures success, it is a criterion. If it limits what the design can do, it is a constraint. Which one are you writing now?";
    }
    return `Connect your idea to the lesson evidence. How does it help balance farmer needs with rainforest habitat and orangutan population stability? ${masteryNudge}`;
  }

  function enforceLength(text, student) {
    const maxWords = student.support?.includes("IEP/504") || student.level === "Intervention" ? 34 : 58;
    const words = text.split(/\s+/);
    return words.length <= maxWords ? text : `${words.slice(0, maxWords).join(" ")}...`;
  }

  return { run, misconceptionRules };
})();
