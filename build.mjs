// Builds index.html from the data below. Run: node build.mjs
import { writeFileSync } from "node:fs";

const BRAND = "Unlisted";
const PRICE = "£9.99";

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

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const tableRows = (l) => l.rows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${r[2]}</td><td>${r[3]}</td><td><span class="link-ex">Contact page</span></td></tr>`).join("");

const listRows = lists.map((l, i) => `
      <details class="lineup-item" data-reveal${i === 0 ? " open" : ""}>
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
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${BRAND}: curated lists of UK firms to contact for jobs</title>
<meta name="description" content="Eleven curated lists of UK firms in finance, consulting, tech, energy and law, each with a contact or careers page. ${PRICE} a month.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/site.css">
<script>document.documentElement.classList.add("js")</script>
</head>
<body>

<header class="top">
  <a class="wordmark" href="#top">${BRAND}</a>
  <nav class="top-links" aria-label="Main">
    <a href="#lists">Lists</a>
    <a href="#pricing">Pricing</a>
    <a href="#faq">Questions</a>
  </nav>
  <a class="top-action" href="#join">Join the waitlist</a>
</header>

<main id="top">

  <section class="hero" aria-labelledby="h1">
    <div class="hero-side">
      <p class="support" data-fade>Eleven curated lists of UK firms in finance, consulting, tech, energy and law. Each firm comes with its contact or careers page. ${PRICE} a month.</p>
      <a class="btn" href="#join" data-fade>Join the waitlist</a>
    </div>
    <h1 id="h1" class="lines">
      <span class="line"><span data-line style="--i:0">Firms worth</span></span>
      <span class="line"><span data-line style="--i:1">contacting.</span></span>
    </h1>
  </section>

  <section class="how" aria-labelledby="how-h">
    <h2 id="how-h" class="section-head" data-reveal>From list to first message.</h2>
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
          <table class="ui-table" aria-label="Example file">
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
    <h2 id="lists-h" class="section-head" data-reveal>Eleven lists. Open one.</h2>
    <div class="lineup">${listRows}
    </div>
  </section>

  <section class="pricing" id="pricing" aria-labelledby="pricing-h">
    <h2 id="pricing-h" class="price-line" data-reveal>Every list, <span class="price-block">${PRICE}</span> a month.</h2>
    <div class="price-foot">
      <p data-reveal>Includes all eleven lists, the monthly update, the tracker and the message templates. Cancel online at any time.</p>
      <a class="btn on-accent" href="#join" data-reveal>Join the waitlist</a>
    </div>
  </section>

  <section class="faq" id="faq" aria-labelledby="faq-h">
    <h2 id="faq-h" class="faq-head" data-reveal>Questions, answered.</h2>
    <div class="faq-list">${faqRows}
    </div>
  </section>

  <section class="join" id="join" aria-labelledby="join-h">
    <h2 id="join-h" class="section-head" data-reveal>Free sample, every week.</h2>
    <div class="join-grid">
    <form class="join-form" id="join-form" action="/api/waitlist" method="post" novalidate>
      <p class="join-line" data-reveal>Email me one firm from every list.</p>
      <div class="join-row" data-reveal>
        <label class="sr-only" for="email">Email address</label>
        <input id="email" name="email" type="email" autocomplete="email" placeholder="you@email.com" required>
        <button type="submit" class="btn">Send the sample</button>
      </div>
      <p class="join-note">We only use your email for the sample and launch news. Unsubscribe any time. <a href="/privacy">Privacy policy</a>.</p>
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

<footer class="foot">
  <div class="foot-cols">
    <div><p class="f1">${BRAND}</p><p>Curated lists of UK firms for job seekers.</p></div>
    <div><p class="f1">Product</p><p><a href="#lists">Lists</a></p><p><a href="#pricing">Pricing</a></p><p><a href="#faq">Questions</a></p></div>
    <div><p class="f1">Legal</p><p><a href="/terms">Terms</a></p><p><a href="/privacy">Privacy</a></p><p><a href="/cookies">Cookies</a></p><p><a href="/sources">Data sources</a></p></div>
    <div><p class="f1">Contact</p><p><a href="mailto:hello@example.com">hello@example.com</a></p><p>United Kingdom</p></div>
  </div>
  <p class="foot-word" aria-hidden="true">${BRAND.toUpperCase()}</p>
  <p class="foot-legal">© 2026 ${BRAND}. Not affiliated with or endorsed by Companies House, the FCA or the SRA.</p>
</footer>

<script src="js/site.js"></script>
</body>
</html>
`;
writeFileSync(new URL("./public/index.html", import.meta.url), html);
console.log("public/index.html written,", html.length, "bytes");
