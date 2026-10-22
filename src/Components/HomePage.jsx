import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStoredUserName, getTokenRole } from '../api/client'
import Button from './Button'
import FeatureCard from './FeatureCard'

const featureCards = [
  {
    icon: '✦',
    title: 'AI campus assistant',
    description: 'Ask questions about academic information, placements, departments, and campus services.',
  },
  {
    icon: '▣',
    title: 'Official knowledge sources',
    description: 'Use uploaded PDF and TXT documents as the knowledge base behind campus answers.',
  },
  {
    icon: '◎',
    title: 'Context-aware retrieval',
    description: 'Relevant indexed content helps the assistant respond with more useful campus context.',
  },
  {
    icon: '◌',
    title: 'Secure access',
    description: 'Student and admin experiences are separated through backend-issued role authentication.',
  },
  {
    icon: '◷',
    title: 'Academic support',
    description: 'Find guidance for coursework, syllabi, regulations, and other academic questions.',
  },
  {
    icon: '⌂',
    title: 'Campus services',
    description: 'Explore information about library timings, administrative processes, and campus policies.',
  },
]

const howItWorks = [
  ['01', 'Ask a question', 'Start with a natural-language question about campus life or academics.'],
  ['02', 'Search the knowledge base', 'Campus-GPT looks through the available official campus sources.'],
  ['03', 'Retrieve relevant context', 'The most useful document content is passed into the response flow.'],
  ['04', 'Receive an answer', 'The assistant returns a contextual answer and source information when available.'],
]

function ProductFlowVisual() {
  return (
    <div className="product-visual" aria-label="Campus-GPT question and answer flow">
      <div className="product-visual-topline">
        <span className="visual-status-dot" />
        <span>Campus-GPT</span>
        <span className="visual-status">Campus AI</span>
      </div>
      <div className="visual-question">
        <span className="visual-label">STUDENT QUESTION</span>
        <strong>What&apos;s the exam registration deadline?</strong>
      </div>
      <div className="visual-connector" aria-hidden="true">↓</div>
      <div className="visual-source">
        <span className="visual-source-icon">PDF</span>
        <div>
          <span className="visual-label">KNOWLEDGE RETRIEVAL</span>
          <strong>Found in official campus knowledge</strong>
        </div>
        <span className="visual-check">✓</span>
      </div>
      <div className="visual-answer">
        <span className="visual-label">AI RESPONSE</span>
        <p>Registration closes on 28 September. Check the official examination notice for the complete process.</p>
      </div>
      <div className="visual-tags">
        <span>PDF knowledge</span>
        <span>RAG search</span>
        <span>AI answer</span>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [userName, setUserName] = useState(() => getStoredUserName())
  const [userRole, setUserRole] = useState(() => getTokenRole())

  useEffect(() => {
    const syncAuth = () => {
      setUserName(getStoredUserName())
      setUserRole(getTokenRole())
    }

    window.addEventListener('campusgpt-auth-change', syncAuth)
    return () => window.removeEventListener('campusgpt-auth-change', syncAuth)
  }, [])

  const chatRoute = userRole === 'student' ? '/chat' : '/student/login'

  return (
    <main>
      <section className="hero-section container">
        <div className="hero-copy">
          <p className="eyebrow">Intelligent campus support</p>
          <h1>
            Meet your <span>smart campus assistant</span>
          </h1>
          <p className="hero-text">
            {userRole
              ? `Welcome back, ${userName}. Campus-GPT is ready to help you find useful campus information.`
              : 'Campus-GPT helps students access academic information, campus services, placement guidance, department information, and official campus knowledge through an AI-powered assistant.'}
          </p>
          <div className="hero-actions">
            <Button to={chatRoute}>Start chat</Button>
            <a href="#capabilities" className="campus-btn campus-btn-secondary">Explore features</a>
          </div>
        </div>

        <div className="hero-visual">
          <ProductFlowVisual />
        </div>
      </section>

      <section className="capability-strip container" aria-label="Campus-GPT capabilities">
        <article><strong>PDF + TXT</strong><span>Knowledge sources</span></article>
        <article><strong>RAG</strong><span>Context-aware retrieval</span></article>
        <article><strong>JWT</strong><span>Secure authentication</span></article>
        <article><strong>24/7</strong><span>Campus assistance</span></article>
      </section>

      <section className="container section-block" id="capabilities">
        <div className="section-heading">
          <p className="eyebrow">What Campus-GPT offers</p>
          <h2>Useful support for everyday campus questions</h2>
        </div>
        <div className="feature-grid">
          {featureCards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2>From a question to a contextual answer</h2>
        </div>
        <div className="how-it-works-grid">
          {howItWorks.map(([number, title, description]) => (
            <article className="process-card" key={number}>
              <span className="process-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section-block knowledge-section">
        <div className="knowledge-copy">
          <p className="eyebrow">Built around campus knowledge</p>
          <h2>Answers grounded in the sources your campus provides</h2>
          <p>
            Campus-GPT uses official campus knowledge sources to provide more relevant answers. Admins can upload supported documents, and students can ask questions through the protected assistant.
          </p>
          <div className="knowledge-flow" aria-label="Knowledge flow">
            <span>Official documents</span><b>→</b><span>Document processing</span><b>→</b><span>Knowledge index</span><b>→</b><span>Campus-GPT</span>
          </div>
        </div>
        <div className="knowledge-panel">
          <div className="knowledge-panel-line"><span>01</span><strong>Official documents</strong></div>
          <div className="knowledge-panel-line"><span>02</span><strong>Processed campus content</strong></div>
          <div className="knowledge-panel-line"><span>03</span><strong>Relevant answer context</strong></div>
        </div>
      </section>

      <section className="container final-cta">
        <div>
          <p className="eyebrow">Your campus, easier to navigate</p>
          <h2>Ready to explore your campus knowledge?</h2>
        </div>
        <Link to={chatRoute} className="campus-btn campus-btn-primary">Start chat</Link>
      </section>
    </main>
  )
}
