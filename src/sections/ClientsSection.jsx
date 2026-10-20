import { useState } from 'react';
import PhotoGallery from '../components/common/PhotoGallery.jsx';
import Lightbox from '../components/common/Lightbox.jsx';
import { clientPhotos, clientsIntro } from '../data/photos.js';

export default function ClientsSection() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section id="clients">
      <div className="wrap">
        <h2>{clientsIntro.title}</h2>
        <p className="intro">{clientsIntro.text}</p>
        <PhotoGallery photos={clientPhotos} onOpen={setOpenIndex} variant="clients-gallery" />
      </div>
      <Lightbox photos={clientPhotos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </section>
  );
}
