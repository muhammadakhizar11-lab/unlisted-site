# Unlisted legal page content (draft, not legal advice)

Source: the Unlisted legal drafts doc, structured after North Search's public terms and privacy policy and adapted to Unlisted. Wording is our own.

Filled in: contact email, last-updated date, notice and retention periods, Companies House attribution.
Still placeholders (shown as `{{NAME}}` for the build to fill): see the list at the end.

---

## PAGE: /terms
Title: Terms of service
Last updated: 9 November 2026

### 1. Who we are
Unlisted is run by {{OPERATOR_NAME}}, a sole trader trading as Unlisted ("we", "us"). Address: {{BUSINESS_ADDRESS}}. Contact: unlisted.joblist@gmail.com. These terms apply when you use our website or subscribe.

### 2. What we provide
A subscription gives you access to curated lists of UK firms in the sectors shown on our website. For each firm we give the name, type, size band, town, website and a link to its own contact or careers page. Each download includes a tracker tab and message templates. We update the lists monthly.

We do not provide personal contact details such as named individuals' emails or phone numbers.

### 3. No guarantee of results
The lists help you research employers. We do not promise interviews, replies or job offers. What happens after you contact a firm is up to you and the firm.

### 4. Your licence to use the lists
We give you a personal, non-transferable licence to use the lists for your own job search while your subscription is active, and to keep files you downloaded during that time for the same purpose. You must not:
- share, resell, publish or redistribute the lists or any part of them;
- use the lists to send bulk or automated marketing;
- scrape, copy or extract data from our website by automated means;
- use the lists to build a competing product.

We may suspend or end access if you break these rules.

### 5. Price and payment
The subscription costs £9.99 a month. {{VAT_SENTENCE}} It renews automatically each month on the date you first subscribed, until you cancel. Payments are processed by Stripe. We will tell you at least 30 days before any price change, and you can cancel before it takes effect.

### 6. Cancelling
You can cancel at any time online through your account, using the Stripe customer portal. Cancelling stops future payments. You keep access until the end of the month you have paid for.

### 7. Your 14-day cancellation right
As a consumer you normally have 14 days from the start of the subscription to cancel and get a refund. Because the lists are digital content you can download straight away, we ask you at checkout to agree to immediate access and to confirm you understand that you lose this right once you start downloading. If you have not downloaded anything in the first 14 days, you can still cancel for a full refund.

### 8. Refunds
Apart from section 7 and your statutory rights, payments are non-refundable. If something goes wrong on our side (for example, a file will not open or is badly wrong), contact us and we will fix it or refund you for that month.

### 9. Accuracy of the data
We build the lists from public registers and firms' own websites and check them before release. Firms change, so details can go out of date between updates. The lists are provided "as is", and we do not guarantee every detail is complete or accurate. Tell us about errors at unlisted.joblist@gmail.com and we will correct them in the next update.

### 10. Our liability
Nothing in these terms limits liability that cannot be limited by law, including for death or personal injury caused by negligence, or fraud. Otherwise, our total liability to you is limited to the amount you paid us in the 12 months before the claim. We are not liable for indirect losses or for lost opportunities, including any job you did not get.

### 11. Changes to these terms
We may update these terms. We will email subscribers about material changes at least 30 days before they apply.

### 12. Law
These terms are governed by the law of England and Wales. You can bring a claim in the courts of England and Wales, or in the courts of Scotland or Northern Ireland if you live there.

---

## PAGE: /privacy
Title: Privacy policy
Last updated: 9 November 2026

### Who is responsible
{{OPERATOR_NAME}}, a sole trader trading as Unlisted, is the controller of your personal data. Address: {{BUSINESS_ADDRESS}}. Contact: unlisted.joblist@gmail.com. {{ICO_SENTENCE}}

### What we collect and why
Table (Data | Why | Lawful basis):
- Email address (waitlist and free sample) | To send the weekly sample and launch news | Consent
- Email address and account details (subscribers) | To give you access and send account emails | Contract
- Payment details | Handled by Stripe. We see only the last four digits, the card type and the payment status | Contract
- Billing records | To meet tax and accounting rules | Legal obligation
- Messages you send us | To answer you | Legitimate interests
- Basic technical data (IP address, browser) in server logs | To keep the site secure | Legitimate interests

We do not sell your data or use it for advertising.

### Who we share it with
We use these processors, who handle data only on our instructions:
- **Cloudflare**: website hosting and storage of waitlist and account data.
- **Stripe**: payments and subscription management. (Show only once checkout is live.)
- **{{EMAIL_PROVIDER}}**: sending emails.

Some processors may handle data outside the UK. Where they do, they use approved safeguards such as the UK International Data Transfer Agreement or addendum.

### How long we keep it
- Waitlist emails: until you unsubscribe, or 12 months after launch if you never subscribe.
- Account data: deleted within 30 days of your subscription ending.
- Billing records: 6 years, for tax.

### Your rights
You can ask to see, correct or delete your data, object to or limit how we use it, or take a copy. You can withdraw consent at any time, for example with the unsubscribe link in every email. Email unlisted.joblist@gmail.com and we will reply within one month.

If you are unhappy with how we handle your data, you can complain to the Information Commissioner's Office (ico.org.uk).

### Firms in our lists
Our lists cover businesses, not people. We do not include named individuals or personal contact details. If you think a listing includes personal data, or a firm wants to be removed, email unlisted.joblist@gmail.com.

---

## PAGE: /cookies
Title: Cookie notice
Last updated: 9 November 2026

We only use cookies that are strictly necessary for the site to work: keeping you logged in to the members area (once it exists), and Stripe's cookies during checkout, which prevent fraud. These do not need consent, so there is no cookie banner.

We do not use advertising or tracking cookies. If we add analytics later, we will use a tool that sets no cookies, or ask for your consent first.

Build note: today the site sets no cookies at all, so say that: "At the moment the site sets no cookies." Add the members-area and Stripe sentence only when those go live.

---

## PAGE: /sources
Title: Data sources
Last updated: 9 November 2026

We build our lists from public sources and firms' own websites, then filter and check them.

Table (Source | What we use | Terms):
- Companies House | Company names, numbers, status, registered town, industry codes, accounts category | Contains public sector information licensed under the Open Government Licence v3.0.
- Firms' own websites | Website address and contact or careers page link | Links only; we do not copy their content.

Build note: do NOT list the SRA, Ofgem, ICAEW or FCA yet. Add each only after its re-use terms are confirmed (the owner is checking). Keep them as commented-out rows in build.mjs.

We are not affiliated with or endorsed by Companies House, the SRA, Ofgem or the FCA.

**Corrections and removal.** If you run a listed firm and want a detail corrected or the firm removed, email unlisted.joblist@gmail.com. We will act within 5 working days and remove it from the next update.

---

## Placeholders still to fill (the build lists any unfilled ones)
- {{OPERATOR_NAME}}: the sole trader's full name.
- {{BUSINESS_ADDRESS}}: a virtual office address keeps a home address off the site.
- {{EMAIL_PROVIDER}}: the service that sends the weekly sample.
- {{VAT_SENTENCE}}: "No VAT is charged." until VAT-registered; then "The price includes VAT."
- {{ICO_SENTENCE}}: "Our ICO registration number is X." once registered, or leave empty if the ICO checker says no fee applies.

## Checks the two of you still do before taking money
- Terms 7 (14-day waiver and renewals) against gov.uk and CMA DMCC guidance (rules proposed from 1 January 2027).
- ICO data protection fee check.
- Every statement matches how the site actually works.
