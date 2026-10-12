import { site } from '../../config/site.js';

export default function TopStrip() {
  return (
    <div className="strip">
      <div className="wrap">
        <span className="addr">{site.address.short}</span>
        <a href={`tel:${site.phone}`}>Call {site.phoneDisplay}</a>
      </div>
    </div>
  );
}
