import { Link } from 'react-router-dom'
import Button from './Button'
import FeatureCard from './FeatureCard'
import StatCard from './StatCard'
import TestimonialCard from './TestimonialCard'

const HomePage = () => {
  const popularQuestions = [
    'What is Normalization?',
    'What are the Six Phases of Compiler?',
    'What is Parser?',
    'What is Microservices Architecture?',
    'Attendance requirements',
    'Scholarship details',
  ]

  const featureCards = [
    {
      icon: '◷',
      title: 'Academic Assistant',
      description:
        'Get help with coursework, syllabi, and academic planning from a single trusted interface.',
    },
    {
      icon: '◫',
      title: 'Placement Guidance',
      description:
        'Explore placement stories, interview prep, and internship resources for every department.',
    },
    {
      icon: '◌',
      title: 'Campus Events',
      description:
        'Stay updated on seminars, workshops, competitions, and campus happenings in real time.',
    },
    {
      icon: '✦',
      title: 'Assignments',
      description:
        'Track submission timelines, academic deadlines, and guidance without reading scattered notices.',
    },
    {
      icon: '◍',
      title: 'Library',
      description:
        'Find library rules, timings, resource access, and quick help for academic support.',
    },
    {
      icon: '◎',
      title: 'Department Information',
      description:
        'Access department-specific updates, contacts, and academic processes instantly.',
    },
    {
      icon: '⌂',
      title: 'Faculty Directory',
      description:
        'Reach faculty and office contacts with clear information and support pathways.',
    },
    {
      icon: '▣',
      title: 'Administrative Services',
      description:
        'Handle bonafide requests, scholarships, attendance concerns, and governance questions.',
    },
  ]

  return (
    <main>
      <section className="hero-section container">
        <div className="hero-copy">
          <p className="eyebrow">Intelligent campus support</p>
          <h1>
            Meet Your <span>Smart Campus Assistant</span>
          </h1>
          <p className="hero-text">
            One intelligent platform for students and faculty to access campus
            information, learning support, placement guidance, administrative
            services, and AI-powered assistance.
          </p>
          <div className="hero-actions">
            <Button to="/chat">Start Chat</Button>
            <Button to="/about" variant="secondary">
              Explore Features
            </Button>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="visual-card">
            <div className="visual-stack">
              <div className="visual-window" />
              <div className="visual-window alt" />
            </div>
            <div className="visual-laptop" />
            <div className="visual-notes" />
            <div className="visual-book" />
          </div>
        </div>
      </section>

      <section className="stats-section container">
        <StatCard value={18000} label="Students Assisted" suffix="+" />
        <StatCard value={850} label="Faculty Connected" suffix="+" />
        <StatCard value={120000} label="Questions Answered" suffix="+" />
        <StatCard value={24} label="Departments Supported" />
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <p className="eyebrow">What Campus-GPT offers</p>
          <h2>Designed for everyday campus life</h2>
        </div>
        <div className="feature-grid">
          {featureCards.map((card) => (
            <FeatureCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>

      <section className="container section-block split-section">
        <div className="split-panel">
          <div className="mini-illustration" />
        </div>
        <div className="split-panel copy-panel">
          <p className="eyebrow">Why Campus-GPT</p>
          <h2>Built to simplify the university experience</h2>
          <p>
            Traditional campus portals scatter information across notices,
            departments, and static pages. Campus-GPT brings it into one calm,
            intelligent experience with guidance that feels immediate and
            useful.
          </p>
          <ul className="check-list">
            <li>Instant answers for academic and administrative questions</li>
            <li>Clear pathways for placements, notices, and faculty support</li>
            <li>A friendly experience for both students and faculty</li>
          </ul>
        </div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <p className="eyebrow">Popular questions</p>
          <h2>Start with the topics students ask most</h2>
        </div>
        <div className="question-grid">
          {popularQuestions.map((item) => (
            <Link to="/chat" key={item} className="question-card">
              {item}
            </Link>
          ))}
        </div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <p className="eyebrow">Voices from campus</p>
          <h2>Trusted by students and faculty</h2>
        </div>
        <div className="testimonial-grid">
          <TestimonialCard
            name="Naina R."
            role="B.Tech Student • CSE"
            quote="The assistant helped me find placement guidance and department updates in minutes."
          />
          <TestimonialCard
            name="Prof. Arjun M."
            role="Head of Department • Electronics"
            quote="It feels like a polished academic portal, not just another chatbot."
          />
        </div>
      </section>
    </main>
  )
}

export default HomePage

