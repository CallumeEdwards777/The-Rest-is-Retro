const Verification = () => {
  return (
    <main className="wrap listings-page">
      <h1 className="page-title">How verification works</h1>
      <p className="page-sub">The TRR guarantee, step by step.</p>

      <section className="faq-item">
        <h2>1 · The seller submits evidence</h2>
        <p>
          Every listing needs proof it&rsquo;s the real thing from the real era: product labels,
          barcodes, serial numbers, original receipts — whatever the item can offer.
        </p>
      </section>

      <section className="faq-item">
        <h2>2 · We check it</h2>
        <p>
          We match that evidence against product records — model numbers, release years,
          catalogue details. No match, no listing.
        </p>
      </section>

      <section className="faq-item">
        <h2>3 · The badge goes on</h2>
        <p>
          Cleared items get the Verified badge. Items still in the queue show as pending
          verification and can&rsquo;t be bought yet.
        </p>
      </section>

      <section className="faq-item">
        <h2>4 · If it&rsquo;s wrong, you&rsquo;re covered</h2>
        <p>
          If what arrives doesn&rsquo;t match the evidence, you get a full refund and keep the
          item while we deal with the seller. That&rsquo;s the whole deal — the badge means
          you&rsquo;re covered, not that we touched the item.
        </p>
      </section>
    </main>
  );
};

export default Verification;
