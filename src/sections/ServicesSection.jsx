import { services, servicesIntro } from '../data/services.jsx';
import { site, whatsappLink } from '../config/site.js';

export default function ServicesSection() {
  return (
    <section id="services">
      <div className="wrap">
        <h2>{servicesIntro.title}</h2>
        <p className="intro">{servicesIntro.text}</p>
        <div className="cards">
          {services.map((s) => (
            <div className="card" key={s.title}>
              <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">{s.icon}</svg>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <a className="clink" href="#quote">Get a quote <span aria-hidden="true">&rarr;</span></a>
            </div>
          ))}
          <div className="card talk">
            <h3>Not sure what you need?</h3>
            <p>Call us or message on WhatsApp and we will help you choose.</p>
            <div className="tbtns">
              <a className="btn" href={`tel:${site.phone}`}>Call now</a>
              <a className="btn wa" href={whatsappLink(`Hello ${site.name}, I need some help.`)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
