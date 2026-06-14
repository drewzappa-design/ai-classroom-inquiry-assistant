window.InquiryAI = (() => {
  const questionOpeners = ["how", "what", "why", "which", "when", "where"];

  function respond(message, activityId, student) {
    const input = message.trim().toLowerCase();
    const spanish = student.language === "Spanish";
    if (!input) return "";

    if (/(answer|tell me|do it for me|write it)/.test(input)) {
      return spanish
        ? "Puedo ayudarte a pensar, pero no haré el trabajo por ti. ¿Qué evidencia de la lección podrías usar primero?"
        : "I can help you think, but I will not do the work for you. What lesson evidence could you use first?";
    }
    if (/(game|youtube|unrelated|pizza|fortnite)/.test(input)) {
      return spanish
        ? "Volvamos a la investigación de hoy. ¿Cómo podría el diseño de una finca afectar a los agricultores o a los orangutanes?"
        : "Let’s return to today’s investigation. How could a farm design affect farmers or orangutans?";
    }

    const scaffolds = {
      navigation: spanish
        ? "Buena observación. ¿Cómo crea eso una tensión entre las necesidades de los agricultores y las del ecosistema?"
        : "Good observation. How does that create a tension between farmers’ needs and the ecosystem’s needs?",
      define: spanish
        ? "¿Puedes conectar esa idea con un efecto específico sobre los agricultores, el bosque tropical o las poblaciones de animales?"
        : "Can you connect that idea to one specific effect on farmers, the rainforest, or animal populations?",
      goal: spanish
        ? "Un objetivo sólido incluye ambos grupos. ¿Cómo sabrías si tu diseño funciona para los agricultores y los orangutanes?"
        : "A strong goal includes both groups. How would you know if your design works for farmers and orangutans?",
      criteria: spanish
        ? "Pregúntate: ¿es una señal medible de éxito o un límite que debemos respetar? ¿Cuál es?"
        : "Ask yourself: is that a measurable sign of success or a limit the design must follow? Which one is it?",
      questions: spanish
        ? "Hazla más investigable. ¿Qué variable, patrón o evidencia podrías comparar?"
        : "Make it more investigable. What variable, pattern, or evidence could you compare?",
      dqb: spanish
        ? "Antes de enviarla, comprueba si tu pregunta podría investigarse con datos, medidas o patrones."
        : "Before submitting, check whether your question could be investigated with data, measurements, or patterns.",
      next: spanish
        ? "¿Qué datos necesitaríamos comparar para decidir si una población de orangutanes es estable?"
        : "What data would we need to compare to decide whether an orangutan population is stable?",
    };
    return scaffolds[activityId] || scaffolds.navigation;
  }

  function improveQuestion(question) {
    const trimmed = question.trim();
    if (!trimmed) return "";
    if (trimmed.length > 60 && questionOpeners.some((word) => trimmed.toLowerCase().startsWith(word))) return trimmed;
    const topic = /farm/i.test(trimmed) ? "palm farm design" : /animal|orangutan/i.test(trimmed) ? "orangutan habitat" : "rainforest habitat";
    return `How does changing ${topic} affect orangutan population stability while farmers maintain crops to sell?`;
  }

  return { respond, improveQuestion };
})();
