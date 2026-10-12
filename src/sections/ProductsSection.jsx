import { products, productsIntro } from '../data/products.js';

export default function ProductsSection({ onViewPhotos }) {
  return (
    <section id="products">
      <div className="wrap">
        <h2>{productsIntro.title}</h2>
        <p className="intro">{productsIntro.text}</p>
        <div className="cards">
          {products.map((p) => (
            <div className="card" key={p.title}>
              <span className="sw" style={{ background: p.color }}></span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <a className="clink" href="#quote">Ask for price <span aria-hidden="true">&rarr;</span></a>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 28 }}>
          <button className="btn more" type="button" onClick={onViewPhotos}>View all photos</button>
        </p>
      </div>
    </section>
  );
}
