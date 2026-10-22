import { useCallback, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { askQuestion, deleteStudentChatHistoryItem, getApiErrorMessage, getStudentChatHistory, logoutUser } from '../api/client'
import { LoadingSpinner } from './LoadingSpinner'
import { useNavigate } from 'react-router-dom'

const suggestedPrompts = [
  'Placement preparation',
  'Course information',
  'Library timings',
  'Campus regulations',
]

const exploreTopics = ['Academics', 'Placements', 'Departments', 'Campus Services']

function friendlyChatError(error) {
  if (error.response?.status === 401 || error.response?.status === 403) {
    return 'Your student session is no longer available. Please sign in again.'
  }
  if (error.response?.status >= 500) {
    return "Campus-GPT couldn't complete that request. The assistant may be temporarily unavailable."
  }
  return getApiErrorMessage(error)
}

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState('')
  const [activeHistoryId, setActiveHistoryId] = useState(null)
  const [deletingHistoryId, setDeletingHistoryId] = useState(null)
  const messageAreaRef = useRef(null)
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  const refreshHistory = useCallback(async () => {
    try {
      const items = await getStudentChatHistory()
      setHistory(items)
      setHistoryError('')
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logoutUser()
        navigate('/student/login')
        return
      }
      setHistoryError('Chat history could not be loaded.')
    } finally {
      setHistoryLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    refreshHistory()
  }, [refreshHistory])

  useEffect(() => {
    const messageArea = messageAreaRef.current
    if (!messageArea) return

    const distanceFromBottom = messageArea.scrollHeight - messageArea.scrollTop - messageArea.clientHeight
    if (distanceFromBottom < 180) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading])

  function startNewChat() {
    setMessages([])
    setInput('')
    setActiveHistoryId(null)
  }

  function openHistoryItem(item) {
    setActiveHistoryId(item.id)
    setMessages([
      { role: 'user', text: item.query },
      {
        role: 'assistant',
        text: item.status === 'failed'
          ? item.error || "Campus-GPT couldn't complete that request."
          : item.answer || 'Campus-GPT is still processing this question.',
        error: item.status === 'failed',
        pending: item.status === 'pending',
      },
    ])
  }

  async function deleteHistoryItem(item) {
    const confirmed = window.confirm('Delete this saved chat? This cannot be undone.')
    if (!confirmed) return

    setDeletingHistoryId(item.id)
    setHistoryError('')
    try {
      await deleteStudentChatHistoryItem(item.id)
      setHistory((previous) => previous.filter((entry) => entry.id !== item.id))
      if (activeHistoryId === item.id) {
        setActiveHistoryId(null)
        setMessages([])
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logoutUser()
        navigate('/student/login')
        return
      }
      setHistoryError(error.response?.status === 404
        ? 'That saved chat was already removed.'
        : 'This saved chat could not be deleted. Please try again.')
      refreshHistory()
    } finally {
      setDeletingHistoryId(null)
    }
  }

  async function submitQuestion(question) {
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion || loading) return

    setMessages((previous) => [...previous, { role: 'user', text: trimmedQuestion }])
    setInput('')
    setActiveHistoryId(null)
    setLoading(true)

    try {
      const data = await askQuestion(trimmedQuestion)
      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          text: data.answer,
          source: data.source,
          sourcesUsed: data.sources_used,
        },
      ])
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          text: friendlyChatError(error),
          error: true,
          retryQuestion: trimmedQuestion,
        },
      ])
    } finally {
      setLoading(false)
      refreshHistory()
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    submitQuestion(input)
  }

  function handleComposerKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submitQuestion(input)
    }
  }

  return (
    <main className="container chat-shell">
      <aside className="sidebar-card">
        <div className="sidebar-header">
          <div>
            <p className="panel-kicker">Workspace</p>
            <h3>Campus-GPT</h3>
          </div>
          <button type="button" className="sidebar-new-chat" onClick={startNewChat}>New chat</button>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-label">Recent</p>
          {historyLoading ? (
            <div className="history-loading"><LoadingSpinner size="small" label="Loading chat history" /><span>Loading history...</span></div>
          ) : historyError ? (
            <div className="history-error"><span>{historyError}</span><button type="button" onClick={refreshHistory}>Retry</button></div>
          ) : history.length ? (
            <ul className="sidebar-list muted-list">
              {history.map((item) => (
                <li key={item.id}>
                  <div className="history-item-row">
                    <button type="button" className={`history-item-open ${activeHistoryId === item.id ? 'active' : ''}`} onClick={() => openHistoryItem(item)} title={item.query}>
                      <span>{item.query}</span>
                      <small>{new Date(item.created_at).toLocaleDateString()}</small>
                    </button>
                    <button
                      type="button"
                      className="history-item-delete"
                      onClick={() => deleteHistoryItem(item)}
                      disabled={deletingHistoryId === item.id}
                      aria-label={`Delete saved chat: ${item.query}`}
                      title="Delete saved chat"
                    >
                      {deletingHistoryId === item.id ? '…' : '×'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="history-empty">Your questions will appear here.</p>
          )}
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-label">Explore</p>
          <ul className="sidebar-list topic-list">
            {exploreTopics.map((topic) => <li key={topic}>{topic}</li>)}
          </ul>
        </div>
      </aside>

      <section className="chat-card">
        <div className="chat-header">
          <div>
            <p className="eyebrow">AI campus assistant</p>
            <h2>How can I help you today?</h2>
          </div>
          <div className="chat-status"><span /> Campus AI · Online</div>
        </div>

        <div className="message-area" ref={messageAreaRef}>
          {messages.length === 0 && (
            <div className="chat-empty-state">
              <div className="empty-state-mark" aria-hidden="true">✦</div>
              <h3>Ask about your campus</h3>
              <p>Get help with academics, placements, campus services, departments, or university information.</p>
              <div className="empty-prompt-grid">
                {suggestedPrompts.map((prompt) => (
                  <button key={prompt} type="button" onClick={() => setInput(prompt)}>{prompt}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`message-row ${message.role === 'user' ? 'user' : 'assistant'}`}>
              <div className="message-content">
                <span className="message-author">{message.role === 'user' ? 'You' : 'Campus-GPT'}</span>
                <div className={`message-bubble ${message.role === 'user' ? 'user' : message.error ? 'error' : ''}`}>
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                  {message.role === 'assistant' && !message.error && (
                    <div className="message-meta">
                      <span>{message.source === 'campus_documents' ? 'From campus documents' : 'General knowledge'}</span>
                      {message.sourcesUsed?.length > 0 && <span>Sources: {message.sourcesUsed.join(', ')}</span>}
                    </div>
                  )}
                  {message.error && message.retryQuestion && (
                    <button type="button" className="retry-button" onClick={() => submitQuestion(message.retryQuestion)} disabled={loading}>
                      Try again
                    </button>
                  )}
                  {message.pending && <p className="history-pending">This response is still being processed.</p>}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="message-content">
                <span className="message-author">Campus-GPT</span>
                <div className="message-bubble thinking-bubble">
                  <span>Retrieving relevant information</span>
                  <div className="typing" aria-label="Campus-GPT is thinking"><span /><span /><span /></div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="prompt-row">
          {suggestedPrompts.map((prompt) => (
            <button key={prompt} type="button" onClick={() => setInput(prompt)} disabled={loading}>{prompt}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="composer">
          <textarea
            rows="1"
            placeholder="Ask about placements, academics, library timings..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            disabled={loading}
            aria-label="Ask Campus-GPT a question"
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {loading ? <><LoadingSpinner size="small" label="Sending" /> Sending</> : 'Send'}
          </button>
        </form>
        <p className="composer-hint">Press Enter to send · Shift + Enter for a new line</p>
      </section>
    </main>
  )
}
