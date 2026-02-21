export class WebSocketClient {
  constructor(serverUrl, sessionId) {
    const wsProtocol = serverUrl.startsWith("https") ? "wss" : "ws";
    const wsHost = serverUrl.replace(/^https?:\/\//, "");
    this.url = `${wsProtocol}://${wsHost}/api/chat/ws/chat/${sessionId}`;
    this.ws = null;
    this.onChunk = null;
    this.onDone = null;
    this.onError = null;
    this.onOpen = null;
    this._reconnectTimer = null;
    this._intentionalClose = false;
  }

  connect() {
    this._intentionalClose = false;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      if (this.onOpen) this.onOpen();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chunk" && this.onChunk) {
          this.onChunk(data.content);
        } else if (data.type === "done" && this.onDone) {
          this.onDone();
        } else if (data.type === "error" && this.onError) {
          this.onError(data.message);
        }
      } catch (e) {
        console.error("SmartChat: Failed to parse message", e);
      }
    };

    this.ws.onclose = () => {
      if (!this._intentionalClose) {
        this._reconnectTimer = setTimeout(() => this.connect(), 2000);
      }
    };

    this.ws.onerror = (err) => {
      console.error("SmartChat: WebSocket error", err);
    };
  }

  send(message, apiKey) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ message, api_key: apiKey }));
      return true;
    }
    return false;
  }

  disconnect() {
    this._intentionalClose = true;
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}
