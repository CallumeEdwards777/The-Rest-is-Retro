import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Faq = () => {
  // React Router doesn't scroll to #anchors — track the hash across navigations
  const { hash, key } = useLocation();
  useEffect(() => {
    if (hash === '#contact') {
      document.getElementById('contact')?.scrollIntoView({ block: 'start' });
    }
  }, [hash, key]);

  return (
    <main className="wrap listings-page">
      <h1 className="page-title">Questions, answered</h1>
      <p className="page-sub">The honest version, in plain words.</p>

      <section className="faq-item">
        <h2>What does the Verified badge mean?</h2>
        <p>
          It means the listing is covered by the TRR guarantee. When a seller lists an item, they
          submit evidence — product labels, barcodes or serial numbers. We check that evidence
          against product records before the listing goes live. If the item you receive turns out
          not to be genuine, you get a full refund and keep the item while we investigate the
          seller.
        </p>
      </section>

      <section className="faq-item">
        <h2>So nobody physically inspects the items?</h2>
        <p>
          No — The Rest is Retro is a marketplace between real people, not a warehouse. Items go
          straight from the seller to you. The guarantee exists so you don&rsquo;t have to take a
          stranger&rsquo;s word for it.
        </p>
      </section>

      <section className="faq-item">
        <h2>What happens if I get scammed?</h2>
        <p>
          Report the item with photos of what arrived. If the label or barcode doesn&rsquo;t match
          what the seller submitted, you&rsquo;re refunded in full and the seller&rsquo;s account
          gets a warning or a ban.
        </p>
      </section>

      <section className="faq-item">
        <h2>What does &quot;pending verification&quot; mean?</h2>
        <p>
          The seller has listed the item but we haven&rsquo;t finished checking their evidence
          yet. You can look, save it to your hearts, but not buy until it clears.
        </p>
      </section>

      <section className="faq-item">
        <h2>Can I sell anything from any decade?</h2>
        <p>
          If it&rsquo;s from the &lsquo;70s, &lsquo;80s, &lsquo;90s or the Y2K years and
          it&rsquo;s genuinely from that era, yes. List it with a photo and the evidence you have
          — labels, serials, receipts, anything that dates it.
        </p>
      </section>

      <section className="faq-item">
        <h2>How do the decade filters work?</h2>
        <p>
          Every item is tagged with its era. Pick a decade — or take the two-question quiz when
          you first arrive — and the shop rearranges itself around your taste.
        </p>
      </section>

      <section className="faq-item" id="contact">
        <h2>How do I contact you?</h2>
        <p>
          Email hello@therestisretro.example or use the socials in the footer. We&rsquo;re a small
          crew; give us a day.
        </p>
      </section>
    </main>
  );
};

export default Faq;
