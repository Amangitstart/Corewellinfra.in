import { useState } from 'react';
import HeroSection from '../sections/HeroSection.jsx';
import FeaturesStrip from '../sections/FeaturesStrip.jsx';
import ServicesSection from '../sections/ServicesSection.jsx';
import ProjectsSection from '../sections/ProjectsSection.jsx';
import ProductsSection from '../sections/ProductsSection.jsx';
import WorkSection from '../sections/WorkSection.jsx';
import YardSection from '../sections/YardSection.jsx';
import QuoteSection from '../sections/QuoteSection.jsx';
import ClientsSection from '../sections/ClientsSection.jsx';
import FAQSection from '../sections/FAQSection.jsx';
import ContactSection from '../sections/ContactSection.jsx';
import FeedbackSection from '../sections/FeedbackSection.jsx';
import EmailSection from '../sections/EmailSection.jsx';
import Lightbox from '../components/common/Lightbox.jsx';
import { stockViewerPhotos } from '../data/photos.js';
import usePageMeta from '../hooks/usePageMeta.js';
import useScrollReveal from '../hooks/useScrollReveal.js';
import { site } from '../config/site.js';

export default function Home() {
  usePageMeta({ title: null, description: site.description, path: '/' });
  useScrollReveal();
  const [stockIndex, setStockIndex] = useState(null); // "View all photos" viewer

  return (
    <>
      <main id="main">
        <HeroSection onViewPhotos={() => setStockIndex(0)} />
        <FeaturesStrip />
        <ServicesSection />
        <ProjectsSection />
        <ProductsSection onViewPhotos={() => setStockIndex(0)} />
        <WorkSection />
        <YardSection />
        <QuoteSection />
        <ClientsSection />
        <FAQSection />
        <ContactSection />
        <FeedbackSection />
        <EmailSection />
      </main>
      <Lightbox photos={stockViewerPhotos} index={stockIndex} onChange={setStockIndex} onClose={() => setStockIndex(null)} />
    </>
  );
}
