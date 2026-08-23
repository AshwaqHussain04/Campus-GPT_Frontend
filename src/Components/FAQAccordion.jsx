import { useState } from 'react'

export default function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = index === openIndex
        return (
          <div className={`faq-item ${isOpen ? 'open' : ''}`} key={item.question}>
            <button className="faq-question" onClick={() => setOpenIndex(isOpen ? -1 : index)}>
              <span>{item.question}</span>
              <span>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <p className="faq-answer">{item.answer}</p>}
          </div>
        )
      })}
    </div>
  )
}
