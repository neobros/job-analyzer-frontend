import { useEffect, useRef, useState } from 'react';
import { LoaderCircle, Send, X } from 'lucide-react';
import { apiRequest } from '../api.js';
import aiAgentAvatar from '../assets/ai-agent-avatar.jpeg';

const GREETING = "Hi! I'm the LiveInAus Assistant. Ask me about jobs, listings, categories, or how the platform works.";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, sending, open]);

  function openFromTeaser() {
    setOpen(true);
  }

  async function sendMessage(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setSending(true);

    try {
      const data = await apiRequest('/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, history: nextMessages.slice(-8) })
      });
      setMessages((current) => [...current, { role: 'assistant', content: data.reply }]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-widget">
      {open ? (
        <div className="chat-panel" role="dialog" aria-label="LiveInAus Assistant chat">
          <div className="chat-panel-header">
            <span>
              <span className={`chat-avatar ${sending ? 'chat-avatar-live' : ''}`}>
                <img src={aiAgentAvatar} alt="" />
                <span className="chat-live-dot" aria-hidden="true" />
              </span>
              LiveInAus Assistant
            </span>
            <button type="button" className="icon-button" aria-label="Close chat" onClick={() => setOpen(false)}><X size={17} /></button>
          </div>
          <div className="chat-panel-messages" ref={listRef}>
            {messages.map((entry, index) => (
              <div key={index} className={`chat-bubble ${entry.role}`}>{entry.content}</div>
            ))}
            {sending ? <div className="chat-bubble assistant chat-typing"><LoaderCircle size={15} className="spin" /> Thinking...</div> : null}
          </div>
          {error ? <div className="chat-panel-error">{error}</div> : null}
          <form className="chat-panel-input" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about LiveInAus..."
              maxLength={1000}
              disabled={sending}
            />
            <button type="submit" className="icon-button" aria-label="Send message" disabled={sending || !input.trim()}>
              <Send size={17} />
            </button>
          </form>
        </div>
      ) : null}
      {!open ? (
        <button type="button" className="chat-teaser" onClick={openFromTeaser}>
          Ask LiveInAus...
        </button>
      ) : null}
      <button type="button" className="chat-launcher" onClick={() => setOpen((current) => !current)} aria-label={open ? 'Close chat' : 'Open LiveInAus Assistant chat'}>
        <span className="chat-launcher-ring" aria-hidden="true" />
        <img src={aiAgentAvatar} alt="" className="chat-launcher-avatar" />
        <span className="chat-live-dot chat-live-dot-launcher" aria-hidden="true" />
      </button>
    </div>
  );
}
