// Scroll reveals, with a staggered delay inside each section. Content stays visible without JS.
(function () {
  var els = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
  els.forEach(function (e, i) {
    var sib = e.parentElement ? Array.prototype.indexOf.call(e.parentElement.children, e) : i;
    e.style.setProperty("--d", Math.min(sib, 4) * 70 + "ms");
    io.observe(e);
  });

  // Waitlist form: posts to /api/waitlist (see src/worker.js).
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
