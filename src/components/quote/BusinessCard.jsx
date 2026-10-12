import { useEffect, useRef, useState } from 'react';
import BusinessCardSvg from './BusinessCardSvg.jsx';
import { site, whatsappLink } from '../../config/site.js';
import { SITE_URL } from '../../config/env.js';
import { track } from '../../utils/analytics.js';
import { cardFileName, copyText, downloadBlob, makePdf, makePng, makeVCard } from '../../utils/cardExport.js';

const isIos = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// The business card shown after the form is sent, with Download / Share / Copy buttons.
export default function BusinessCard() {
  const svgRef = useRef(null);
  const pngPromise = useRef(null);
  const [busy, setBusy] = useState(null); // name of the running action, or null
  const [status, setStatus] = useState({ text: '', kind: '' });
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === 'function';

  const siteUrl = (SITE_URL || window.location.origin) + '/';
  const message = `${site.name} - construction, paver blocks and building materials in Varanasi. Call ${site.phoneDisplay}. Our website: ${siteUrl}`;

  // Make the PNG once and keep it, so Share can start instantly inside the tap (iPhone needs this).
  const getPng = () => {
    if (!pngPromise.current) {
      pngPromise.current = makePng(svgRef.current);
      pngPromise.current.catch(() => { pngPromise.current = null; });
    }
    return pngPromise.current;
  };
  useEffect(() => { getPng().catch(() => {}); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const say = (text, kind = '') => setStatus({ text, kind });
  const failed = (what) => say(`Sorry, ${what} did not work. Please try again, or use another option (Download PDF, Copy link or WhatsApp).`, 'err');

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
    say(`Saved as ${cardFileName('png')}${isIos ? '. If nothing was saved, use Share, then Save Image.' : '.'}`, 'ok');
  });
  const downloadPdf = () => run('creating the PDF', 'Creating your PDF...', async () => {
    downloadBlob(await makePdf(svgRef.current), cardFileName('pdf'));
    track('card_download_pdf');
    say(`Saved as ${cardFileName('pdf')} (3.5 x 2 in, print ready).`, 'ok');
  });
  const share = () => run('sharing', 'Getting your card ready to share...', async () => {
    const file = new File([await getPng()], cardFileName('png'), { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: `${site.name} business card`, text: message });
      track('card_share'); say('Shared.', 'ok');
    } else {
      await navigator.share({ title: `${site.name} business card`, text: message, url: siteUrl });
      track('card_share_link'); say('Link shared. This browser cannot share the image itself, so use Download image if you need the file.', 'ok');
    }
  });
  const copyLink = async () => {
    if (busy) return;
    if (await copyText(siteUrl)) {
      track('card_copy_link'); setCopied(true); say(`Link copied: ${siteUrl}`, 'ok');
      setTimeout(() => setCopied(false), 2200);
    } else say(`Could not copy automatically. Press and hold to copy this link: ${siteUrl}`, 'err');
  };
  const saveContact = () => {
    downloadBlob(makeVCard(), `${site.shortName.toLowerCase()}-infra-developers.vcf`);
    track('contact_save'); say('Contact file saved. Open it to add us to your phone.', 'ok');
  };

  const label = (name, text) => (busy === name ? 'Preparing' : text);
  const btnClass = (name, extra = '') => `btn${extra}${busy === name ? ' busy' : ''}`;

  return (
    <div className="donecard">
      <p className="dhint">Here is our business card. Check it, then download or share it.</p>
      <BusinessCardSvg svgRef={svgRef} />
      <div className="bbtns" id="cardBtns">
        <button type="button" className={btnClass('creating the image')} disabled={!!busy} onClick={downloadImage}>{label('creating the image', 'Download image')}</button>
        <button type="button" className={btnClass('creating the PDF', ' more')} disabled={!!busy} onClick={downloadPdf}>{label('creating the PDF', 'Download PDF')}</button>
        {canShare && <button type="button" className={btnClass('sharing', ' more')} disabled={!!busy} onClick={share}>{label('sharing', 'Share')}</button>}
        <a className="btn more" href={whatsappLink(message).replace(`/${site.whatsappNumber}`, '/')} target="_blank" rel="noopener noreferrer" aria-disabled={!!busy} onClick={() => { track('card_whatsapp'); say('WhatsApp opens with a message and our link. The card image is not attached; use Download image to send the file.'); }}>Share on WhatsApp</a>
        <button type="button" className="btn more" disabled={!!busy} onClick={copyLink}>{copied ? 'Link copied' : 'Copy link'}</button>
        <button type="button" className="btn more" disabled={!!busy} onClick={saveContact}>Save contact</button>
      </div>
      <p className={`cstatus${status.kind ? ` ${status.kind}` : ''}`} role="status" aria-live="polite">{status.text}</p>
    </div>
  );
}
