import LeadForm from '../components/quote/LeadForm.jsx';

export default function QuoteSection() {
  return (
    <section className="quote slant-b" id="quote">
      <div className="wrap split">
        <div className="qleft">
          <h2>Get a quote</h2>
          <ul className="steps">
            <li><b>1</b> Share your name, number and location</li>
            <li><b>2</b> We check stock and price</li>
            <li><b>3</b> We load and deliver</li>
          </ul>
        </div>
        <div className="formwrap">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
