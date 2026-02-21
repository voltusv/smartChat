import { ChatWidget } from "./chat-ui.js";

(function () {
  const script = document.currentScript;
  if (!script) {
    console.error("SmartChat: Could not find script element");
    return;
  }

  const apiKey = script.getAttribute("data-api-key");
  if (!apiKey) {
    console.error("SmartChat: data-api-key attribute is required");
    return;
  }

  // Derive server URL from script src
  const scriptSrc = script.src;
  const serverUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf("/"));

  // Fetch widget config then mount
  fetch(`${serverUrl}/api/widget/config/${apiKey}`)
    .then((r) => {
      if (!r.ok) throw new Error("Failed to load widget config");
      return r.json();
    })
    .then((config) => {
      const widget = new ChatWidget(serverUrl, apiKey, config);
      widget.mount();
    })
    .catch((err) => {
      console.error("SmartChat: Failed to initialize", err);
    });
})();
