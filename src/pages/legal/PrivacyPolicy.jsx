import LegalPage from '../../components/legal/LegalPage.jsx';
import { ROUTES } from '../../config/routes.js';
import CookieDetails from './CookieDetails.jsx';

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" description="How Corewell Infra Developers handles the details you send us." path={ROUTES.privacy} updated="10 October 2026">
      <p>This policy explains what happens to your details when you use the Corewell Infra Developers website and send us an enquiry. We keep it short and plain on purpose.</p>

      <h2>Who we are</h2>
      <p>Corewell Infra Developers, Arazi No. 19, Mahesh Nagar Colony, Nawalpur, Shivpur, Varanasi 221003, India. Phone: <a href="tel:+918533861394">+91 8533861394</a>. Email: <a href="mailto:hello@corewellinfra.in">hello@corewellinfra.in</a>.</p>

      <h2>What we collect and why</h2>
      <table>
      <tbody>
      <tr><th>What</th><th>Why</th></tr>
      <tr><td>Name, mobile number, city or site location, what you need, approximate area, when you need it, and your message</td><td>To reply to your enquiry, give you a price and arrange delivery</td></tr>
      <tr><td>Where you came from: the page you landed on, the website you came from, and campaign tags in the link (for example utm_source)</td><td>To learn which ads and links bring enquiries</td></tr>
      <tr><td>Your IP address, briefly</td><td>To block spam and abuse. It is not saved with your enquiry</td></tr>
      </tbody>
      </table>
      <p>We only collect what you type into the form and the technical details above. We do not ask for payment details on this website.</p>

      <h2>How we use your details</h2>
      <ul>
      <li>To call, WhatsApp or email you about your enquiry.</li>
      <li>To keep a record of enquiries so we can follow up.</li>
      <li>To understand which marketing works.</li>
      </ul>
      <p>We do not sell your details. We do not use them for anything unrelated to your enquiry without asking you first.</p>

      <h2>Who else handles your details</h2>
      <p>We use these services to run the website. They process data for us:</p>
      <ul>
      <li><b>Our website host</b> (for example Vercel, Netlify or Cloudflare) delivers the website to your device.</li>
      <li><b>Supabase</b> stores the details you send in the quote form (your name, phone number and location) in a secure database that only we can read.</li>
      <li><b>Cloudflare Turnstile</b>, if switched on, checks that a form is sent by a person and not a bot.</li>
      <li><b>WhatsApp</b>, only if you tap a WhatsApp button. Your chat is then covered by WhatsApp's own terms.</li>
      <li><b>Google Maps</b> shows our location, but only after you tap "Show map". Google may then receive your IP address and set cookies.</li>
      <li><b>Google Fonts</b> supplies the text style of this site. Google may receive your IP address when the page loads.</li>
      <li><b>Google Analytics</b>, only if you accept cookies on the banner.</li>
      </ul>
      <p>Some of these services keep data on servers outside India.</p>

      <h2>How long we keep it</h2>
      <p>We keep enquiry records for up to 24 months, then delete them. You can ask us to delete yours sooner.</p>

      <CookieDetails />

      <h2>Your rights</h2>
      <p>You can ask us to show you the details we hold about you, correct them, delete them, or stop contacting you. You can withdraw your consent at any time. Contact us using the phone number or email above. We will reply within 30 days. You may also nominate another person to use these rights for you if you die or cannot act. If you are not satisfied, you may complain to the Data Protection Board of India, as provided under the Digital Personal Data Protection Act, 2023.</p>

      <h2>Children</h2>
      <p>This website is for adults and businesses. Please do not send us details of anyone under 18.</p>

      <h2>Changes</h2>
      <p>If we change this policy we will update the date at the top of this page.</p>

      <h2>Contact and complaints</h2>
      <p>Questions or complaints about your details? Call <a href="tel:+918533861394">+91 8533861394</a> or email <a href="mailto:hello@corewellinfra.in">hello@corewellinfra.in</a>.</p>
    </LegalPage>
  );
}
