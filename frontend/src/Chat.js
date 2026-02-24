import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { 
  Send, 
  Plus, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  MessageSquare,
  Trash2,
  Copy,
  Check,
  Mic,
  Paperclip,
  Settings,
  Moon,
  Sun,
  Download,
  Share2
} from "lucide-react";
import "./Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [sessionId, setSessionId] = useState(() => {
    const stored = localStorage.getItem("sessionId");
    if (stored) return stored;
    const newId = uuidv4();
    localStorage.setItem("sessionId", newId);
    return newId;
  });

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/sessions/${sessionId}`)
      .then(res => setMessages(res.data))
      .catch(() => {});
  }, [sessionId]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setIsTyping(true);
    const userMessage = { role: "user", content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { sessionId, message: input }
      );

      const assistantMessage = {
        role: "assistant",
        content: res.data.reply,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      alert("Error generating response");
    } finally {
      setLoading(false);
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const newChat = () => {
    const newId = uuidv4();
    localStorage.setItem("sessionId", newId);
    setSessionId(newId);
    setMessages([]);
    chatContainerRef.current?.classList.add("fade-out");
    setTimeout(() => {
      chatContainerRef.current?.classList.remove("fade-out");
      chatContainerRef.current?.classList.add("fade-in");
    }, 300);
  };

  const copyToClipboard = async (text, index) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const exportChat = () => {
    const chatText = messages.map(m => 
      `[${formatTimestamp(m.timestamp)}] ${m.role.toUpperCase()}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${sessionId.slice(0,8)}.txt`;
    a.click();
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Animated Background */}
      <div className="background-gradient">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Main Chat Container */}
      <div className="chat-wrapper">
        {/* Header */}
        <div className="chat-header">
          <div className="header-left">
            <div className="logo-container">
              <div className="logo-icon">
                <Bot className="icon-glow" />
              </div>
              <div className="logo-text">
                <h1>AI Support Assistant</h1>
                <div className="status-indicator">
                  <span className="status-dot"></span>
                  <span className="status-text">Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="header-right">
            <button 
              className={`icon-button ${darkMode ? 'dark' : 'light'}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="icon" /> : <Moon className="icon" />}
            </button>
            <button 
              className="icon-button"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="icon" />
            </button>
            <button 
              className="new-chat-button"
              onClick={newChat}
            >
              <Plus className="icon" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel slide-down">
            <div className="settings-header">
              <h3>Settings</h3>
              <button onClick={() => setShowSettings(false)}>×</button>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <label>Theme</label>
                <select value={darkMode ? 'dark' : 'light'} onChange={(e) => setDarkMode(e.target.value === 'dark')}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Session ID</label>
                <div className="session-info">
                  <code>{sessionId}</code>
                  <button onClick={() => copyToClipboard(sessionId, -1)}>
                    <Copy className="icon-small" />
                  </button>
                </div>
              </div>
              {messages.length > 0 && (
                <button className="export-button" onClick={exportChat}>
                  <Download className="icon-small" />
                  Export Chat
                </button>
              )}
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="messages-container" ref={chatContainerRef}>
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <MessageSquare className="pulse-animation" />
              </div>
              <h2>Start a conversation</h2>
              <p>Ask me anything about our products or services</p>
              <div className="suggestion-chips">
                <button className="chip">What are your features?</button>
                <button className="chip">How can you help me?</button>
                <button className="chip">Tell me a joke</button>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`message-wrapper ${m.role === "user" ? "user-message" : "assistant-message"} slide-in`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="message-avatar">
                    {m.role === "user" ? (
                      <div className="user-avatar">
                        <User />
                      </div>
                    ) : (
                      <div className="assistant-avatar">
                        <Bot />
                      </div>
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">
                        {m.role === "user" ? "You" : "AI Assistant"}
                      </span>
                      {m.timestamp && (
                        <span className="message-time">
                          {formatTimestamp(m.timestamp)}
                        </span>
                      )}
                    </div>
                    <div className="message-bubble">
                      <div className="message-text">
                        {m.content}
                      </div>
                      <div className="message-actions">
                        <button
                          className="action-button"
                          onClick={() => copyToClipboard(m.content, i)}
                        >
                          {copiedIndex === i ? <Check /> : <Copy />}
                        </button>
                        <button className="action-button">
                          <Share2 />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="typing-indicator">
                  <div className="typing-avatar">
                    <Bot />
                  </div>
                  <div className="typing-bubble">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <button className="attach-button">
              <Paperclip className="icon" />
            </button>
            
            <div className="text-input-wrapper">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="text-input"
                rows="1"
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                }}
              />
              
              {input && (
                <button
                  className="clear-button"
                  onClick={() => setInput("")}
                >
                  <Trash2 />
                </button>
              )}
            </div>

            <button className="voice-button">
              <Mic className="icon" />
            </button>

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className={`send-button ${loading || !input.trim() ? 'disabled' : ''}`}
            >
              {loading ? (
                <Loader2 className="icon spin" />
              ) : (
                <Send className="icon" />
              )}
            </button>
          </div>
          
          <div className="input-footer">
            <div className="session-badge">
              <span className="badge-dot"></span>
              <span>Session: {sessionId.slice(0, 8)}...</span>
            </div>
            <div className="ai-badge">
              <Sparkles className="icon-small" />
              <span>AI-powered responses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;