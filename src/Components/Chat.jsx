import { useState, useRef, useEffect } from 'react'
import { askQuestion } from '../api/client'
import ReactMarkdown from 'react-markdown'

const suggestedPrompts = [
  'Explain Operating Systems',
  'Placement interview tips',
  'Bonafide process',
  'Library timings',
]

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I can help with academics, placements, notices, department information, and administrative support. What would you like to know today?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSubmit(e) {
    e.preventDefault()
    const question = input.trim()
    if (!question || loading) return

    setMessages((prev) => [...prev, { role: 'user', text: question }])
    setInput('')
    setLoading(true)

    try {
      const data = await askQuestion(question)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer,
          source: data.source,
          sourcesUsed: data.sources_used,
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Something went wrong. Please try again.', error: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container chat-shell">
      <aside className="sidebar-card">
        <div className="sidebar-header">
          <h3>Campus-GPT</h3>
          <button type="button">New Chat</button>
        </div>
        <div className="sidebar-section">
          <p>Recent Conversations</p>
          <ul>
            <li>Placement prep</li>
            <li>Library hours</li>
            <li>Bonafide application</li>
          </ul>
        </div>
        <div className="sidebar-section">
          <p>Departments</p>
          <ul>
            <li>CSE</li>
            <li>Mechanical</li>
            <li>Commerce</li>
          </ul>
        </div>
      </aside>

      <section className="chat-card">
        <div className="chat-header">
          <div>
            <p className="eyebrow">AI Assistant</p>
            <h2>Ask anything about campus</h2>
          </div>
          <div className="chat-badge">Live support</div>
        </div>

        <div className="message-area">
          {messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.role === 'user' ? 'user' : 'assistant'}`}>
              <div className={`message-bubble ${msg.role === 'user' ? 'user' : msg.error ? 'error' : ''}`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
                {msg.role === 'assistant' && !msg.error && (
                  <div className="message-meta">
                    <span>{msg.source === 'campus_documents' ? 'From campus documents' : 'General knowledge'}</span>
                    {msg.sourcesUsed?.length > 0 && <span>Source: {msg.sourcesUsed.join(', ')}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="message-bubble typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="prompt-row">
          {suggestedPrompts.map((prompt) => (
            <button key={prompt} type="button" onClick={() => setInput(prompt)}>
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="composer">
          <input
            type="text"
            placeholder="Ask about placements, notices, library timings, or academics…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </section>
    </main>
  )
}