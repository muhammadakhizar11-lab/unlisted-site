// Cloudflare Pages Function: POST /api/waitlist
// Stores the email in a KV namespace bound as WAITLIST (free tier). Create the namespace and bind it in the Pages settings.
export async function onRequestPost({ request, env }) {
  let email = "";
  try { ({ email } = await request.json()); } catch (e) { return new Response("Bad request", { status: 400 }); }
  email = String(email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) return new Response("Invalid email", { status: 400 });
  if (!env.WAITLIST) return new Response("Not configured", { status: 503 });
  await env.WAITLIST.put(email, JSON.stringify({ at: new Date().toISOString() }));
  return new Response("ok", { status: 200 });
}
