// Cloudflare Worker: POST /api/waitlist stores the email in the WAITLIST KV namespace.
// Everything else is served from the static assets in ./public.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/waitlist") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
      let email = "";
      try { ({ email } = await request.json()); } catch (e) { return new Response("Bad request", { status: 400 }); }
      email = String(email || "").trim().toLowerCase();
      if (email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return new Response("Invalid email", { status: 400 });
      await env.WAITLIST.put(email, JSON.stringify({ at: new Date().toISOString() }));
      return new Response("ok", { status: 200 });
    }
    return env.ASSETS.fetch(request);
  },
};
