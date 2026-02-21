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

  // Read optional user identity from data attributes
  const userContext = {};
  const userId = script.getAttribute("data-user-id");
  const userName = script.getAttribute("data-user-name");
  const userEmail = script.getAttribute("data-user-email");
  const userMeta = script.getAttribute("data-user-meta");

  if (userId) userContext.user_id = userId;
  if (userName) userContext.name = userName;
  if (userEmail) userContext.email = userEmail;
  if (userMeta) {
    try {
      userContext.meta = JSON.parse(userMeta);
    } catch (e) {
      console.warn("SmartChat: Invalid JSON in data-user-meta");
    }
  }

  // Derive server URL from script src
  const scriptSrc = script.src;
  const serverUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf("/"));

  // Fetch widget config and auth config then mount
  Promise.all([
    fetch(`${serverUrl}/api/widget/config/${apiKey}`).then((r) => {
      if (!r.ok) throw new Error("Failed to load widget config");
      return r.json();
    }),
    fetch(`${serverUrl}/api/auth/config/${apiKey}`).then((r) => {
      if (!r.ok) return { auth_mode: "none", requires_login: false };
      return r.json();
    }),
  ])
    .then(([config, authConfig]) => {
      const widget = new ChatWidget(serverUrl, apiKey, config, userContext, authConfig);
      widget.mount();

      // Expose JS API for dynamic user identification
      window.SmartChat = {
        identify(ctx) {
          if (ctx.userId) widget.userContext.user_id = ctx.userId;
          if (ctx.name) widget.userContext.name = ctx.name;
          if (ctx.email) widget.userContext.email = ctx.email;
          if (ctx.meta) widget.userContext.meta = ctx.meta;
          widget.isLoggedIn = true;
          widget._showChat();
        },
        logout() {
          widget._clearToken();
          widget.isLoggedIn = false;
          widget._showLogin();
        },
      };
    })
    .catch((err) => {
      console.error("SmartChat: Failed to initialize", err);
    });
})();
