import { useMemo, useState } from 'react';
import { site } from '../../config/site.js';
import { faqs } from '../../data/faqs.js';

const quickQuestions = ['What services do you offer?', 'How do I get a price?', 'Where are you located?'];

function answerQuestion(question) {
  const text = question.toLowerCase();
  const matchingFaq = faqs.find((faq) => {
    const words = faq.q.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3);
    return words.filter((word) => text.includes(word)).length >= 2;
  });

  if (matchingFaq?.a) return matchingFaq.a;
  if (/hello|hi|hey|good morning|good evening/.test(text)) return `Hello! I can help with Corewell Infra Developers' services, products, pricing, delivery and location.`;
  if (/service|construction|build|road|civil|real estate|rental|equipment/.test(text)) return 'We provide building construction, road and civil work, paver blocks, sand, gravel, real estate services and construction equipment rental without an operator.';
  if (/price|cost|quote|quotation|rate/.test(text)) return 'For a price, use the quote form or WhatsApp. Tell us what you need, the approximate area and your site location. We usually reply the same day.';
  if (/paver|block|colour|color|sand|gravel|aggregate/.test(text)) return 'We have red and grey interlocking pavers. Sand, gravel and aggregate are also available with an order.';
  if (/where|location|address|visit|map|located/.test(text)) return `We are at ${site.address.full}. You can use the Location pin in the navigation bar to open Google Maps.`;
  if (/deliver|delivery|transport|load/.test(text)) return 'Yes. We load orders at our yard and deliver by tractor-trolley. Share your site location so we can confirm delivery.';
  if (/contact|phone|call|whatsapp|email|reach/.test(text)) return `You can call ${site.phoneDisplay}, WhatsApp us, or email ${site.email}.`;
  if (/project|work|client|photo|video/.test(text)) return 'You can view our recent projects, site work videos and client visits in the Projects and Clients sections.';
  return 'I can help with services, paver blocks, pricing, delivery, equipment rental, projects, contact details and our location. What would you like to know?';
}

export default function SiteChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: `Hi! I’m Corewell’s assistant. Ask me about our services, products, pricing or location.` },
  ]);
  const suggestions = useMemo(() => quickQuestions, []);

  const sendMessage = (question = input) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    setMessages((current) => [...current, { from: 'user', text: cleanQuestion }, { from: 'bot', text: answerQuestion(cleanQuestion) }]);
    setInput('');
  };

  return (
    <div className={`site-chatbot${open ? ' is-open' : ''}`}>
      {open && (
        <section className="chat-panel" aria-label="Corewell assistant">
          <div className="chat-heading">
            <div><strong>Corewell assistant</strong><span>Answers from our website</span></div>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>
          <div className="chat-messages" aria-live="polite">
            {messages.map((message, index) => <p className={`chat-message ${message.from}`} key={`${message.from}-${index}`}>{message.text}</p>)}
          </div>
          <div className="chat-suggestions">
            {suggestions.map((question) => <button type="button" key={question} onClick={() => sendMessage(question)}>{question}</button>)}
          </div>
          <form className="chat-form" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question..." aria-label="Ask the assistant" />
            <button type="submit" aria-label="Send question">Send</button>
          </form>
        </section>
      )}
      <button className="chat-launch" type="button" onClick={() => setOpen((visible) => !visible)} aria-label={open ? 'Close assistant' : 'Open assistant'} aria-expanded={open}>💬</button>
    </div>
  );
}
