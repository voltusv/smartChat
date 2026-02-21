import React, { useState, useEffect, useCallback } from "react";

const API_BASE = "/api/admin";

function tenantQuery(tenantId) {
  return tenantId ? `?tenant_id=${tenantId}` : "";
}

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
function LLMConfigTab({ tenantId }) {
  const [config, setConfig] = useState({
    provider: "openai",
    api_key: "",
    base_url: "",
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 1024,
    system_prompt: "You are a helpful assistant.",
  });
  const [status, setStatus] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [ollamaModels, setOllamaModels] = useState([]);
  const [fetchingModels, setFetchingModels] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/llm/config${tenantQuery(tenantId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setConfig((c) => ({
            ...c,
            provider: data.provider || "openai",
            base_url: data.base_url || "",
            model: data.model || c.model,
            temperature: data.temperature ?? c.temperature,
            max_tokens: data.max_tokens ?? c.max_tokens,
            system_prompt: data.system_prompt || c.system_prompt,
          }));
          // Auto-fetch Ollama models if provider is ollama
          if (data.provider === "ollama") {
            fetchOllamaModels(data.base_url || "http://localhost:11434");
          }
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [tenantId]);

  const fetchOllamaModels = async (url) => {
    setFetchingModels(true);
    try {
      const base = url || config.base_url || "http://localhost:11434";
      const res = await fetch(`${API_BASE}/llm/ollama-models?base_url=${encodeURIComponent(base)}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to fetch models");
      }
      const data = await res.json();
      setOllamaModels(data.models || []);
      if (data.models?.length > 0 && !data.models.includes(config.model)) {
        setConfig((c) => ({ ...c, model: data.models[0] }));
      }
    } catch (e) {
      setStatus({ type: "error", text: `Ollama: ${e.message}` });
      setOllamaModels([]);
    }
    setFetchingModels(false);
  };

  const save = async () => {
    setStatus(null);
    try {
      const body = { ...config };
      if (!body.api_key) delete body.api_key; // don't overwrite with empty
      const res = await fetch(`${API_BASE}/llm/config${tenantQuery(tenantId)}`, {
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

  const isOllama = config.provider === "ollama";

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
        <label style={styles.label}>Provider</label>
        <select
          style={styles.select}
          value={config.provider}
          onChange={(e) => {
            const p = e.target.value;
            setConfig((c) => ({
              ...c,
              provider: p,
              model: p === "openai" ? "gpt-4o-mini" : (ollamaModels[0] || ""),
              base_url: p === "ollama" ? (c.base_url || "http://localhost:11434") : "",
            }));
            if (p === "ollama") fetchOllamaModels(config.base_url || "http://localhost:11434");
          }}
        >
          <option value="openai">OpenAI</option>
          <option value="ollama">Ollama (Local)</option>
        </select>
      </div>

      {isOllama ? (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Ollama URL</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ ...styles.input, flex: 1 }}
                value={config.base_url}
                onChange={(e) => setConfig({ ...config, base_url: e.target.value })}
                placeholder="http://localhost:11434"
              />
              <button
                style={{ ...styles.button, whiteSpace: "nowrap" }}
                onClick={() => fetchOllamaModels(config.base_url)}
                disabled={fetchingModels}
              >
                {fetchingModels ? "Fetching..." : "Fetch Models"}
              </button>
            </div>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>
              Make sure Ollama is running. Install models with: ollama pull llama3.2
            </span>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Model</label>
            {ollamaModels.length > 0 ? (
              <select style={styles.select} value={config.model} onChange={(e) => setConfig({ ...config, model: e.target.value })}>
                {ollamaModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            ) : (
              <input
                style={styles.input}
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                placeholder="e.g., llama3.2, mistral, codellama"
              />
            )}
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
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
function KnowledgeBaseTab({ tenantId }) {
  const [sources, setSources] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  const loadSources = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/knowledge${tenantQuery(tenantId)}`);
      const data = await res.json();
      setSources(data.sources || []);
    } catch {
      /* ignore */
    }
  }, [tenantId]);

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
      const res = await fetch(`${API_BASE}/knowledge/upload${tenantQuery(tenantId)}`, {
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
function ConversationsTab({ tenantId }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/conversations${tenantQuery(tenantId)}`)
      .then((r) => r.json())
      .then((data) => setConversations(data.conversations || []))
      .catch(() => {});
  }, [tenantId]);

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
function WidgetSettingsTab({ tenantId }) {
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
    fetch(`${API_BASE}/widget/config${tenantQuery(tenantId)}`)
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
  }, [tenantId]);

  const save = async () => {
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/widget/config${tenantQuery(tenantId)}`, {
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
          href={`${window.location.protocol}//${window.location.hostname}:8000/test.html`}
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
function DBConnectionsTab({ tenantId }) {
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
      const res = await fetch(`${API_BASE}/db-connections${tenantQuery(tenantId)}`);
      const data = await res.json();
      setConnections(data.connections || []);
    } catch {}
  }, [tenantId]);

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
        : `${API_BASE}/db-connections${tenantQuery(tenantId)}`;

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

// --- API Keys Tab ---
function APIKeysTab({ activeTenantId, onTenantChange }) {
  const [tenants, setTenants] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [status, setStatus] = useState(null);
  const [revealedKey, setRevealedKey] = useState(null); // { id, key }

  const loadTenants = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/tenants`);
      const data = await res.json();
      setTenants(data.tenants || []);
    } catch {}
  }, []);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const createTenant = async () => {
    if (!newName.trim()) return;
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/tenants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to create tenant");
      const data = await res.json();
      setRevealedKey({ id: data.id, key: data.api_key });
      setStatus({ type: "success", text: `Tenant "${newName}" created! Copy the API key below — it won't be shown again.` });
      setNewName("");
      setShowCreate(false);
      loadTenants();
    } catch (e) {
      setStatus({ type: "error", text: e.message });
    }
  };

  const regenerateKey = async (tenantId, tenantName) => {
    if (!confirm(`Regenerate API key for "${tenantName}"? The old key will stop working immediately.`)) return;
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/tenants/${tenantId}/regenerate-key`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to regenerate key");
      const data = await res.json();
      setRevealedKey({ id: tenantId, key: data.api_key });
      setStatus({ type: "success", text: `New API key generated for "${tenantName}". Copy it below — it won't be shown again.` });
      loadTenants();
    } catch (e) {
      setStatus({ type: "error", text: e.message });
    }
  };

  const deleteTenant = async (tenantId, tenantName) => {
    if (!confirm(`Delete tenant "${tenantName}" and ALL associated data (configs, conversations, knowledge base)? This cannot be undone.`)) return;
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/tenants/${tenantId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to delete");
      }
      setStatus({ type: "success", text: `Tenant "${tenantName}" deleted.` });
      if (activeTenantId === tenantId && tenants.length > 1) {
        const remaining = tenants.find((t) => t.id !== tenantId);
        if (remaining) onTenantChange(remaining.id);
      }
      loadTenants();
    } catch (e) {
      setStatus({ type: "error", text: e.message });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setStatus({ type: "success", text: "Copied to clipboard!" });
  };

  const getEmbedCode = (apiKey) => {
    return `<script src="${window.location.protocol}//${window.location.hostname}:8000/widget.js" data-api-key="${apiKey}"></script>`;
  };

  return (
    <div>
      {status && (
        <div style={{ ...styles.status, ...(status.type === "success" ? styles.statusSuccess : styles.statusError), marginBottom: 16 }}>
          {status.text}
        </div>
      )}

      {revealedKey && (
        <div style={{ ...styles.card, background: "#fffbeb", borderColor: "#f59e0b" }}>
          <div style={{ ...styles.cardTitle, color: "#92400e" }}>New API Key (save it now!)</div>
          <div style={{
            background: "#1f2937",
            color: "#10b981",
            padding: 12,
            borderRadius: 6,
            fontFamily: "'SF Mono', Monaco, monospace",
            fontSize: 13,
            marginBottom: 12,
            wordBreak: "break-all",
          }}>
            {revealedKey.key}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.button} onClick={() => copyToClipboard(revealedKey.key)}>
              Copy Key
            </button>
            <button style={styles.button} onClick={() => copyToClipboard(getEmbedCode(revealedKey.key))}>
              Copy Embed Code
            </button>
            <button
              style={{ ...styles.button, background: "#6b7280" }}
              onClick={() => setRevealedKey(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={styles.cardTitle}>API Keys & Tenants ({tenants.length})</div>
          <button style={styles.button} onClick={() => setShowCreate(true)}>
            + Create Tenant
          </button>
        </div>

        {showCreate && (
          <div style={{ background: "#f9fafb", padding: 16, borderRadius: 8, marginBottom: 16, border: "1px solid #e5e7eb" }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tenant Name</label>
              <input
                style={styles.input}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., My Website, Client Name"
                onKeyDown={(e) => e.key === "Enter" && createTenant()}
                autoFocus
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={styles.button} onClick={createTenant}>Create</button>
              <button style={{ ...styles.button, background: "#6b7280" }} onClick={() => { setShowCreate(false); setNewName(""); }}>Cancel</button>
            </div>
          </div>
        )}

        {tenants.length === 0 ? (
          <div style={{ color: "#9ca3af", fontSize: 14 }}>No tenants found. Create one to get started.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>API Key</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id} style={activeTenantId === t.id ? { background: "#eff6ff" } : {}}>
                  <td style={styles.td}>
                    <strong>{t.name}</strong>
                    {activeTenantId === t.id && (
                      <span style={{ ...styles.badge, ...styles.badgeReady, marginLeft: 8 }}>active</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <code style={{ fontSize: 12, color: "#6b7280" }}>{t.api_key_preview}</code>
                    <button
                      style={{ marginLeft: 8, background: "none", border: "1px solid #d1d5db", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: 11 }}
                      onClick={() => copyToClipboard(t.api_key_preview)}
                      title="Only the masked preview is available. Regenerate to get a new full key."
                    >
                      Copy
                    </button>
                  </td>
                  <td style={styles.td}>{t.created_at ? new Date(t.created_at).toLocaleDateString() : "-"}</td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {activeTenantId !== t.id && (
                        <button
                          style={{ ...styles.button, padding: "4px 8px", fontSize: 12, background: "#10b981" }}
                          onClick={() => onTenantChange(t.id)}
                        >
                          Set Active
                        </button>
                      )}
                      <button
                        style={{ ...styles.button, padding: "4px 8px", fontSize: 12, background: "#f59e0b" }}
                        onClick={() => regenerateKey(t.id, t.name)}
                      >
                        Regenerate
                      </button>
                      <button
                        style={{ ...styles.buttonDanger, padding: "4px 8px", fontSize: 12 }}
                        onClick={() => deleteTenant(t.id, t.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>How API Keys Work</div>
        <ul style={{ paddingLeft: 20, color: "#4b5563", fontSize: 14, lineHeight: 1.8 }}>
          <li>Each <strong>tenant</strong> gets its own API key, LLM config, knowledge base, and widget settings</li>
          <li>Use the <strong>API key</strong> in the widget embed code on your website</li>
          <li>The <strong>active tenant</strong> is the one you manage in the other tabs (LLM Config, Knowledge Base, etc.)</li>
          <li><strong>Regenerating</strong> a key invalidates the old one immediately — update your embed code</li>
        </ul>
      </div>
    </div>
  );
}

// --- Auth Config Tab ---
function AuthConfigTab({ tenantId }) {
  const [config, setConfig] = useState({
    auth_mode: "none",
    login_url: "",
    login_method: "POST",
    email_field: "email",
    password_field: "password",
    response_user_id_path: "user._id",
    response_token_path: "token",
    response_name_path: "",
    response_email_path: "",
  });
  const [status, setStatus] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/auth/config${tenantQuery(tenantId)}`)
      .then((r) => r.json())
      .then((data) => {
        setConfig({
          auth_mode: data.auth_mode || "none",
          login_url: data.login_url || "",
          login_method: data.login_method || "POST",
          email_field: data.email_field || "email",
          password_field: data.password_field || "password",
          response_user_id_path: data.response_user_id_path || "user._id",
          response_token_path: data.response_token_path || "token",
          response_name_path: data.response_name_path || "",
          response_email_path: data.response_email_path || "",
        });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [tenantId]);

  const save = async () => {
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/auth/config${tenantQuery(tenantId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus({ type: "success", text: "Auth configuration saved!" });
    } catch {
      setStatus({ type: "error", text: "Failed to save auth configuration" });
    }
  };

  const generateSecret = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/generate-secret${tenantQuery(tenantId)}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to generate");
      setStatus({ type: "success", text: "JWT secret generated!" });
    } catch {
      setStatus({ type: "error", text: "Failed to generate JWT secret" });
    }
  };

  if (!loaded) return <div style={styles.card}>Loading...</div>;

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>User Authentication</div>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
          Configure how users authenticate with the chat widget.
        </p>
        {status && (
          <div style={{ ...styles.status, ...(status.type === "success" ? styles.statusSuccess : styles.statusError) }}>
            {status.text}
          </div>
        )}
        <div style={styles.formGroup}>
          <label style={styles.label}>Authentication Mode</label>
          <select
            style={styles.select}
            value={config.auth_mode}
            onChange={(e) => setConfig({ ...config, auth_mode: e.target.value })}
          >
            <option value="none">None - Anonymous chat allowed</option>
            <option value="embedded_only">Embedded Only - Require user context from host site</option>
            <option value="external_api">External API - Widget shows login form</option>
          </select>
        </div>

        {config.auth_mode === "external_api" && (
          <>
            <div style={{ background: "#f9fafb", padding: 16, borderRadius: 8, marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>External Login API</div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Login URL</label>
                <input
                  style={styles.input}
                  value={config.login_url}
                  onChange={(e) => setConfig({ ...config, login_url: e.target.value })}
                  placeholder="https://your-app.com/api/auth/login"
                />
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Method</label>
                  <select
                    style={styles.select}
                    value={config.login_method}
                    onChange={(e) => setConfig({ ...config, login_method: e.target.value })}
                  >
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ background: "#f9fafb", padding: 16, borderRadius: 8, marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Request Fields</div>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Email Field Name</label>
                  <input
                    style={styles.input}
                    value={config.email_field}
                    onChange={(e) => setConfig({ ...config, email_field: e.target.value })}
                    placeholder="email"
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Password Field Name</label>
                  <input
                    style={styles.input}
                    value={config.password_field}
                    onChange={(e) => setConfig({ ...config, password_field: e.target.value })}
                    placeholder="password"
                  />
                </div>
              </div>
            </div>

            <div style={{ background: "#f9fafb", padding: 16, borderRadius: 8, marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Response Mapping (JSON paths)</div>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>User ID Path *</label>
                  <input
                    style={styles.input}
                    value={config.response_user_id_path}
                    onChange={(e) => setConfig({ ...config, response_user_id_path: e.target.value })}
                    placeholder="user._id"
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Token Path</label>
                  <input
                    style={styles.input}
                    value={config.response_token_path}
                    onChange={(e) => setConfig({ ...config, response_token_path: e.target.value })}
                    placeholder="token"
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>User Name Path (optional)</label>
                  <input
                    style={styles.input}
                    value={config.response_name_path}
                    onChange={(e) => setConfig({ ...config, response_name_path: e.target.value })}
                    placeholder="user.name"
                  />
                </div>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Email Path (optional)</label>
                  <input
                    style={styles.input}
                    value={config.response_email_path}
                    onChange={(e) => setConfig({ ...config, response_email_path: e.target.value })}
                    placeholder="user.email"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button style={styles.button} onClick={save}>
            Save Configuration
          </button>
          <button
            style={{ ...styles.button, background: "#6b7280" }}
            onClick={generateSecret}
          >
            Generate JWT Secret
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>How It Works</div>
        <div style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8 }}>
          <p><strong>None:</strong> Anyone can chat without authentication.</p>
          <p><strong>Embedded Only:</strong> Widget only works when embedded with user context (data-user-id attribute).</p>
          <p><strong>External API:</strong> Widget shows login form. Credentials are sent to your API, response is used to identify the user.</p>
        </div>
      </div>
    </div>
  );
}

// --- Main App ---
const TABS = [
  { key: "apikeys", label: "API Keys" },
  { key: "llm", label: "LLM Config" },
  { key: "auth", label: "Authentication" },
  { key: "knowledge", label: "Knowledge Base" },
  { key: "databases", label: "DB Connections" },
  { key: "widget", label: "Widget Settings" },
  { key: "conversations", label: "Conversations" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("apikeys");
  const [activeTenantId, setActiveTenantId] = useState(() => {
    return localStorage.getItem("smartchat_active_tenant") || null;
  });

  // Load initial tenant if none set
  useEffect(() => {
    if (!activeTenantId) {
      fetch(`${API_BASE}/tenants`)
        .then((r) => r.json())
        .then((data) => {
          if (data.tenants?.length > 0) {
            setActiveTenantId(data.tenants[0].id);
            localStorage.setItem("smartchat_active_tenant", data.tenants[0].id);
          }
        })
        .catch(() => {});
    }
  }, [activeTenantId]);

  const handleTenantChange = (id) => {
    setActiveTenantId(id);
    localStorage.setItem("smartchat_active_tenant", id);
  };

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

      {activeTab === "apikeys" && <APIKeysTab activeTenantId={activeTenantId} onTenantChange={handleTenantChange} />}
      {activeTab === "llm" && <LLMConfigTab tenantId={activeTenantId} />}
      {activeTab === "auth" && <AuthConfigTab tenantId={activeTenantId} />}
      {activeTab === "knowledge" && <KnowledgeBaseTab tenantId={activeTenantId} />}
      {activeTab === "databases" && <DBConnectionsTab tenantId={activeTenantId} />}
      {activeTab === "widget" && <WidgetSettingsTab tenantId={activeTenantId} />}
      {activeTab === "conversations" && <ConversationsTab tenantId={activeTenantId} />}
    </div>
  );
}
