// Builds the site into public/: the home page, /terms, /privacy, /cookies, /sources, sitemap.xml and robots.txt.
// Run: node build.mjs (warns about unfilled placeholders)
//      npm run build  (for deploy: fails if any {{PLACEHOLDER}} is left, unless you add -- --allow-placeholders)
import { writeFileSync, mkdirSync } from "node:fs";

// ---- Config: fill these before taking money ---------------------------------------------------------
// null = not filled yet. The page then shows {{NAME}} and the deploy build fails.
const LEGAL = {
  OPERATOR_NAME: null,          // the sole trader's full name
  BUSINESS_ADDRESS: null,       // a virtual office address keeps a home address off the site
  EMAIL_PROVIDER: null,         // the service that sends the weekly sample
  VAT_SENTENCE: "No VAT is charged.", // "The price includes VAT." once VAT-registered
  ICO_SENTENCE: "",             // "Our ICO registration number is X." once registered, or empty if no fee applies
};
const SITE_URL = "https://unlisted-site.unlisted-joblist.workers.dev"; // swap for the real domain later
const STRIPE_LIVE = false;      // true once Stripe checkout is live: shows the Stripe processor line and the checkout cookie text
const LEGAL_NOINDEX = false;    // true adds <meta name="robots" content="noindex"> to the legal pages and drops them from the sitemap
const LEGAL_UPDATED = "9 November 2026";
const EMAIL = { user: "unlisted.joblist", domain: "gmail.com" };
// -----------------------------------------------------------------------------------------------------

const BRAND = "Unlisted";
const PRICE = "£9.99";

// The contact email, joined from two parts by js/site.js so it is not in the page source as one string.
const mail = () => `<span class="mail" data-u="${EMAIL.user}" data-d="${EMAIL.domain}"></span><noscript>${EMAIL.user} [at] ${EMAIL.domain}</noscript>`;

function pageHead({ title, description, path, noindex = false }) {
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE_URL}${path}">${noindex ? `\n<meta name="robots" content="noindex">` : ""}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/site.css">
<script>document.documentElement.classList.add("js")</script>
</head>`;
}

function topBar(home) {
  const h = home ? "" : "/";
  return `<header class="top">
  <a class="wordmark" href="${home ? "#top" : "/"}">${BRAND}</a>
  <nav class="top-links" aria-label="Main">
    <a href="${h}#lists">Lists</a>
    <a href="${h}#pricing">Pricing</a>
    <a href="${h}#faq">Questions</a>
  </nav>
  <a class="top-action" href="${h}#join">Join the waitlist</a>
</header>`;
}

function footer({ home = false, sources = false } = {}) {
  const h = home ? "" : "/";
  return `<footer class="foot">
  <div class="foot-cols">
    <div><p class="f1">${BRAND}</p><p>Curated lists of UK firms for job seekers.</p></div>
    <div><p class="f1">Product</p><p><a href="${h}#lists">Lists</a></p><p><a href="${h}#pricing">Pricing</a></p><p><a href="${h}#faq">Questions</a></p></div>
    <div><p class="f1">Legal</p><p><a href="/terms/">Terms</a></p><p><a href="/privacy/">Privacy</a></p><p><a href="/cookies/">Cookies</a></p><p><a href="/sources/">Sources</a></p></div>
    <div><p class="f1">Contact</p><p>${mail()}</p><p>United Kingdom</p></div>
  </div>
  <p class="foot-word" aria-hidden="true">${BRAND.toUpperCase()}</p>
  <p class="foot-legal">© 2026 ${BRAND}.${sources ? " Not affiliated with or endorsed by Companies House, the SRA, Ofgem or the FCA." : ""}</p>
</footer>`;
}

// EXAMPLE rows only: fictional firms that show the format. Replace with real list data.
const lists = [
  { name: "Investment and trading", types: "Hedge funds, prop traders, asset managers", roles: "Analyst, trader, quant researcher",
    rows: [["Marlowe Row Capital", "Hedge fund", "Boutique", "London"], ["Calder Street Trading", "Prop trading", "Mid-size", "London"], ["Harbour Gate Asset Management", "Asset manager", "Large", "Edinburgh"]] },
  { name: "Banking and capital markets", types: "Banks, corporate finance, M&A advisory", roles: "Analyst, associate, sales and trading",
    rows: [["Ainsley Corporate Finance", "M&A advisory", "Boutique", "Manchester"], ["Northfield Merchant Bank", "Bank", "Large", "London"], ["Vesper Partners", "Corporate finance", "Mid-size", "Leeds"]] },
  { name: "Wealth management", types: "Private client, family offices, planners", roles: "Paraplanner, analyst, adviser",
    rows: [["Thornbury Private Client", "Wealth manager", "Mid-size", "Bristol"], ["Eastgate Family Office", "Family office", "Boutique", "London"], ["Lowther & Reed Financial Planning", "Planning firm", "Boutique", "York"]] },
  { name: "Private equity and venture capital", types: "Buyout funds, growth equity, venture", roles: "Analyst, investment associate",
    rows: [["Ashcombe Equity Partners", "Private equity", "Mid-size", "London"], ["Kestrel Ventures", "Venture capital", "Boutique", "Cambridge"], ["Dunmore Growth Capital", "Growth equity", "Boutique", "Glasgow"]] },
  { name: "Insurance", types: "Brokers, Lloyd's agents, reinsurers, actuaries", roles: "Graduate scheme, underwriter, actuarial analyst",
    rows: [["Pemberton Reinsurance", "Reinsurer", "Large", "London"], ["Saltmarsh Brokers", "Broker", "Mid-size", "Birmingham"], ["Wren Actuarial", "Actuarial", "Boutique", "Manchester"]] },
  { name: "Consulting", types: "Strategy, economics, management consulting", roles: "Analyst, consultant, researcher",
    rows: [["Fenwick Strategy", "Strategy", "Boutique", "London"], ["Halden Economics", "Economics", "Boutique", "Oxford"], ["Brightwater Advisory", "Management consulting", "Mid-size", "Leeds"]] },
  { name: "Fintech and payments", types: "Payments, lending, crypto, regtech", roles: "Data analyst, product, operations",
    rows: [["Larkspur Payments", "Payments", "Mid-size", "London"], ["Ordnance Lending", "Lending", "Boutique", "Manchester"], ["Tallow Digital Assets", "Crypto", "Boutique", "Edinburgh"]] },
  { name: "Tech and data", types: "Software, data and AI, cybersecurity", roles: "Developer, data scientist, analyst",
    rows: [["Quillon Data", "Data and AI", "Boutique", "Manchester"], ["Ravensworth Security", "Cybersecurity", "Mid-size", "Cardiff"], ["Pinnacle Cloud Systems", "Cloud", "Large", "Reading"]] },
  { name: "Energy", types: "Power trading, renewables, oil and gas", roles: "Analyst, trader, graduate engineer",
    rows: [["Wyndham Power Trading", "Power trading", "Mid-size", "London"], ["Corrie Renewables", "Renewables", "Boutique", "Aberdeen"], ["Stannard Energy", "Oil and gas", "Large", "Aberdeen"]] },
  { name: "Accounting", types: "Audit, tax, insolvency and restructuring", roles: "Trainee, audit associate, tax analyst",
    rows: [["Barrowby & Co", "Audit", "Mid-size", "Leeds"], ["Hollin Tax Advisers", "Tax", "Boutique", "Birmingham"], ["Garrick Restructuring", "Restructuring", "Boutique", "London"]] },
  { name: "Law", types: "Commercial law firms and solicitors", roles: "Trainee solicitor, paralegal, legal assistant",
    rows: [["Ellerby Harte LLP", "Commercial law", "Large", "London"], ["Mason Oake Solicitors", "Solicitors", "Mid-size", "Manchester"], ["Craigmillar Law", "Commercial law", "Boutique", "Glasgow"]] },
];

const faqs = [
  ["Where does the data come from?", "Public registers and firms' own websites: Companies House, the SRA register and similar sources. Each list is filtered and checked before it goes out. The sources page names every source and how it is used."],
  ["Do I get emails or phone numbers?", "No. Each firm comes with the link to its own contact or careers page, so you reach the firm through the channel it chose. We do not sell personal contact details."],
  ["Will this get me a job?", "We cannot promise that. The lists save you the research and tell you who to approach. The tracker and message templates help you send a good first message and follow up. The outcome depends on your applications."],
  ["How often are the lists updated?", "Every month. New firms are added and closed ones removed, and each update says what changed."],
  ["Can I cancel?", "Yes, at any time, online, in two clicks. You also have a 14-day cancellation right unless you choose immediate access, which the checkout explains before you pay."],
  ["Who is behind it?", "Two people who built the data tool themselves and use it to research the firms in each list."],
];

// One purple family for the eleven list panels, alternating lighter and deeper steps.
const panelTones = ["#F3EEFD", "#E4D8FA", "#EEE6FC", "#DCCCF8", "#F1EAFC", "#E2D5FA", "#ECE3FB", "#D9C8F7", "#F2ECFD", "#E6DBFA", "#EFE7FC"];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// Section heading with a mask, so the words can rise into place.
const head = (id, cls, inner) => `<h2 id="${id}" class="${cls} reveal-head"><span class="mask"><span class="mask-in">${inner}</span></span></h2>`;

// Hero file: the first ten example rows from the finance lists.
const heroRows = lists.slice(0, 4).flatMap((l) => l.rows).slice(0, 10)
  .map((r, i) => `<tr data-row><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${r[2]}</td><td>${r[3]}</td><td><span class="link-ex">Website</span></td><td><span class="link-ex">${i % 2 ? "Contact page" : "Careers page"}</span></td></tr>`).join("\n            ");

const tableRows = (l) => l.rows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${r[2]}</td><td>${r[3]}</td><td><span class="link-ex">Contact page</span></td></tr>`).join("");

const listRows = lists.map((l, i) => `
      <details class="lineup-item" style="--panel:${panelTones[i]}" data-reveal${i === 0 ? " open" : ""}>
        <summary><span class="l-name">${esc(l.name)}</span><span class="l-types">${esc(l.types)}</span><span class="l-roles">${esc(l.roles)}</span></summary>
        <div class="lineup-body" data-ui>
          <table class="ui-table" aria-label="Example rows for ${esc(l.name)}">
            <thead><tr><th scope="col">Firm</th><th scope="col">Type</th><th scope="col">Size</th><th scope="col">Town</th><th scope="col">Link</th></tr></thead>
            <tbody>${tableRows(l)}</tbody>
          </table>
          <p class="note">Example rows with fictional firms, to show the format. The real file lists real firms.</p>
        </div>
      </details>`).join("");

const faqRows = faqs.map(([q, a]) => `
        <details class="faq-item" data-reveal><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");

const html = `<!doctype html>
<html lang="en-GB">
${pageHead({ title: `${BRAND}: curated lists of UK firms to contact for jobs`, description: `Eleven curated lists of UK firms in finance, consulting, tech, energy and law, each with a contact or careers page. ${PRICE} a month.`, path: "/" })}
<body>

${topBar(true)}

<main id="top">

  <section class="hero" aria-labelledby="h1">
    <h1 id="h1" class="lines">
      <span class="line"><span data-line style="--i:0">Firms worth</span></span>
      <span class="line"><span data-line style="--i:1">contacting.</span></span>
    </h1>
    <div class="hero-side">
      <p class="support" data-fade>Eleven curated lists of UK firms in finance, consulting, tech, energy and law. Each firm comes with its contact or careers page. ${PRICE} a month.</p>
      <a class="btn" href="#join" data-fade>Join the waitlist</a>
    </div>
    <figure class="hero-file" data-ui>
      <figcaption class="file-bar"><span class="file-name">Investment and banking lists</span><span class="file-note">Example file, fictional firms</span></figcaption>
      <div class="file-tabs" aria-hidden="true"><span class="on">Firms</span><span>Tracker</span><span>Templates</span></div>
      <div class="file-crop">
        <table class="ui-table file-table" aria-label="Example list file with fictional firms">
          <thead><tr><th scope="col">Firm</th><th scope="col">Type</th><th scope="col">Size</th><th scope="col">Town</th><th scope="col">Website</th><th scope="col">Contact</th></tr></thead>
          <tbody>
            ${heroRows}
          </tbody>
        </table>
      </div>
    </figure>
  </section>

  <section class="how" aria-labelledby="how-h">
    ${head("how-h", "section-head", "From list to first message.")}
    <div class="how-col">
      <div class="exchange" data-reveal>
        <p class="order">First, pick the lists you want.</p>
        <div class="call" data-ui>
          <p class="call-label">Lists</p>
          <ul class="chips" aria-label="Example selection">
            <li class="chip on">Investment and trading</li><li class="chip on">Banking and capital markets</li><li class="chip">Consulting</li><li class="chip">Law</li>
          </ul>
        </div>
        <p class="response">Each list is a download. Firms are tagged by type and size, so you can start with the ones that fit you.</p>
      </div>

      <div class="exchange" data-reveal>
        <p class="order">Then, open the file and sort it.</p>
        <div class="call" data-ui>
          <table class="ui-table how-file" aria-label="Example file">
            <thead><tr><th scope="col">Firm</th><th scope="col">Type</th><th scope="col">Size</th><th scope="col">Link</th></tr></thead>
            <tbody>
              <tr><td>Marlowe Row Capital</td><td>Hedge fund</td><td>Boutique</td><td><span class="link-ex">Careers page</span></td></tr>
              <tr class="sel"><td>Calder Street Trading</td><td>Prop trading</td><td>Mid-size</td><td><span class="link-ex">Contact page</span></td></tr>
              <tr><td>Harbour Gate Asset Management</td><td>Asset manager</td><td>Large</td><td><span class="link-ex">Careers page</span></td></tr>
            </tbody>
          </table>
        </div>
        <p class="response">Every row links to the firm's own page. Filter by size, type or town in any spreadsheet app.</p>
      </div>

      <div class="exchange" data-reveal>
        <p class="order">Last, track it and send your message.</p>
        <div class="call" data-ui>
          <table class="ui-table" aria-label="Example tracker">
            <thead><tr><th scope="col">Firm</th><th scope="col">Status</th><th scope="col">Follow up</th></tr></thead>
            <tbody>
              <tr><td>Calder Street Trading</td><td>Message sent</td><td>14 days</td></tr>
              <tr><td>Marlowe Row Capital</td><td>To contact</td><td></td></tr>
            </tbody>
          </table>
          <p class="template">Hello [name], I'm a maths graduate interested in [role] at [firm]. Could I send you my CV?</p>
        </div>
        <p class="response">A tracker tab and five message templates come with every file.</p>
      </div>
    </div>
  </section>

  <section class="lists" id="lists" aria-labelledby="lists-h">
    ${head("lists-h", "section-head", "Eleven lists. Open one.")}
    <div class="lineup">${listRows}
    </div>
  </section>

  <section class="pricing" id="pricing" aria-labelledby="pricing-h">
    ${head("pricing-h", "price-line", `Every list, <span class="price-block">${PRICE}</span> a month.`)}
    <div class="price-foot">
      <p data-reveal>Includes all eleven lists, the monthly update, the tracker and the message templates. Cancel online at any time.</p>
      <a class="btn on-accent" href="#join" data-reveal>Join the waitlist</a>
    </div>
  </section>

  <section class="faq" id="faq" aria-labelledby="faq-h">
    ${head("faq-h", "faq-head", "Questions, answered.")}
    <div class="faq-list">${faqRows}
    </div>
  </section>

  <section class="join" id="join" aria-labelledby="join-h">
    ${head("join-h", "section-head", "Free sample, every week.")}
    <div class="join-grid">
    <form class="join-form" id="join-form" action="/api/waitlist" method="post" novalidate>
      <p class="join-line" data-reveal>Email me one firm from every list.</p>
      <div class="join-row" data-reveal>
        <label class="sr-only" for="email">Email address</label>
        <input id="email" name="email" type="email" autocomplete="email" placeholder="you@email.com" required>
        <button type="submit" class="btn on-accent" aria-describedby="join-consent">Send the sample</button>
      </div>
      <p class="join-consent" id="join-consent">We will email you the weekly free sample and launch news. Unsubscribe any time. See our <a href="/privacy/">Privacy policy</a>.</p>
      <p class="join-status" id="join-status" role="status" aria-live="polite"></p>
    </form>
    <div class="call sample" data-ui data-reveal>
      <p class="call-label">This week's free sample (example)</p>
      <table class="ui-table" aria-label="Example free sample">
        <thead><tr><th scope="col">List</th><th scope="col">Firm</th><th scope="col">Link</th></tr></thead>
        <tbody>
          <tr><td>Consulting</td><td>Fenwick Strategy</td><td><span class="link-ex">Careers page</span></td></tr>
          <tr><td>Law</td><td>Mason Oake Solicitors</td><td><span class="link-ex">Contact page</span></td></tr>
          <tr><td>Energy</td><td>Corrie Renewables</td><td><span class="link-ex">Careers page</span></td></tr>
          <tr><td>Accounting</td><td>Hollin Tax Advisers</td><td><span class="link-ex">Contact page</span></td></tr>
        </tbody>
      </table>
    </div>
    </div>
  </section>

</main>

${footer({ home: true })}

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js" integrity="sha384-HOvlOYPIs/zjoIkWUGXkVmXsjr8GuZLV+Q+rcPwmJOVZVpvTSXQChiN4t9Euv9Vc" crossorigin="anonymous" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js" integrity="sha384-P8VzCVnT9NBUkMrpcIZrJbA7EBjJvh/fJS6PmP+4nLIM284DtsImIv8D0fFjIkeh" crossorigin="anonymous" defer></script>
<script src="/js/site.js" defer></script>
</body>
</html>
`;
// ---- Legal pages: wording copied exactly from legal-content.md. Edit there first, then here. ----------
// Each section is [heading, html]. The contact email is written in full here and swapped for the
// obfuscated mail() link when the page is rendered. {{NAME}} placeholders are filled from LEGAL above.
const EMAIL_TEXT = `${EMAIL.user}@${EMAIL.domain}`;

const terms = [
  ["1. Who we are", `<p>Unlisted is run by {{OPERATOR_NAME}}, a sole trader trading as Unlisted ("we", "us"). Address: {{BUSINESS_ADDRESS}}. Contact: ${EMAIL_TEXT}. These terms apply when you use our website or subscribe.</p>`],
  ["2. What we provide", `<p>A subscription gives you access to curated lists of UK firms in the sectors shown on our website. For each firm we give the name, type, size band, town, website and a link to its own contact or careers page. Each download includes a tracker tab and message templates. We update the lists monthly.</p>
<p>We do not provide personal contact details such as named individuals' emails or phone numbers.</p>`],
  ["3. No guarantee of results", `<p>The lists help you research employers. We do not promise interviews, replies or job offers. What happens after you contact a firm is up to you and the firm.</p>`],
  ["4. Your licence to use the lists", `<p>We give you a personal, non-transferable licence to use the lists for your own job search while your subscription is active, and to keep files you downloaded during that time for the same purpose. You must not:</p>
<ul>
<li>share, resell, publish or redistribute the lists or any part of them;</li>
<li>use the lists to send bulk or automated marketing;</li>
<li>scrape, copy or extract data from our website by automated means;</li>
<li>use the lists to build a competing product.</li>
</ul>
<p>We may suspend or end access if you break these rules.</p>`],
  ["5. Price and payment", `<p>The subscription costs £9.99 a month. {{VAT_SENTENCE}} It renews automatically each month on the date you first subscribed, until you cancel. Payments are processed by Stripe. We will tell you at least 30 days before any price change, and you can cancel before it takes effect.</p>`],
  ["6. Cancelling", `<p>You can cancel at any time online through your account, using the Stripe customer portal. Cancelling stops future payments. You keep access until the end of the month you have paid for.</p>`],
  ["7. Your 14-day cancellation right", `<p>As a consumer you normally have 14 days from the start of the subscription to cancel and get a refund. Because the lists are digital content you can download straight away, we ask you at checkout to agree to immediate access and to confirm you understand that you lose this right once you start downloading. If you have not downloaded anything in the first 14 days, you can still cancel for a full refund.</p>`],
  ["8. Refunds", `<p>Apart from section 7 and your statutory rights, payments are non-refundable. If something goes wrong on our side (for example, a file will not open or is badly wrong), contact us and we will fix it or refund you for that month.</p>`],
  ["9. Accuracy of the data", `<p>We build the lists from public registers and firms' own websites and check them before release. Firms change, so details can go out of date between updates. The lists are provided "as is", and we do not guarantee every detail is complete or accurate. Tell us about errors at ${EMAIL_TEXT} and we will correct them in the next update.</p>`],
  ["10. Our liability", `<p>Nothing in these terms limits liability that cannot be limited by law, including for death or personal injury caused by negligence, or fraud. Otherwise, our total liability to you is limited to the amount you paid us in the 12 months before the claim. We are not liable for indirect losses or for lost opportunities, including any job you did not get.</p>`],
  ["11. Changes to these terms", `<p>We may update these terms. We will email subscribers about material changes at least 30 days before they apply.</p>`],
  ["12. Law", `<p>These terms are governed by the law of England and Wales. You can bring a claim in the courts of England and Wales, or in the courts of Scotland or Northern Ireland if you live there.</p>`],
];

const privacyRows = [
  ["Email address (waitlist and free sample)", "To send the weekly sample and launch news", "Consent"],
  ["Email address and account details (subscribers)", "To give you access and send account emails", "Contract"],
  ["Payment details", "Handled by Stripe. We see only the last four digits, the card type and the payment status", "Contract"],
  ["Billing records", "To meet tax and accounting rules", "Legal obligation"],
  ["Messages you send us", "To answer you", "Legitimate interests"],
  ["Basic technical data (IP address, browser) in server logs", "To keep the site secure", "Legitimate interests"],
];

const privacy = [
  ["Who is responsible", `<p>{{OPERATOR_NAME}}, a sole trader trading as Unlisted, is the controller of your personal data. Address: {{BUSINESS_ADDRESS}}. Contact: ${EMAIL_TEXT}. {{ICO_SENTENCE}}</p>`],
  ["What we collect and why", `${dataTable(["Data", "Why", "Lawful basis"], privacyRows, "What we collect and why")}
<p>We do not sell your data or use it for advertising.</p>`],
  ["Who we share it with", `<p>We use these processors, who handle data only on our instructions:</p>
<ul>
<li><strong>Cloudflare</strong>: website hosting and storage of waitlist and account data.</li>${STRIPE_LIVE ? `
<li><strong>Stripe</strong>: payments and subscription management.</li>` : ""}
<li><strong>{{EMAIL_PROVIDER}}</strong>: sending emails.</li>
</ul>
<p>Some processors may handle data outside the UK. Where they do, they use approved safeguards such as the UK International Data Transfer Agreement or addendum.</p>`],
  ["How long we keep it", `<ul>
<li>Waitlist emails: until you unsubscribe, or 12 months after launch if you never subscribe.</li>
<li>Account data: deleted within 30 days of your subscription ending.</li>
<li>Billing records: 6 years, for tax.</li>
</ul>`],
  ["Your rights", `<p>You can ask to see, correct or delete your data, object to or limit how we use it, or take a copy. You can withdraw consent at any time, for example with the unsubscribe link in every email. Email ${EMAIL_TEXT} and we will reply within one month.</p>
<p>If you are unhappy with how we handle your data, you can complain to the Information Commissioner's Office (<a href="https://ico.org.uk">ico.org.uk</a>).</p>`],
  ["Firms in our lists", `<p>Our lists cover businesses, not people. We do not include named individuals or personal contact details. If you think a listing includes personal data, or a firm wants to be removed, email ${EMAIL_TEXT}.</p>`],
];

// Build note: the site sets no cookies today. The checkout sentence appears only once Stripe and the members area are live.
const cookies = [
  [null, `${STRIPE_LIVE
    ? `<p>We only use cookies that are strictly necessary for the site to work: keeping you logged in to the members area (once it exists), and Stripe's cookies during checkout, which prevent fraud. These do not need consent, so there is no cookie banner.</p>`
    : `<p>At the moment the site sets no cookies.</p>`}
<p>We do not use advertising or tracking cookies. If we add analytics later, we will use a tool that sets no cookies, or ask for your consent first.</p>`],
];

// Build note: list the SRA, Ofgem, ICAEW and FCA only once their re-use terms are confirmed (the owner is checking).
const sourceRows = [
  ["Companies House", "Company names, numbers, status, registered town, industry codes, accounts category", "Contains public sector information licensed under the Open Government Licence v3.0."],
  ["Firms' own websites", "Website address and contact or careers page link", "Links only; we do not copy their content."],
  // ["Solicitors Regulation Authority (SRA)", "", ""],   // re-use terms not confirmed yet
  // ["Ofgem", "", ""],                                   // re-use terms not confirmed yet
  // ["ICAEW", "", ""],                                   // re-use terms not confirmed yet
  // ["Financial Conduct Authority (FCA)", "", ""],       // re-use terms not confirmed yet: do not use FCA data until the licence is confirmed
];

const sources = [
  [null, `<p>We build our lists from public sources and firms' own websites, then filter and check them.</p>
${dataTable(["Source", "What we use", "Terms"], sourceRows, "Data sources")}
<p>We are not affiliated with or endorsed by Companies House, the SRA, Ofgem or the FCA.</p>
<p><strong>Corrections and removal.</strong> If you run a listed firm and want a detail corrected or the firm removed, email ${EMAIL_TEXT}. We will act within 5 working days and remove it from the next update.</p>`],
];

function dataTable(cols, rows, label) {
  return `<div class="legal-table-wrap"><table class="legal-table" aria-label="${label}">
<thead><tr>${cols.map((c) => `<th scope="col">${c}</th>`).join("")}</tr></thead>
<tbody>
${rows.map((r) => `<tr>${r.map((v, i) => `<td data-label="${cols[i]}">${v}</td>`).join("")}</tr>`).join("\n")}
</tbody>
</table></div>`;
}

const legalLinks = [["/terms/", "Terms of service"], ["/privacy/", "Privacy policy"], ["/cookies/", "Cookie notice"], ["/sources/", "Data sources"]];
const slug = (t) => t.toLowerCase().replace(/^\d+\.\s*/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function fill(text) {
  return text.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (LEGAL[k] === null || LEGAL[k] === undefined ? m : LEGAL[k]))
    .replace(/ <\/p>/g, "</p>"); // an empty sentence (such as ICO_SENTENCE) leaves no trailing space
}

function legalPage({ path, title, description, sections, isSources = false }) {
  const toc = sections.length > 3;
  const body = sections.map(([h, html]) => h
    ? `<section class="legal-section" id="${slug(h)}" aria-labelledby="${slug(h)}-h"><h2 id="${slug(h)}-h">${h}</h2>
${html}
</section>`
    : `<section class="legal-section">${html}</section>`).join("\n");
  return fill(`<!doctype html>
<html lang="en-GB">
${pageHead({ title: `${title} | ${BRAND}`, description, path, noindex: LEGAL_NOINDEX })}
<body>

${topBar(false)}

<main class="legal" id="top">
  <div class="legal-head">
    <h1 class="lines"><span class="line"><span data-line style="--i:0">${title}</span></span></h1>
    <p class="standfirst" data-fade>${description}</p>
    <p class="updated" data-fade>Last updated: ${LEGAL_UPDATED}</p>
  </div>
  <div class="legal-grid">
    <nav class="legal-side" aria-label="${toc ? "On this page" : "Legal pages"}"><ul>
${(toc ? sections.map(([h]) => [`#${slug(h)}`, h]) : legalLinks.filter(([href]) => href !== path)).map(([href, label]) => `      <li><a href="${href}">${label}</a></li>`).join("\n")}
    </ul></nav>
    <article class="legal-body">
${body}
    </article>
  </div>
</main>

${footer({ sources: isSources })}

<script src="/js/site.js" defer></script>
</body>
</html>
`).replaceAll(EMAIL_TEXT, mail());
}

const pages = [
  { file: "index.html", path: "/", html },
  { file: "terms/index.html", path: "/terms/", html: legalPage({ path: "/terms/", title: "Terms of service", description: `The terms for using ${BRAND} and its ${PRICE} a month subscription: what you get, your licence, payment, cancelling and refunds.`, sections: terms }) },
  { file: "privacy/index.html", path: "/privacy/", html: legalPage({ path: "/privacy/", title: "Privacy policy", description: `What personal data ${BRAND} collects, why, who it is shared with, how long it is kept and your rights.`, sections: privacy }) },
  { file: "cookies/index.html", path: "/cookies/", html: legalPage({ path: "/cookies/", title: "Cookie notice", description: `How ${BRAND} uses cookies, and which ones the site sets.`, sections: cookies }) },
  { file: "sources/index.html", path: "/sources/", html: legalPage({ path: "/sources/", title: "Data sources", description: `The public sources ${BRAND} builds its lists from, how each is used, and how firms can ask for corrections or removal.`, sections: sources, isSources: true }) },
];

const indexable = pages.filter((p) => p.path === "/" || !LEGAL_NOINDEX);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${SITE_URL}${p.path}</loc></url>`).join("\n")}
</urlset>
`;
const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

// ---- Placeholder guard, then write ----------------------------------------------------------------------
const strict = process.argv.includes("--strict");
const allow = process.argv.includes("--allow-placeholders");
const left = new Map();
for (const p of pages) for (const m of p.html.matchAll(/\{\{([A-Z_]+)\}\}/g)) left.set(m[1], [...(left.get(m[1]) || []), p.path]);
if (left.size) {
  console.warn(`\nWARNING: ${left.size} legal placeholder(s) still unfilled. Set them in the LEGAL config at the top of build.mjs:`);
  for (const [k, where] of left) console.warn(`  {{${k}}}  on ${[...new Set(where)].join(", ")}`);
  if (strict && !allow) {
    console.error("\nBuild stopped: placeholders would ship. Fill them, or run `npm run build -- --allow-placeholders` for a preview.\n");
    process.exit(1);
  }
  console.warn("");
}

const out = (f) => new URL(`./public/${f}`, import.meta.url);
for (const p of pages) {
  mkdirSync(new URL(".", out(p.file)), { recursive: true });
  writeFileSync(out(p.file), p.html);
  console.log(`public/${p.file} written,`, p.html.length, "bytes");
}
writeFileSync(out("sitemap.xml"), sitemap);
writeFileSync(out("robots.txt"), robots);
console.log("public/sitemap.xml and public/robots.txt written");

