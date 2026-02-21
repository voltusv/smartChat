import { WebSocketClient } from "./websocket-client.js";
import { renderMarkdown } from "./markdown-renderer.js";
import { RichTextEditor } from "./rich-editor.js";
import { htmlToMarkdown } from "./html-to-markdown.js";
import styles from "./styles.css";

const CHAT_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>`;
const CLOSE_ICON = `\u2715`;

export class ChatWidget {
  constructor(serverUrl, apiKey, config) {
    this.serverUrl = serverUrl;
    this.apiKey = apiKey;
    this.config = config;
    this.isOpen = false;
    this.isStreaming = false;
    this.sessionId = this._getSessionId();
    this.wsClient = null;
    this.host = null;
    this.shadow = null;
    this.richEditor = null;
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
    win.innerHTML = `
      <div class="sc-header">
        <span>Chat</span>
        <button class="sc-close">${CLOSE_ICON}</button>
      </div>
      <div class="sc-messages"></div>
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

    win.appendChild(inputArea);
    this.shadow.appendChild(win);
    this.windowEl = win;

    // References
    this.messagesEl = win.querySelector(".sc-messages");
    const closeBtn = win.querySelector(".sc-close");

    // Events
    closeBtn.addEventListener("click", () => this._toggle());

    // Show greeting
    if (this.config.greeting) {
      this._addMessage("assistant", this.config.greeting);
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

    const sent = this.wsClient.send(markdown, this.apiKey);
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
