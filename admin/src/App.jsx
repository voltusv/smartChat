import React, { useState, useEffect, useCallback } from "react";

const API_BASE = "/api/admin";

const styles = {
  app: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    maxWidth: 900,
    margin: "0 auto",
    padding: "24px",
    color: "#1f2937",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 14,
  },
  tabs: {
    display: "flex",
    gap: 0,
    borderBottom: "2px solid #e5e7eb",
    marginBottom: 24,
  },
  tab: {
    padding: "10px 20px",
    cursor: "pointer",
    border: "none",
    background: "none",
    fontSize: 14,
    fontWeight: 500,
    color: "#6b7280",
    borderBottom: "2px solid transparent",
    marginBottom: -2,
  },
  tabActive: {
    color: "#4F46E5",
    borderBottomColor: "#4F46E5",
  },
  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 4,
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    minHeight: 80,
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    background: "white",
    boxSizing: "border-box",
  },
  button: {
    padding: "8px 20px",
    background: "#4F46E5",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  buttonDanger: {
    padding: "6px 12px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontSize: 13,
    cursor: "pointer",
  },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 500,
  },
  badgeReady: { background: "#d1fae5", color: "#065f46" },
  badgeProcessing: { background: "#fef3c7", color: "#92400e" },
  badgeFailed: { background: "#fee2e2", color: "#991b1b" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "8px 12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: 13,
    fontWeight: 600,
    color: "#6b7280",
  },
  td: {
    padding: "8px 12px",
    borderBottom: "1px solid #f3f4f6",
    fontSize: 14,
  },
  fileUpload: {
    border: "2px dashed #d1d5db",
    borderRadius: 8,
    padding: 32,
    textAlign: "center",
    cursor: "pointer",
    color: "#6b7280",
  },
  message: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    fontSize: 14,
  },
  messageUser: { background: "#eff6ff", textAlign: "right" },
  messageAssistant: { background: "#f3f4f6" },
  status: {
    padding: "8px 12px",
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 14,
  },
  statusSuccess: { background: "#d1fae5", color: "#065f46" },
  statusError: { background: "#fee2e2", color: "#991b1b" },
};

// --- LLM Config Tab ---
function LLMConfigTab() {
  const [config, setConfig] = useState({
    api_key: "",
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 1024,
    system_prompt: "You are a helpful assistant.",
  });
  const [status, setStatus] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/llm/config`)
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setConfig((c) => ({
            ...c,
            model: data.model || c.model,
            temperature: data.temperature ?? c.temperature,
            max_tokens: data.max_tokens ?? c.max_tokens,
            system_prompt: data.system_prompt || c.system_prompt,
          }));
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const save = async () => {
    setStatus(null);
    try {
      const body = { ...config };
      if (!body.api_key) delete body.api_key; // don't overwrite with empty
      const res = await fetch(`${API_BASE}/llm/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus({ type: "success", text: "Configuration saved!" });
      setConfig((c) => ({ ...c, api_key: "" })); // clear key from form
    } catch {
      setStatus({ type: "error", text: "Failed to save configuration" });
    }
  };

  if (!loaded) return <div style={styles.card}>Loading...</div>;

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>LLM Configuration</div>
      {status && (
        <div style={{ ...styles.status, ...(status.type === "success" ? styles.statusSuccess : styles.statusError) }}>
          {status.text}
        </div>
      )}
      <div style={styles.formGroup}>
        <label style={styles.label}>OpenAI API Key</label>
        <input
          style={styles.input}
          type="password"
          placeholder="sk-..."
          value={config.api_key}
          onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
        />
        <span style={{ fontSize: 12, color: "#9ca3af" }}>Leave empty to keep existing key</span>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Model</label>
        <select style={styles.select} value={config.model} onChange={(e) => setConfig({ ...config, model: e.target.value })}>
          <option value="gpt-4o-mini">gpt-4o-mini</option>
          <option value="gpt-4o">gpt-4o</option>
          <option value="gpt-4-turbo">gpt-4-turbo</option>
          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ ...styles.formGroup, flex: 1 }}>
          <label style={styles.label}>Temperature ({config.temperature})</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={config.temperature}
            onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ ...styles.formGroup, flex: 1 }}>
          <label style={styles.label}>Max Tokens</label>
          <input
            style={styles.input}
            type="number"
            value={config.max_tokens}
            onChange={(e) => setConfig({ ...config, max_tokens: parseInt(e.target.value) || 1024 })}
          />
        </div>
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>System Prompt</label>
        <textarea
          style={styles.textarea}
          value={config.system_prompt}
          onChange={(e) => setConfig({ ...config, system_prompt: e.target.value })}
        />
      </div>
      <button style={styles.button} onClick={save}>
        Save Configuration
      </button>
    </div>
  );
}

// --- Knowledge Base Tab ---
function KnowledgeBaseTab() {
  const [sources, setSources] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  const loadSources = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/knowledge`);
      const data = await res.json();
      setSources(data.sources || []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    loadSources();
    const interval = setInterval(loadSources, 5000); // poll for status updates
    return () => clearInterval(interval);
  }, [loadSources]);

  const upload = async (file) => {
    setUploading(true);
    setStatus(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_BASE}/knowledge/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }
      setStatus({ type: "success", text: `"${file.name}" uploaded and processing...` });
      loadSources();
    } catch (e) {
      setStatus({ type: "error", text: e.message });
    }
    setUploading(false);
  };

  const deleteSource = async (id) => {
    try {
      await fetch(`${API_BASE}/knowledge/${id}`, { method: "DELETE" });
      loadSources();
    } catch {
      /* ignore */
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) upload(file);
  };

  const getBadgeStyle = (status) => {
    if (status === "ready") return styles.badgeReady;
    if (status === "processing") return styles.badgeProcessing;
    return styles.badgeFailed;
  };

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>Upload Documents</div>
        {status && (
          <div style={{ ...styles.status, ...(status.type === "success" ? styles.statusSuccess : styles.statusError) }}>
            {status.text}
          </div>
        )}
        <div
          style={styles.fileUpload}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("sc-file-input").click()}
        >
          <input
            id="sc-file-input"
            type="file"
            accept=".txt,.pdf,.csv"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          {uploading ? "Uploading..." : "Drop a file here or click to upload (.txt, .pdf, .csv)"}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Knowledge Sources ({sources.length})</div>
        {sources.length === 0 ? (
          <div style={{ color: "#9ca3af", fontSize: 14 }}>No documents uploaded yet.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Filename</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Chunks</th>
                <th style={styles.th}>Uploaded</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.id}>
                  <td style={styles.td}>{s.filename}</td>
                  <td style={styles.td}>{s.source_type}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...getBadgeStyle(s.status) }}>{s.status}</span>
                  </td>
                  <td style={styles.td}>{s.chunk_count}</td>
                  <td style={styles.td}>{s.created_at ? new Date(s.created_at).toLocaleDateString() : "-"}</td>
                  <td style={styles.td}>
                    <button style={styles.buttonDanger} onClick={() => deleteSource(s.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// --- Conversations Tab ---
function ConversationsTab() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/conversations`)
      .then((r) => r.json())
      .then((data) => setConversations(data.conversations || []))
      .catch(() => {});
  }, []);

  const viewMessages = async (conv) => {
    setSelectedConv(conv);
    try {
      const res = await fetch(`${API_BASE}/conversations/${conv.id}/messages`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      setMessages([]);
    }
  };

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>Conversations ({conversations.length})</div>
        {conversations.length === 0 ? (
          <div style={{ color: "#9ca3af", fontSize: 14 }}>No conversations yet.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Session ID</th>
                <th style={styles.th}>Started</th>
                <th style={styles.th}>Messages</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((c) => (
                <tr key={c.id}>
                  <td style={styles.td}>
                    <code style={{ fontSize: 12 }}>{c.session_id}</code>
                  </td>
                  <td style={styles.td}>{c.started_at ? new Date(c.started_at).toLocaleString() : "-"}</td>
                  <td style={styles.td}>{c.message_count}</td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.button, padding: "4px 12px", fontSize: 13 }}
                      onClick={() => viewMessages(c)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedConv && (
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={styles.cardTitle}>
              Conversation: <code style={{ fontSize: 13 }}>{selectedConv.session_id}</code>
            </div>
            <button
              style={{ ...styles.button, background: "#6b7280", padding: "4px 12px", fontSize: 13 }}
              onClick={() => setSelectedConv(null)}
            >
              Close
            </button>
          </div>
          {messages.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: 14 }}>No messages.</div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                style={{
                  ...styles.message,
                  ...(m.role === "user" ? styles.messageUser : styles.messageAssistant),
                }}
              >
                <strong style={{ fontSize: 12, color: "#6b7280" }}>{m.role}</strong>
                <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{m.content}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// --- Widget Settings Tab ---
function WidgetSettingsTab() {
  const [config, setConfig] = useState({
    primary_color: "#4F46E5",
    greeting: "Hi! How can I help you?",
    position: "bottom-right",
    logo_url: "",
  });
  const [embedCode, setEmbedCode] = useState("");
  const [status, setStatus] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/widget/config`)
      .then((r) => r.json())
      .then((data) => {
        setConfig({
          primary_color: data.primary_color || "#4F46E5",
          greeting: data.greeting || "",
          position: data.position || "bottom-right",
          logo_url: data.logo_url || "",
        });
        setEmbedCode(data.embed_code || "");
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const save = async () => {
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/widget/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus({ type: "success", text: "Widget settings saved!" });
    } catch {
      setStatus({ type: "error", text: "Failed to save widget settings" });
    }
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setStatus({ type: "success", text: "Embed code copied to clipboard!" });
  };

  if (!loaded) return <div style={styles.card}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>Widget Appearance</div>
        {status && (
          <div style={{ ...styles.status, ...(status.type === "success" ? styles.statusSuccess : styles.statusError) }}>
            {status.text}
          </div>
        )}
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Primary Color</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="color"
                value={config.primary_color}
                onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                style={{ width: 50, height: 36, padding: 0, border: "1px solid #d1d5db", borderRadius: 6 }}
              />
              <input
                style={{ ...styles.input, width: 100 }}
                value={config.primary_color}
                onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
              />
            </div>
          </div>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Position</label>
            <select
              style={styles.select}
              value={config.position}
              onChange={(e) => setConfig({ ...config, position: e.target.value })}
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
            </select>
          </div>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Greeting Message</label>
          <input
            style={styles.input}
            value={config.greeting}
            onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
            placeholder="Hi! How can I help you?"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Logo URL (optional)</label>
          <input
            style={styles.input}
            value={config.logo_url}
            onChange={(e) => setConfig({ ...config, logo_url: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
        </div>
        <button style={styles.button} onClick={save}>
          Save Settings
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Embed Code</div>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 12 }}>
          Copy and paste this code into your website to add the chat widget:
        </p>
        <div
          style={{
            background: "#1f2937",
            color: "#e5e7eb",
            padding: 16,
            borderRadius: 8,
            fontFamily: "monospace",
            fontSize: 13,
            overflowX: "auto",
            marginBottom: 12,
          }}
        >
          <code>{embedCode}</code>
        </div>
        <button style={styles.button} onClick={copyEmbedCode}>
          Copy to Clipboard
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Preview</div>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 12 }}>
          Open the test page to see the widget in action:
        </p>
        <a
          href="/test.html"
          target="_blank"
          style={{ ...styles.button, textDecoration: "none", display: "inline-block" }}
        >
          Open Test Page
        </a>
      </div>
    </div>
  );
}

// --- Database Connections Tab ---
function DBConnectionsTab() {
  const [connections, setConnections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingConn, setEditingConn] = useState(null);
  const [useConnectionString, setUseConnectionString] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    db_type: "postgresql",
    host: "",
    port: 5432,
    database: "",
    username: "",
    password: "",
    connection_string: "",
  });
  const [status, setStatus] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [expandedSchema, setExpandedSchema] = useState(null);
  const [schemaData, setSchemaData] = useState({});
  const [schemaSearch, setSchemaSearch] = useState("");
  const [expandedTables, setExpandedTables] = useState({});

  const toggleTable = (tableName) => {
    setExpandedTables((prev) => ({ ...prev, [tableName]: !prev[tableName] }));
  };

  const parseSchemaText = (text) => {
    if (!text) return [];
    const items = [];
    let current = null;
    for (const line of text.split("\n")) {
      const tableMatch = line.match(/^(?:Table|Collection):\s*(.+)/);
      if (tableMatch) {
        current = { name: tableMatch[1].trim(), fields: [] };
        items.push(current);
      } else if (current && line.trim().startsWith("-")) {
        const fieldMatch = line.trim().match(/^-\s*(\S+)\s*\(([^)]+)\)\s*(.*)/);
        if (fieldMatch) {
          current.fields.push({ name: fieldMatch[1], type: fieldMatch[2], extra: fieldMatch[3] || "" });
        }
      }
    }
    return items;
  };

  const getStructuredSchema = (connId, schemaInfoText) => {
    if (schemaData[connId]) return schemaData[connId];
    return parseSchemaText(schemaInfoText);
  };

  const loadConnections = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/db-connections`);
      const data = await res.json();
      setConnections(data.connections || []);
    } catch {}
  }, []);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      db_type: "postgresql",
      host: "",
      port: 5432,
      database: "",
      username: "",
      password: "",
      connection_string: "",
    });
    setEditingConn(null);
    setShowForm(false);
    setTestResult(null);
    setUseConnectionString(false);
  };

  const saveConnection = async () => {
    setStatus(null);
    try {
      const method = editingConn ? "PUT" : "POST";
      const url = editingConn
        ? `${API_BASE}/db-connections/${editingConn.id}`
        : `${API_BASE}/db-connections`;

      // Build payload based on connection mode
      const payload = {
        name: form.name,
        description: form.description,
        db_type: form.db_type,
      };

      if (useConnectionString && form.db_type === "mongodb") {
        // Connection string mode
        if (form.connection_string) {
          payload.connection_string = form.connection_string;
        }
      } else {
        // Individual fields mode
        payload.host = form.host;
        payload.port = form.port;
        payload.database = form.database;
        payload.username = form.username;
        if (form.password) {
          payload.password = form.password;
        }
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to save");
      }
      setStatus({ type: "success", text: "Connection saved!" });
      resetForm();
      loadConnections();
    } catch (e) {
      setStatus({ type: "error", text: e.message || "Failed to save connection" });
    }
  };

  const deleteConnection = async (id) => {
    if (!confirm("Delete this connection?")) return;
    try {
      await fetch(`${API_BASE}/db-connections/${id}`, { method: "DELETE" });
      loadConnections();
    } catch {}
  };

  const testConnection = async (id) => {
    setTestResult({ id, loading: true });
    try {
      const res = await fetch(`${API_BASE}/db-connections/${id}/test`, { method: "POST" });
      const data = await res.json();
      setTestResult({ id, ...data });
    } catch (e) {
      setTestResult({ id, success: false, message: "Request failed" });
    }
  };

  const fetchSchema = async (id) => {
    setStatus({ type: "success", text: "Fetching schema..." });
    try {
      const res = await fetch(`${API_BASE}/db-connections/${id}/fetch-schema`, { method: "POST" });
      const data = await res.json();
      if (data.status === "ok") {
        if (data.structured) {
          setSchemaData((prev) => ({ ...prev, [id]: data.structured }));
        }
        setStatus({ type: "success", text: "Schema fetched and saved!" });
        setExpandedSchema(id);
        loadConnections();
      } else {
        throw new Error(data.detail || "Failed");
      }
    } catch (e) {
      setStatus({ type: "error", text: `Failed to fetch schema: ${e.message}` });
    }
  };

  const editConnection = (conn) => {
    const hasConnectionString = conn.connection_string_set;
    setUseConnectionString(hasConnectionString);
    setForm({
      name: conn.name,
      description: conn.description || "",
      db_type: conn.db_type,
      host: conn.host || "",
      port: conn.port || getDefaultPort(conn.db_type),
      database: conn.database || "",
      username: conn.username || "",
      password: "",
      connection_string: "",
    });
    setEditingConn(conn);
    setShowForm(true);
  };

  const getDefaultPort = (dbType) => {
    if (dbType === "postgresql") return 5432;
    if (dbType === "mysql") return 3306;
    if (dbType === "mongodb") return 27017;
    return 5432;
  };

  return (
    <div>
      {status && (
        <div style={{ ...styles.status, ...(status.type === "success" ? styles.statusSuccess : styles.statusError), marginBottom: 16 }}>
          {status.text}
        </div>
      )}

      {showForm ? (
        <div style={styles.card}>
          <div style={styles.cardTitle}>{editingConn ? "Edit Connection" : "New Connection"}</div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Connection Name</label>
            <input
              style={styles.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Production Database"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Description (explains to AI what data is here)</label>
            <textarea
              style={styles.textarea}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g., Contains customer orders, products, inventory..."
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Database Type</label>
            <select
              style={styles.select}
              value={form.db_type}
              onChange={(e) => setForm({ ...form, db_type: e.target.value, port: getDefaultPort(e.target.value) })}
            >
              <option value="postgresql">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="mongodb">MongoDB</option>
            </select>
          </div>

          {form.db_type === "mongodb" && (
            <div style={{ ...styles.formGroup, marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={useConnectionString}
                  onChange={(e) => setUseConnectionString(e.target.checked)}
                />
                <span style={{ fontSize: 14 }}>Use connection string (for replica sets, special auth, etc.)</span>
              </label>
            </div>
          )}

          {useConnectionString && form.db_type === "mongodb" ? (
            <div style={styles.formGroup}>
              <label style={styles.label}>Connection String</label>
              <input
                style={styles.input}
                value={form.connection_string}
                onChange={(e) => setForm({ ...form, connection_string: e.target.value })}
                placeholder="mongodb://user:pass@host:port/database?authSource=..."
              />
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                {editingConn?.connection_string_set ? "Leave empty to keep existing" : "Full MongoDB URI"}
              </span>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ ...styles.formGroup, flex: 2 }}>
                  <label style={styles.label}>Host</label>
                  <input
                    style={styles.input}
                    value={form.host}
                    onChange={(e) => setForm({ ...form, host: e.target.value })}
                    placeholder="localhost or IP address"
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Port</label>
                  <input
                    style={styles.input}
                    type="number"
                    value={form.port}
                    onChange={(e) => setForm({ ...form, port: parseInt(e.target.value) || 5432 })}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Database Name</label>
                <input
                  style={styles.input}
                  value={form.database}
                  onChange={(e) => setForm({ ...form, database: e.target.value })}
                />
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Username</label>
                  <input
                    style={styles.input}
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Password</label>
                  <input
                    style={styles.input}
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={editingConn ? "(leave empty to keep existing)" : ""}
                  />
                </div>
              </div>
            </>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.button} onClick={saveConnection}>
              {editingConn ? "Update" : "Create"} Connection
            </button>
            <button
              style={{ ...styles.button, background: "#6b7280" }}
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={styles.cardTitle}>Database Connections ({connections.length})</div>
            <button style={styles.button} onClick={() => setShowForm(true)}>
              + Add Connection
            </button>
          </div>
          {connections.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: 14 }}>
              No database connections configured. Add one to let the AI query your business data.
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Connection</th>
                  <th style={styles.th}>Database</th>
                  <th style={styles.th}>Schema</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {connections.map((c) => (
                  <React.Fragment key={c.id}>
                    <tr>
                      <td style={styles.td}>
                        <strong>{c.name}</strong>
                        {c.description && <div style={{ fontSize: 12, color: "#6b7280" }}>{c.description.slice(0, 50)}...</div>}
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, background: "#e0e7ff", color: "#3730a3" }}>{c.db_type}</span>
                      </td>
                      <td style={styles.td}>
                        {c.connection_string_set ? (
                          <span style={{ color: "#6b7280", fontStyle: "italic" }}>Connection String</span>
                        ) : (
                          `${c.host}:${c.port}`
                        )}
                      </td>
                      <td style={styles.td}>{c.database}</td>
                      <td style={styles.td}>
                        {c.schema_info ? (
                          <span
                            style={{ ...styles.badge, ...styles.badgeReady, cursor: "pointer" }}
                            onClick={() => setExpandedSchema(expandedSchema === c.id ? null : c.id)}
                          >
                            {expandedSchema === c.id ? "▼ Hide" : "▶ View"}
                          </span>
                        ) : (
                          <span style={{ color: "#9ca3af" }}>—</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          <button
                            style={{ ...styles.button, padding: "4px 8px", fontSize: 12 }}
                            onClick={() => testConnection(c.id)}
                          >
                            {testResult?.id === c.id && testResult.loading ? "..." : "Test"}
                          </button>
                          <button
                            style={{ ...styles.button, padding: "4px 8px", fontSize: 12, background: "#10b981" }}
                            onClick={() => fetchSchema(c.id)}
                          >
                            Schema
                          </button>
                          <button
                            style={{ ...styles.button, padding: "4px 8px", fontSize: 12, background: "#6b7280" }}
                            onClick={() => editConnection(c)}
                          >
                            Edit
                          </button>
                          <button
                            style={{ ...styles.buttonDanger, padding: "4px 8px", fontSize: 12 }}
                            onClick={() => deleteConnection(c.id)}
                          >
                            ✕
                          </button>
                        </div>
                        {testResult?.id === c.id && !testResult.loading && (
                          <div style={{ marginTop: 4, fontSize: 12, color: testResult.success ? "#059669" : "#dc2626" }}>
                            {testResult.message}
                          </div>
                        )}
                      </td>
                    </tr>
                    {expandedSchema === c.id && c.schema_info && (() => {
                      const items = getStructuredSchema(c.id, c.schema_info);
                      const search = schemaSearch.toLowerCase();
                      const filtered = search
                        ? items.filter((t) =>
                            t.name.toLowerCase().includes(search) ||
                            t.fields.some((f) => f.name.toLowerCase().includes(search))
                          )
                        : items;
                      return (
                        <tr>
                          <td colSpan={6} style={{ padding: 0 }}>
                            <div style={{
                              margin: "0 16px 12px 16px",
                              padding: 16,
                              background: "#f9fafb",
                              border: "1px solid #e5e7eb",
                              borderRadius: 8,
                            }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                <div style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>
                                  {c.db_type === "mongodb" ? "Collections" : "Tables"} — {c.name}
                                  <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: 8 }}>({filtered.length})</span>
                                </div>
                                <input
                                  type="text"
                                  placeholder="Search tables or fields..."
                                  value={schemaSearch}
                                  onChange={(e) => setSchemaSearch(e.target.value)}
                                  style={{
                                    padding: "4px 10px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: 6,
                                    fontSize: 12,
                                    width: 220,
                                    outline: "none",
                                  }}
                                />
                              </div>
                              <div style={{ maxHeight: 400, overflowY: "auto" }}>
                                {filtered.length === 0 ? (
                                  <div style={{ color: "#9ca3af", fontSize: 13, padding: 8 }}>No matches found.</div>
                                ) : (
                                  filtered.map((table) => {
                                    const isOpen = expandedTables[table.name] !== false;
                                    const matchingFields = search
                                      ? table.fields.filter((f) => f.name.toLowerCase().includes(search))
                                      : table.fields;
                                    const showAllFields = table.name.toLowerCase().includes(search) || !search;
                                    const displayFields = showAllFields ? table.fields : matchingFields;
                                    return (
                                      <div key={table.name} style={{ marginBottom: 2 }}>
                                        <div
                                          onClick={() => toggleTable(table.name)}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            padding: "6px 8px",
                                            cursor: "pointer",
                                            borderRadius: 4,
                                            background: isOpen ? "#e0e7ff" : "transparent",
                                            transition: "background 0.1s",
                                          }}
                                          onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "#f3f4f6"; }}
                                          onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = "transparent"; }}
                                        >
                                          <span style={{ fontSize: 10, color: "#6b7280", width: 12 }}>{isOpen ? "▼" : "▶"}</span>
                                          <span style={{ fontWeight: 600, fontSize: 13, color: "#1f2937" }}>{table.name}</span>
                                          <span style={{ fontSize: 11, color: "#9ca3af" }}>({table.fields.length} fields)</span>
                                        </div>
                                        {isOpen && (
                                          <div style={{ marginLeft: 20, borderLeft: "2px solid #e5e7eb", paddingLeft: 12 }}>
                                            {displayFields.map((field) => (
                                              <div key={field.name} style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                padding: "3px 0",
                                                fontSize: 12,
                                              }}>
                                                <span style={{ color: "#374151", fontFamily: "'SF Mono', Monaco, monospace" }}>{field.name}</span>
                                                <span style={{
                                                  color: "#6b7280",
                                                  background: "#f3f4f6",
                                                  padding: "1px 6px",
                                                  borderRadius: 3,
                                                  fontSize: 11,
                                                }}>{field.type}</span>
                                                {field.extra && <span style={{ color: "#9ca3af", fontSize: 11 }}>{field.extra}</span>}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })()}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.cardTitle}>How It Works</div>
        <ol style={{ paddingLeft: 20, color: "#4b5563", fontSize: 14, lineHeight: 1.8 }}>
          <li><strong>Add a connection</strong> — Enter your database credentials</li>
          <li><strong>Test it</strong> — Make sure the connection works</li>
          <li><strong>Fetch schema</strong> — Let the AI understand your tables/collections</li>
          <li><strong>Chat!</strong> — Ask questions like "How many orders did we have last month?"</li>
        </ol>
        <p style={{ color: "#6b7280", fontSize: 13, marginTop: 12 }}>
          The AI will automatically generate and execute SQL/MongoDB queries to answer questions about your data.
          Only SELECT queries are allowed for safety.
        </p>
      </div>
    </div>
  );
}

// --- Main App ---
const TABS = [
  { key: "llm", label: "LLM Config" },
  { key: "knowledge", label: "Knowledge Base" },
  { key: "databases", label: "DB Connections" },
  { key: "widget", label: "Widget Settings" },
  { key: "conversations", label: "Conversations" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("llm");

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={styles.title}>SmartChat Admin</div>
        <div style={styles.subtitle}>Manage your AI chat system</div>
      </div>

      <div style={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            style={{
              ...styles.tab,
              ...(activeTab === tab.key ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "llm" && <LLMConfigTab />}
      {activeTab === "knowledge" && <KnowledgeBaseTab />}
      {activeTab === "databases" && <DBConnectionsTab />}
      {activeTab === "widget" && <WidgetSettingsTab />}
      {activeTab === "conversations" && <ConversationsTab />}
    </div>
  );
}
