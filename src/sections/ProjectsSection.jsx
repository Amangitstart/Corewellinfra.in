import { useEffect, useRef, useState } from 'react';
import PhotoGallery from '../components/common/PhotoGallery.jsx';
import Lightbox from '../components/common/Lightbox.jsx';
import { projectPhotos, projectVideos, projectsIntro } from '../data/photos.js';

function ProjectVideo({ video }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.play().catch(() => {
          // Some browsers still require an interaction before playback.
        });
      } else {
        element.pause();
      }
    }, { threshold: 0.45 });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <article className="project-video">
      <video ref={videoRef} autoPlay muted controls preload="metadata" playsInline>
        <source src={video.src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h3>{video.title}</h3>
      <p>{video.description}</p>
    </article>
  );
}

export default function ProjectsSection() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section id="projects">
      <div className="gdec" aria-hidden="true"><i></i><i></i></div>
      <div className="wrap">
        <h2>{projectsIntro.title}</h2>
        <p className="intro">{projectsIntro.text}</p>
        <PhotoGallery photos={projectPhotos} onOpen={setOpenIndex} />
        <div className="project-videos" aria-label="Project videos">
          {projectVideos.map((video) => (
            <ProjectVideo video={video} key={video.src} />
          ))}
        </div>
      </div>
      <Lightbox photos={projectPhotos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </section>
  );
}
