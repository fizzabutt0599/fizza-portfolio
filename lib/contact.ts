import "server-only";
import type { ContactFormValues } from "@/types";

export { validateContact } from "./validation";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

/**
 * Sends the message using the provider selected by CONTACT_PROVIDER.
 * Runs on the server only — secrets never reach the browser.
 */
export async function deliverContact(values: ContactFormValues): Promise<void> {
  const provider = (process.env.CONTACT_PROVIDER ?? "none").toLowerCase();

  if (provider === "formspree") {
    const id = process.env.FORMSPREE_FORM_ID;
    if (!id) throw new Error("FORMSPREE_FORM_ID is not set");
    const res = await fetch(`https://formspree.io/f/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        projectType: values.projectType,
        message: values.message,
        _subject: `Portfolio enquiry — ${values.projectType}`,
      }),
    });
    if (!res.ok) throw new Error(`Formspree responded with ${res.status}`);
    return;
  }

  if (provider === "resend") {
    const key = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
    if (!key || !to) throw new Error("RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject: `Portfolio enquiry — ${values.projectType} — ${values.name}`,
        html: `<h2>New portfolio enquiry</h2>
<p><strong>Name:</strong> ${escapeHtml(values.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
<p><strong>Project type:</strong> ${escapeHtml(values.projectType)}</p>
<p><strong>Message:</strong></p><p>${escapeHtml(values.message).replace(/\n/g, "<br/>")}</p>`,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded with ${res.status}`);
    return;
  }

  // Development fallback: just log it on the server.
  console.info("[contact] New message (CONTACT_PROVIDER=none):", {
    name: values.name,
    email: values.email,
    projectType: values.projectType,
    message: values.message,
  });
}
