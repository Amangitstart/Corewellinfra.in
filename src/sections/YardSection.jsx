import { yardFacts, yardIntro } from '../data/yard.jsx';
import { site } from '../config/site.js';

export default function YardSection() {
  return (
    <section className="yard" id="yard">
      <div className="wrap">
        <h2>{yardIntro.title}</h2>
        <p className="intro">{yardIntro.text}</p>
        <ul className="yfacts">
          {yardFacts.map((f) => (
            <li key={f.text}><svg viewBox="0 0 24 24" aria-hidden="true">{f.icon}</svg>{f.text}</li>
          ))}
        </ul>
        <p className="yact">
          <a className="btn" href="#quote">Get a quote</a>
          <a className="btn more" href={`tel:${site.phone}`}>Call now</a>
        </p>
      </div>
    </section>
  );
}
