import LeadForm from '../components/quote/LeadForm.jsx';

export default function QuoteSection() {
  return (
    <section className="quote slant-b" id="quote">
      <div className="wrap split">
        <div className="qleft">
          <h2>Get a quote</h2>
        </div>
        <div className="formwrap">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
