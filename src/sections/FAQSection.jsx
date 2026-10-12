import { useState } from 'react';
import { Link } from 'react-router-dom';
import { faqs } from '../data/faqs.js';
import { track } from '../utils/analytics.js';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null); // one answer open at a time

  const toggle = (e, i) => {
    e.preventDefault();
    if (openIndex === i) { setOpenIndex(null); return; }
    setOpenIndex(i);
    track('faq_open', { question: faqs[i].q.slice(0, 80) });
  };

  return (
    <section id="faq">
      <div className="wrap">
        <h2>Common questions</h2>
        <p className="intro">Quick answers before you ask. Cannot find yours? Call or message us.</p>
        <div className="faq">
          {faqs.map((item, i) => (
            <details key={item.q} open={openIndex === i}>
              <summary onClick={(e) => toggle(e, i)}>{item.q}</summary>
              {item.link ? (
                <p>{item.before}<Link to={item.link.to}>{item.link.text}</Link>{item.after}</p>
              ) : (
                <p>{item.a}</p>
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
