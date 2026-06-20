(function () {
  const fallbackBlobId = "WALRUS-PROTOTYPE-2026-ENG-0001";
  const publicPublisherUrl = "https://publisher.walrus-testnet.walrus.space/v1/blobs?epochs=5";

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

  function blobIdFromPublisherResponse(result) {
    return result?.newlyCreated?.blobObject?.blobId || result?.alreadyCertified?.blobId || "";
  }

  async function uploadToPublicPublisher(memoryPayload) {
    const json = JSON.stringify(memoryPayload, null, 2);
    const body = new Blob([json], { type: "application/json" });
    const response = await fetch(publicPublisherUrl, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body,
    });

    if (!response.ok) {
      throw new Error(`Walrus public publisher returned HTTP ${response.status}`);
    }

    const result = await response.json();
    const blobId = blobIdFromPublisherResponse(result);
    if (!blobId) {
      throw new Error("Walrus public publisher response did not include a blobId.");
    }

    return {
      mode: "real",
      status: "Stored on Walrus Testnet",
      blobId,
      objectId: result?.newlyCreated?.blobObject?.id || result?.alreadyCertified?.event?.blobObject || "",
      transactionDigest: result?.newlyCreated?.event?.txDigest || result?.alreadyCertified?.event?.txDigest || "",
      publisherUrl: publicPublisherUrl,
      storedAt: new Date().toISOString(),
      raw: result,
    };
  }

  async function uploadToConfiguredRelay(memoryPayload, relayUrl) {
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
      throw error;
    }
  }

  async function uploadLearningMemory(memoryPayload) {
    const relayUrl = configuredRelayUrl();
    const errors = [];

    try {
      return await uploadToPublicPublisher(memoryPayload);
    } catch (error) {
      errors.push(`Direct publisher: ${error.message || error}`);
    }

    if (relayUrl) {
      try {
        return await uploadToConfiguredRelay(memoryPayload, relayUrl);
      } catch (error) {
        errors.push(`Configured relay: ${error.message || error}`);
      }
    } else {
      errors.push("Configured relay: no relay URL configured");
    }

    return fallbackResult(errors.join(" | "), memoryPayload);
  }

  window.EduMemoryWalrusService = {
    uploadLearningMemory,
    configuredRelayUrl,
    publicPublisherUrl,
  };
})();
