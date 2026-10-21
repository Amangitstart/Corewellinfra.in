import { Outlet } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';
import TopStrip from './TopStrip.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import FloatingActions from './FloatingActions.jsx';
import CookieBanner from './CookieBanner.jsx';
import ContactActionModal from './ContactActionModal.jsx';

// The frame around every page: top bar, header, footer and the always-visible buttons.
export default function Layout() {
  return (
    <>
      <ProgressBar />
      <a className="skip" href="#main">Skip to content</a>
      <TopStrip />
      <Header />
      <Outlet />
      <Footer />
      <CookieBanner />
      <FloatingActions />
      <ContactActionModal />
    </>
  );
}
