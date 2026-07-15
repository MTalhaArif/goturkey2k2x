import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function ChatWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [errorText, setErrorText] = useState('');
  const bodyRef = useRef(null);

  const starters = [t('chatWidget.starter1'), t('chatWidget.starter2'), t('chatWidget.starter3')];

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setErrorText('');
    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null);
        setErrorText(data?.error || t('chatWidget.genericError'));
        setStreaming(false);
        return;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const result = await reader.read();
        done = result.done;
        if (result.value) {
          const chunk = decoder.decode(result.value, { stream: true });
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            updated[updated.length - 1] = { role: 'assistant', content: last.content + chunk };
            return updated;
          });
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setErrorText(t('chatWidget.genericError'));
    } finally {
      setStreaming(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <button
        className={`chat-bubble${open ? ' chat-bubble-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t('chatWidget.closeAria') : t('chatWidget.openAria')}
      >
        {open ? '✕' : (
          <>
            <span>{t('chatWidget.bubbleLabel')}</span>
            <span style={{ fontSize: '1.2em' }}>😊</span>
          </>
        )}
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <div>
              <div style={{ fontWeight: 700 }}>{t('chatWidget.panelTitle')}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>{t('chatWidget.panelSubtitle')}</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={t('chatWidget.closeAria')}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', lineHeight: 1 }}
            >
              ✕
            </button>
          </div>

          <div className="chat-panel-body" ref={bodyRef}>
            {messages.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {t('chatWidget.intro')}
                </p>
                {starters.map((starter) => (
                  <button key={starter} className="chat-starter" onClick={() => sendMessage(starter)}>
                    {starter}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role === 'user' ? 'chat-msg-user' : 'chat-msg-assistant'}`}>
                {m.content
                  ? m.content
                  : streaming && i === messages.length - 1 && (
                      <span className="chat-typing">
                        <span></span><span></span><span></span>
                      </span>
                    )}
              </div>
            ))}

            {errorText && (
              <div className="chat-msg chat-msg-assistant" style={{ borderColor: '#ef4444', color: '#b91c1c' }}>
                {errorText}
              </div>
            )}
          </div>

          <form className="chat-panel-footer" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder={t('chatWidget.inputPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={streaming}
            />
            <button type="submit" className="chat-send" disabled={streaming || !input.trim()} aria-label={t('chatWidget.sendAria')}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
