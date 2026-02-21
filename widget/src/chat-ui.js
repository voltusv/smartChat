import { WebSocketClient } from "./websocket-client.js";
import { renderMarkdown } from "./markdown-renderer.js";
import { RichTextEditor } from "./rich-editor.js";
import { htmlToMarkdown } from "./html-to-markdown.js";
import styles from "./styles.css";

const CHAT_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>`;
const CLOSE_ICON = `\u2715`;

export class ChatWidget {
  constructor(serverUrl, apiKey, config, userContext, authConfig = null) {
    this.serverUrl = serverUrl;
    this.apiKey = apiKey;
    this.config = config;
    this.userContext = userContext || {};
    this.authConfig = authConfig;
    this.userToken = this._getSavedToken();
    this.isOpen = false;
    this.isStreaming = false;
    this.isLoggedIn = !!this.userToken || !!userContext.user_id;
    this.sessionId = this._getSessionId();
    this.wsClient = null;
    this.host = null;
    this.shadow = null;
    this.richEditor = null;
    this.loginFormEl = null;
    this.chatAreaEl = null;
  }
  
  _getSavedToken() {
    return localStorage.getItem(`smartchat_token_${this.apiKey}`);
  }
  
  _saveToken(token) {
    localStorage.setItem(`smartchat_token_${this.apiKey}`, token);
    this.userToken = token;
  }
  
  _clearToken() {
    localStorage.removeItem(`smartchat_token_${this.apiKey}`);
    this.userToken = null;
  }

  _getSessionId() {
    const key = "smartchat_session_id";
    let sessionId = localStorage.getItem(key);
    if (!sessionId) {
      sessionId = "sc_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem(key, sessionId);
    }
    return sessionId;
  }

  mount() {
    // Create host element
    this.host = document.createElement("div");
    this.host.id = "smartchat-widget";
    this.shadow = this.host.attachShadow({ mode: "open" });

    // Inject styles
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    this.shadow.appendChild(styleEl);

    // Set CSS custom property for primary color
    this.host.style.setProperty("--sc-primary", this.config.primary_color || "#4F46E5");

    // Build UI
    this._buildUI();

    // Append to document
    document.body.appendChild(this.host);

    // Connect WebSocket
    this._connectWS();
  }

  _buildUI() {
    // Chat bubble button
    const bubble = document.createElement("button");
    bubble.className = "sc-bubble";
    bubble.innerHTML = CHAT_ICON;
    bubble.addEventListener("click", () => this._toggle());
    this.shadow.appendChild(bubble);
    this.bubbleEl = bubble;

    // Chat window
    const win = document.createElement("div");
    win.className = "sc-window sc-hidden";
    const logoHtml = this.config.logo_url
      ? `<img class="sc-logo" src="${this.config.logo_url}" alt="" />`
      : '';
    win.innerHTML = `
      <div class="sc-header">
        <div class="sc-header-left">
          ${logoHtml}
          <span>Chat</span>
        </div>
        <button class="sc-close">${CLOSE_ICON}</button>
      </div>
      <div class="sc-login-form sc-hidden">
        <div class="sc-login-title">Sign in to continue</div>
        <input type="email" class="sc-login-email" placeholder="Email" />
        <input type="password" class="sc-login-password" placeholder="Password" />
        <div class="sc-login-error sc-hidden"></div>
        <button class="sc-login-btn">Sign In</button>
      </div>
      <div class="sc-chat-area">
        <div class="sc-messages"></div>
      </div>
    `;

    // Build input area with rich editor
    const inputArea = document.createElement("div");
    inputArea.className = "sc-input-area";

    this.richEditor = new RichTextEditor({
      onSend: () => this._sendMessage(),
      shadowRoot: this.shadow,
    });
    inputArea.appendChild(this.richEditor.build());

    this.sendBtn = document.createElement("button");
    this.sendBtn.className = "sc-send";
    this.sendBtn.textContent = "Send";
    this.sendBtn.addEventListener("click", () => this._sendMessage());
    inputArea.appendChild(this.sendBtn);

    win.querySelector(".sc-chat-area").appendChild(inputArea);
    this.shadow.appendChild(win);
    this.windowEl = win;

    // References
    this.messagesEl = win.querySelector(".sc-messages");
    this.loginFormEl = win.querySelector(".sc-login-form");
    this.chatAreaEl = win.querySelector(".sc-chat-area");
    const closeBtn = win.querySelector(".sc-close");

    // Events
    closeBtn.addEventListener("click", () => this._toggle());
    
    // Login form events
    const loginBtn = win.querySelector(".sc-login-btn");
    const emailInput = win.querySelector(".sc-login-email");
    const passwordInput = win.querySelector(".sc-login-password");
    
    loginBtn.addEventListener("click", () => this._handleLogin());
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this._handleLogin();
    });
    
    // Check if login is required
    this._checkAuthAndShowUI();

    // Show greeting
    if (this.config.greeting && this.isLoggedIn) {
      this._addMessage("assistant", this.config.greeting);
    }
  }
  
  _checkAuthAndShowUI() {
    // If user context was passed (embedded mode) or we have a token, show chat
    if (this.userContext.user_id || this.userToken) {
      this.isLoggedIn = true;
      this._showChat();
      return;
    }
    
    // If auth is required, show login form
    if (this.authConfig && this.authConfig.requires_login) {
      this._showLogin();
    } else {
      // No auth required, show chat
      this.isLoggedIn = true;
      this._showChat();
    }
  }
  
  _showLogin() {
    this.loginFormEl.classList.remove("sc-hidden");
    this.chatAreaEl.classList.add("sc-hidden");
  }
  
  _showChat() {
    this.loginFormEl.classList.add("sc-hidden");
    this.chatAreaEl.classList.remove("sc-hidden");
    if (this.config.greeting && this.messagesEl.children.length === 0) {
      this._addMessage("assistant", this.config.greeting);
    }
  }
  
  async _handleLogin() {
    const emailInput = this.loginFormEl.querySelector(".sc-login-email");
    const passwordInput = this.loginFormEl.querySelector(".sc-login-password");
    const errorEl = this.loginFormEl.querySelector(".sc-login-error");
    const loginBtn = this.loginFormEl.querySelector(".sc-login-btn");
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!email || !password) {
      errorEl.textContent = "Please enter email and password";
      errorEl.classList.remove("sc-hidden");
      return;
    }
    
    loginBtn.disabled = true;
    loginBtn.textContent = "Signing in...";
    errorEl.classList.add("sc-hidden");
    
    try {
      const response = await fetch(`${this.serverUrl}/api/auth/login/${this.apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        this._saveToken(data.token);
        this.userContext.user_id = data.user_id;
        this.userContext.name = data.user_name;
        this.userContext.email = data.user_email;
        this.isLoggedIn = true;
        this._showChat();
        
        // Clear form
        emailInput.value = "";
        passwordInput.value = "";
      } else {
        errorEl.textContent = data.error || "Login failed";
        errorEl.classList.remove("sc-hidden");
      }
    } catch (err) {
      errorEl.textContent = "Connection error. Please try again.";
      errorEl.classList.remove("sc-hidden");
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Sign In";
    }
  }

  _toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.windowEl.classList.remove("sc-hidden");
      this.richEditor.focus();
    } else {
      this.windowEl.classList.add("sc-hidden");
    }
  }

  _addMessage(role, content) {
    const msg = document.createElement("div");
    msg.className = `sc-message sc-message-${role}`;

    if (role === "assistant" && content) {
      msg.innerHTML = renderMarkdown(content);
    } else {
      msg.textContent = content;
    }

    this.messagesEl.appendChild(msg);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    return msg;
  }

  _appendToLastMessage(text) {
    const messages = this.messagesEl.querySelectorAll(".sc-message-assistant");
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];

      // Accumulate raw markdown
      if (!lastMsg._rawMarkdown) lastMsg._rawMarkdown = "";
      lastMsg._rawMarkdown += text;

      // Throttle re-renders to ~60fps
      if (!lastMsg._renderPending) {
        lastMsg._renderPending = true;
        requestAnimationFrame(() => {
          lastMsg.innerHTML = renderMarkdown(lastMsg._rawMarkdown);
          lastMsg._renderPending = false;
          this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
        });
      }
    }
  }

  _sendMessage() {
    if (this.richEditor.isEmpty() || this.isStreaming) return;

    // Convert rich text HTML to markdown for backend
    const html = this.richEditor.getHTML();
    const markdown = htmlToMarkdown(html);

    if (!markdown.trim()) return;

    // Display user message as plain text
    this._addMessage("user", markdown);
    this.richEditor.clear();

    this.isStreaming = true;
    this.sendBtn.disabled = true;
    this.richEditor.setEnabled(false);

    // Create empty assistant message for streaming
    this._addMessage("assistant", "");

    const sent = this.wsClient.send(markdown, this.apiKey, this.userToken);
    if (!sent) {
      this._appendToLastMessage("Connection error. Please try again.");
      this.isStreaming = false;
      this.sendBtn.disabled = false;
      this.richEditor.setEnabled(true);
    }
  }

  _connectWS() {
    this.wsClient = new WebSocketClient(this.serverUrl, this.sessionId);

    this.wsClient.onChunk = (content) => {
      this._appendToLastMessage(content);
    };

    this.wsClient.onDone = () => {
      this.isStreaming = false;
      this.sendBtn.disabled = false;
      this.richEditor.setEnabled(true);
    };

    this.wsClient.onError = (message) => {
      this._appendToLastMessage(`\n[Error: ${message}]`);
      this.isStreaming = false;
      this.sendBtn.disabled = false;
      this.richEditor.setEnabled(true);
    };

    this.wsClient.connect();
  }
}
