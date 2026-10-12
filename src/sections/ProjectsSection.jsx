import { useState } from 'react';
import PhotoGallery from '../components/common/PhotoGallery.jsx';
import Lightbox from '../components/common/Lightbox.jsx';
import { projectPhotos, projectsIntro } from '../data/photos.js';

export default function ProjectsSection() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section id="projects">
      <div className="gdec" aria-hidden="true"><i></i><i></i></div>
      <div className="wrap">
        <h2>{projectsIntro.title}</h2>
        <p className="intro">{projectsIntro.text}</p>
        <PhotoGallery photos={projectPhotos} onOpen={setOpenIndex} />
        <div className="ctaband">
          <div>
            <b>Planning a project?</b>
            <span>Share your name, number and location. We will call you with a price.</span>
          </div>
          <a className="btn" href="#quote">Get a quote</a>
        </div>
      </div>
      <Lightbox photos={projectPhotos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </section>
  );
}
