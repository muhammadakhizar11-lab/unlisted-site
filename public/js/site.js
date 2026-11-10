// Waitlist form: posts to /api/waitlist (see src/worker.js). Works without the motion layer.
(function () {
  var form = document.getElementById("join-form");
  if (!form) return;
  var status = document.getElementById("join-status");
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var email = form.elements.email.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { status.textContent = "Please enter a valid email address."; return; }
    status.textContent = "Sending...";
    fetch(form.action, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email }) })
      .then(function (r) { if (!r.ok) throw new Error(); status.textContent = "Thanks. We'll send your first sample soon."; form.reset(); })
      .catch(function () { status.textContent = "Something went wrong. Please try again."; });
  });
})();

// Motion layer: GSAP 3.13 + ScrollTrigger, pinned on cdnjs. No pinning, no scrub, no scroll hijacking.
// Content is visible if GSAP fails to load, and nothing moves for prefers-reduced-motion.
(function () {
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("gsap");

  var EASE = "power3.out";      // close to the signature curve cubic-bezier(.2,0,0,1)
  var STANDARD = 0.45, SLOW = 0.7;

  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", function () {
    // The hero list file fills in row by row once it is on screen.
    var rows = gsap.utils.toArray(".hero-file [data-row]");
    if (rows.length) {
      gsap.fromTo(rows, { opacity: 0, y: 12 }, {
        opacity: 1, y: 0, duration: STANDARD, ease: EASE, stagger: 0.05, delay: 0.35,
        scrollTrigger: { trigger: ".hero-file", start: "top 90%", once: true }
      });
    }

    // Section headings rise out of their mask.
    gsap.utils.toArray(".reveal-head .mask-in").forEach(function (el) {
      gsap.from(el, { yPercent: 105, duration: SLOW, ease: "power4.out",
        scrollTrigger: { trigger: el.parentNode, start: "top 88%", once: true } });
    });

    // Section parts enter in order: text, then fragment, staggered.
    var parts = gsap.utils.toArray("[data-reveal]");
    gsap.set(parts, { opacity: 0, y: 24 });
    ScrollTrigger.batch(parts, {
      start: "top 92%", once: true, batchMax: 6,
      onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, duration: STANDARD + 0.15, ease: EASE, stagger: 0.08, overwrite: true }); }
    });

    // Rows inside the example fragments cascade in as their table arrives.
    gsap.utils.toArray(".how .ui-table tbody, .sample tbody").forEach(function (tb) {
      gsap.from(tb.children, { opacity: 0, y: 8, duration: STANDARD, ease: EASE, stagger: 0.04, delay: 0.2,
        scrollTrigger: { trigger: tb, start: "top 90%", once: true } });
    });
  });
})();
