import FAQAccordion from './FAQAccordion'

const AboutPage = () => {
  const faqs = [
    {
      question: 'Who can use Campus-GPT?',
      answer:
        'Campus-GPT is built for students, faculty, and administrative teams across the university.',
    },
    {
      question: 'Is the assistant available on mobile?',
      answer:
        'Yes. The experience adapts smoothly for phones, tablets, and desktops with accessible controls.',
    },
    {
      question: 'Can the system answer department-specific questions?',
      answer:
        'Absolutely. It can provide guidance connected to departments, offices, notices, and academic procedures.',
    },
  ]

  return (
    <main className="container about-page">
      <section className="about-hero">
        <p className="eyebrow">About Campus-GPT</p>
        <h1>Designed to support the modern university community</h1>
        <p>
          Campus-GPT brings academic resources, campus knowledge, and
          administrative guidance together in a calm and intuitive experience.
        </p>
      </section>

      <section className="about-grid">
        <article className="info-card">
          <h3>Our Mission</h3>
          <p>
            Make campus support clearer, faster, and more human through
            thoughtful AI assistance.
          </p>
        </article>
        <article className="info-card">
          <h3>Our Vision</h3>
          <p>
            Build a digital campus experience that feels welcoming, organized,
            and deeply useful.
          </p>
        </article>
        <article className="info-card">
          <h3>How It Works</h3>
          <p>
            Users ask natural questions and receive context-rich support drawn
            from academic and campus information.
          </p>
        </article>
        <article className="info-card">
          <h3>Technology Stack</h3>
          <p>
            React, Vite, modern routing, responsive design systems, and polished
            UI interactions.
          </p>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Frequently asked questions</p>
          <h2>Everything you need to know</h2>
        </div>
        <FAQAccordion items={faqs} />
      </section>
    </main>
  )
}

export default AboutPage;
