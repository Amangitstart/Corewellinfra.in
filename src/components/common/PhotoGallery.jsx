import { useRef } from 'react';
import useInView from '../../hooks/useInView.js';
import useParallax from '../../hooks/useParallax.js';

function GalleryItem({ photo, index, onOpen }) {
  const [ref, seen] = useInView();
  return (
    <figure ref={ref} className={`pf${seen ? ' in' : ''}`} style={{ '--d': `${(index % 3) * 90}ms` }}>
      <button type="button" className="pfi" aria-label={`View larger: ${photo.alt}`} onClick={() => onOpen(index)}>
        <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
      </button>
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}

// A masonry photo grid. Clicking a photo calls onOpen(index) so the page can show the Lightbox.
export default function PhotoGallery({ photos, onOpen }) {
  const ref = useRef(null);
  useParallax(ref);
  return (
    <div className="mason gal" ref={ref}>
      {photos.map((photo, i) => (
        <GalleryItem key={photo.src} photo={photo} index={i} onOpen={onOpen} />
      ))}
    </div>
  );
}
