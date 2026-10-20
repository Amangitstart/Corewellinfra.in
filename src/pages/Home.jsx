import HeroSection from '../sections/HeroSection.jsx';
import FeaturesStrip from '../sections/FeaturesStrip.jsx';
import ServicesSection from '../sections/ServicesSection.jsx';
import ProjectsSection from '../sections/ProjectsSection.jsx';
import ProductsSection from '../sections/ProductsSection.jsx';
import YardSection from '../sections/YardSection.jsx';
import QuoteSection from '../sections/QuoteSection.jsx';
import ClientsSection from '../sections/ClientsSection.jsx';
import FAQSection from '../sections/FAQSection.jsx';
import ContactSection from '../sections/ContactSection.jsx';
import FeedbackSection from '../sections/FeedbackSection.jsx';
import EmailSection from '../sections/EmailSection.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import useScrollReveal from '../hooks/useScrollReveal.js';
import { site } from '../config/site.js';

export default function Home() {
  usePageMeta({ title: null, description: site.description, path: '/' });
  useScrollReveal();

  return (
    <main id="main">
      <HeroSection />
      <FeaturesStrip />
      <ServicesSection />
      <ProjectsSection />
      <ProductsSection />
      <YardSection />
      <QuoteSection />
      <ClientsSection />
      <FAQSection />
      <ContactSection />
      <FeedbackSection />
      <EmailSection />
    </main>
  );
}
