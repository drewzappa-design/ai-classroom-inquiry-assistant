(function () {
  const fallbackBlobId = "WALRUS-PROTOTYPE-2026-ENG-0001";

  function configuredRelayUrl() {
    return (
      window.EduMemoryWalrusRelayUrl ||
      window.ClassroomAIConfig?.WALRUS_UPLOAD_RELAY_URL ||
      localStorage.getItem("edumemory-walrus-relay-url") ||
      ""
    ).trim();
  }

  function fallbackResult(reason, payload) {
    return {
      mode: "mock",
      status: "Prototype Walrus Memory Record",
      blobId: fallbackBlobId,
      objectId: "",
      transactionDigest: "",
      reason,
      storedAt: new Date().toISOString(),
      payloadPreview: {
        student: payload?.student,
        project: payload?.project,
        recommendedCredential: payload?.recommendedCredential,
      },
    };
  }

  async function uploadLearningMemory(memoryPayload) {
    const relayUrl = configuredRelayUrl();
    if (!relayUrl) {
      return fallbackResult("No Walrus Testnet upload relay is configured for this static demo.", memoryPayload);
    }

    try {
      const response = await fetch(relayUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "edumemory.learning-memory",
          network: "walrus-testnet",
          payload: memoryPayload,
        }),
      });

      if (!response.ok) {
        throw new Error(`Walrus relay returned HTTP ${response.status}`);
      }

      const data = await response.json().catch(() => ({}));
      return {
        mode: "real",
        status: "Stored on Walrus Testnet",
        blobId: data.blobId || data.blob_id || data.id || "",
        objectId: data.objectId || data.object_id || "",
        transactionDigest: data.transactionDigest || data.digest || data.txDigest || "",
        relayUrl,
        storedAt: data.storedAt || new Date().toISOString(),
        raw: data,
      };
    } catch (error) {
      return fallbackResult(error.message || "Walrus Testnet upload failed or was cancelled.", memoryPayload);
    }
  }

  window.EduMemoryWalrusService = {
    uploadLearningMemory,
    configuredRelayUrl,
  };
})();
