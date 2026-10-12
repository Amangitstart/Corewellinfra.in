import { Link } from 'react-router-dom';
import LegalPage from '../../components/legal/LegalPage.jsx';
import { ROUTES } from '../../config/routes.js';

export default function Terms() {
  return (
    <LegalPage title="Terms and Conditions" description="Terms for using the Corewell Infra Developers website and asking for a quote." path={ROUTES.terms} updated="10 October 2026">
      <p>These terms apply when you use the Corewell Infra Developers website and ask us for a quote. By using the site you agree to them.</p>
      <h2>About us</h2>
      <p>Corewell Infra Developers, Arazi No. 19, Mahesh Nagar Colony, Nawalpur, Shivpur, Varanasi 221003, India. Phone: <a href="tel:+918533861394">+91 8533861394</a>.</p>
      <h2>Quotes and orders</h2>
      <ul>
      <li>A quote request on this website is an enquiry. It is not an order and it does not bind either side.</li>
      <li>A price is valid only when we confirm it to you in writing (WhatsApp or email). Prices, stock and delivery time can change before that.</li>
      <li>An order is confirmed only when we confirm it in writing and any agreed advance is received.</li>
      <li>Construction, civil, rental and real estate work is done under a separate written agreement or work order with its own terms.</li>
      </ul>
      <h2>Products and photos</h2>
      <p>Photos on this site are for illustration. Colour, size and finish of paver blocks and materials can differ slightly from the photos and between batches. Please check the sample or stock before you order.</p>
      <h2>Payment and delivery</h2>
      <p>We do not take payments on this website. Payment terms, delivery charges and delivery dates are agreed with you when we confirm your order. Delivery times are estimates.</p>
      <h2>Use of this website</h2>
      <ul>
      <li>Please give correct details in the form. Do not misuse the site or try to break it.</li>
      <li>The text and photos on this site belong to Corewell Infra Developers. Please do not copy them without asking us.</li>
      </ul>
      <h2>Our responsibility</h2>
      <p>We try to keep this website correct and available, but we do not promise that it will always be error-free. To the extent the law allows, we are not responsible for loss caused by using this website. Nothing here limits your rights under Indian consumer law.</p>
      <h2>Law</h2>
      <p>These terms are governed by Indian law. Courts at Varanasi have jurisdiction, subject to any rights you have under law.</p>
      <h2>Contact</h2>
      <p>Questions? Call <a href="tel:+918533861394">+91 8533861394</a> or email <a href="mailto:hello@corewellinfra.in">hello@corewellinfra.in</a>. See also our <Link to={ROUTES.privacy}>Privacy Policy</Link> and <Link to={ROUTES.refunds}>Refund and Cancellation Policy</Link>.</p>
    </LegalPage>
  );
}
