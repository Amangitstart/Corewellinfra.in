import LegalPage from '../../components/legal/LegalPage.jsx';
import { ROUTES } from '../../config/routes.js';

export default function Refunds() {
  return (
    <LegalPage title="Refund and Cancellation Policy" description="Refund and cancellation rules for Corewell Infra Developers orders." path={ROUTES.refunds} updated="10 October 2026">
      <p>This policy covers materials we supply, such as paver blocks, sand and gravel. Construction, rental and real estate work follows the written agreement for that job.</p>
      <h2>Cancelling an order</h2>
      <ul>
      <li>You can cancel before we load or dispatch your order. We will refund any advance you paid.</li>
      <li>Once material is loaded or delivered, the order cannot be cancelled unless the material is faulty or wrong, as below.</li>
      <li>Special or made-to-order items cannot be cancelled once production starts.</li>
      </ul>
      <h2>Faulty or wrong material</h2>
      <ul>
      <li>Check the material when it arrives. If it is damaged, faulty or not what you ordered, tell us within 48 hours of delivery and send clear photos on WhatsApp.</li>
      <li>We will inspect it and, if the problem is confirmed, replace the affected quantity or refund it.</li>
      <li>Small colour or shade differences between batches are normal and are not a fault.</li>
      <li>We cannot take back material that has been laid, cut, used or damaged after delivery.</li>
      </ul>
      <h2>How refunds are paid</h2>
      <p>Approved refunds are paid back to the same account or method you used, within 7 working days of approval.</p>
      <h2>Contact</h2>
      <p>To cancel or report a problem, call <a href="tel:+918533861394">+91 8533861394</a> or message us on WhatsApp.</p>
    </LegalPage>
  );
}
