import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * POST /api/leads
 * Expected body: { name, phone, email?, vehicle?, inquiryType?, budget?, contact?, message?, consent: true, sourcePage?, submittedAt? }
 * Response: { ok: true, id } on success.
 * Storage: appends to data/leads.json (git-ignored). Replace with DB in production.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const consent = body.consent === true;

    if (name.length < 2)
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    if (!/^[+\d][\d\s\-()]{6,16}$/.test(phone))
      return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    if (!consent)
      return NextResponse.json({ error: "Consent is required so we can respond." }, { status: 400 });

    const lead = {
      id: `lead_${Date.now().toString(36)}`,
      name,
      phone,
      email: email || null,
      vehicle: String(body.vehicle ?? "").slice(0, 200) || null,
      inquiryType: String(body.inquiryType ?? "General EV advice").slice(0, 80),
      budget: String(body.budget ?? "").slice(0, 80) || null,
      contact: String(body.contact ?? "Phone").slice(0, 20),
      message: String(body.message ?? "").slice(0, 2000) || null,
      consent,
      sourcePage: String(body.sourcePage ?? "").slice(0, 500) || null,
      submittedAt: String(body.submittedAt ?? new Date().toISOString()),
      createdAt: new Date().toISOString(),
    };

    const dir = path.join(process.cwd(), "data");
    const file = path.join(dir, "leads.json");
    await fs.mkdir(dir, { recursive: true });
    let arr: unknown[] = [];
    try {
      const raw = await fs.readFile(file, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) arr = parsed;
    } catch {
      arr = [];
    }
    arr.push(lead);
    await fs.writeFile(file, JSON.stringify(arr, null, 2), "utf8");

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (e) {
    console.error("lead submission failed", e);
    return NextResponse.json({ error: "Could not save your inquiry. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    contract: "POST { name, phone, email?, vehicle?, inquiryType?, budget?, contact?, message?, consent: true }",
    storage: "data/leads.json (replace with DB in production)",
  });
}
