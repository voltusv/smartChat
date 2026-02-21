/**
 * RichTextEditor - A lightweight contenteditable-based editor with toolbar.
 * Designed for Shadow DOM usage.
 */
export class RichTextEditor {
  constructor({ onSend, shadowRoot }) {
    this.onSend = onSend;
    this.shadowRoot = shadowRoot;
    this.container = null;
    this.editor = null;
    this.toolbar = null;
  }

  /**
   * Build the editor DOM and return the container element.
   * @returns {HTMLElement}
   */
  build() {
    this.container = document.createElement("div");
    this.container.className = "sc-editor-container";

    // Toolbar
    this.toolbar = document.createElement("div");
    this.toolbar.className = "sc-toolbar";
    this._buildToolbar();
    this.container.appendChild(this.toolbar);

    // Editable area
    this.editor = document.createElement("div");
    this.editor.className = "sc-editor";
    this.editor.contentEditable = "true";
    this.editor.setAttribute("role", "textbox");
    this.editor.setAttribute("aria-multiline", "true");
    this.editor.dataset.placeholder = "Type a message...";
    this.container.appendChild(this.editor);

    // Keyboard events
    this.editor.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.onSend();
      }
    });

    return this.container;
  }

  _buildToolbar() {
    const buttons = [
      { cmd: "bold", icon: "B", title: "Bold (Ctrl+B)", style: "font-weight:bold" },
      { cmd: "italic", icon: "I", title: "Italic (Ctrl+I)", style: "font-style:italic" },
      { cmd: "underline", icon: "U", title: "Underline (Ctrl+U)", style: "text-decoration:underline" },
      { cmd: "insertOrderedList", icon: "OL", title: "Ordered list" },
      { cmd: "insertUnorderedList", icon: "UL", title: "Unordered list" },
      { cmd: "code", icon: "</>", title: "Inline code", custom: true },
      { cmd: "heading", icon: "H", title: "Heading", custom: true },
      { cmd: "createLink", icon: "\u{1F517}", title: "Insert link", custom: true },
    ];

    buttons.forEach(({ cmd, icon, title, style, custom }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sc-toolbar-btn";
      btn.innerHTML = icon;
      btn.title = title;
      if (style) btn.style.cssText = style;
      btn.addEventListener("mousedown", (e) => {
        e.preventDefault(); // Prevent focus loss from editor
        if (custom) {
          this._handleCustomCommand(cmd);
        } else {
          document.execCommand(cmd, false, null);
        }
      });
      this.toolbar.appendChild(btn);
    });
  }

  _handleCustomCommand(cmd) {
    if (cmd === "code") {
      const selection = this.shadowRoot.getSelection
        ? this.shadowRoot.getSelection()
        : document.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const code = document.createElement("code");
        try {
          range.surroundContents(code);
        } catch {
          // If selection spans multiple elements, wrap text content
          code.textContent = selection.toString();
          range.deleteContents();
          range.insertNode(code);
        }
      }
    } else if (cmd === "heading") {
      document.execCommand("formatBlock", false, "h3");
    } else if (cmd === "createLink") {
      const url = prompt("Enter URL:");
      if (url) {
        document.execCommand("createLink", false, url);
      }
    }
  }

  /** Get the HTML content of the editor */
  getHTML() {
    return this.editor.innerHTML;
  }

  /** Check if editor is empty */
  isEmpty() {
    const text = this.editor.textContent.trim();
    return text === "" || text === "\n";
  }

  /** Clear the editor */
  clear() {
    this.editor.innerHTML = "";
  }

  /** Focus the editor */
  focus() {
    this.editor.focus();
  }

  /** Enable/disable the editor */
  setEnabled(enabled) {
    this.editor.contentEditable = enabled ? "true" : "false";
    this.container.classList.toggle("sc-editor-disabled", !enabled);
  }
}
