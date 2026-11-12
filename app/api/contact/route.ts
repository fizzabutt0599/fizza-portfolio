import { NextResponse } from "next/server";
import { deliverContact, validateContact } from "@/lib/contact";
import type { ContactFormValues } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Partial<ContactFormValues>;
  try {
    body = (await request.json()) as Partial<ContactFormValues>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, do nothing.
  if (body.company) return NextResponse.json({ ok: true });

  const errors = validateContact(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", errors }, { status: 422 });
  }

  try {
    await deliverContact({
      name: body.name!.trim(),
      email: body.email!.trim(),
      projectType: body.projectType!.trim(),
      message: body.message!.trim(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] delivery failed:", err);
    return NextResponse.json(
      { ok: false, error: "Your message couldn’t be sent right now. Please email me directly." },
      { status: 502 },
    );
  }
}
