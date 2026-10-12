import { features } from '../data/features.jsx';

export default function FeaturesStrip() {
  return (
    <section className="feat" aria-label="Why Corewell">
      <div className="wrap">
        {features.map((f) => (
          <div className="f" key={f.lines.join(' ')}>
            <svg viewBox="0 0 24 24" aria-hidden="true">{f.icon}</svg>
            {f.lines[0]}<br />{f.lines[1]}
          </div>
        ))}
      </div>
    </section>
  );
}
