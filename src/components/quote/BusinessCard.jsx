import { useEffect, useRef, useState } from 'react';
import BusinessCardSvg from './BusinessCardSvg.jsx';
import { site, whatsappLink } from '../../config/site.js';
import { SITE_URL } from '../../config/env.js';
import { track } from '../../utils/analytics.js';
import { cardFileName, downloadBlob, makePng } from '../../utils/cardExport.js';

// The business card shown after the form is sent.
export default function BusinessCard() {
  const svgRef = useRef(null);
  const pngPromise = useRef(null);
  const [busy, setBusy] = useState(null); // name of the running action, or null
  const [status, setStatus] = useState({ text: '', kind: '' });

  const siteUrl = (SITE_URL || window.location.origin) + '/';
  const message = `${site.name} - construction, real estate and infrastructure in Varanasi. Call ${site.phoneDisplay}. Our website: ${siteUrl}`;

  // Make the PNG once and keep it ready for download.
  const getPng = () => {
    if (!pngPromise.current) {
      pngPromise.current = makePng(svgRef.current);
      pngPromise.current.catch(() => { pngPromise.current = null; });
    }
    return pngPromise.current;
  };
  useEffect(() => { getPng().catch(() => {}); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const say = (text, kind = '') => setStatus({ text, kind });
  const failed = (what) => say(`Sorry, ${what} did not work. Please try again or use Share on WhatsApp.`, 'err');

  // Runs one action with a busy state so the buttons cannot be double-clicked.
  async function run(name, startMessage, action) {
    if (busy) return;
    setBusy(name);
    say(startMessage);
    try { await action(); } catch (error) { if (error?.name === 'AbortError') say(''); else if (error?.name === 'NotAllowedError') say('Your browser needs a fresh tap to open sharing. Please tap Share once more.', 'err'); else { console.warn('Card action failed', error); failed(name); } }
    setBusy(null);
  }

  const downloadImage = () => run('creating the image', 'Creating your image...', async () => {
    downloadBlob(await getPng(), cardFileName('png'));
    track('card_download_png');
    say(`Saved as ${cardFileName('png')}.`, 'ok');
  });

  const label = (name, text) => (busy === name ? 'Preparing' : text);
  const btnClass = (name, extra = '') => `btn${extra}${busy === name ? ' busy' : ''}`;

  return (
    <div className="donecard">
      <p className="dhint">Here is our business card. Check it, then download or share it.</p>
      <BusinessCardSvg svgRef={svgRef} />
      <div className="bbtns" id="cardBtns">
        <button type="button" className={btnClass('creating the image')} disabled={!!busy} onClick={downloadImage}>{label('creating the image', 'Download image')}</button>
        <a className="btn more" href={whatsappLink(message).replace(`/${site.whatsappNumber}`, '/')} target="_blank" rel="noopener noreferrer" aria-disabled={!!busy} onClick={() => { track('card_whatsapp'); say('WhatsApp opens with a message and our link. The card image is not attached; use Download image to send the file.'); }}>Share on WhatsApp</a>
      </div>
      <p className={`cstatus${status.kind ? ` ${status.kind}` : ''}`} role="status" aria-live="polite">{status.text}</p>
    </div>
  );
}
