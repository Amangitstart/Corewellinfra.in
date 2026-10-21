import { services, servicesIntro } from '../data/services.jsx';

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
        </div>
      </div>
    </section>
  );
}
