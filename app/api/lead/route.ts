import { NextResponse } from "next/server";
import { attributionKeys } from "@/lib/attribution";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const str = (key: string, max = 200) => (typeof body[key] === "string" ? (body[key] as string).trim().slice(0, max) : "");

  // Honeypot filled: answer like a success so bots don't retry, but drop it.
  if (str("company")) return NextResponse.json({ ok: true });

  const lead = {
    name: str("name", 120),
    phone: str("phone", 40),
    email: str("email", 160),
    car: str("car", 120),
    service: str("service", 40),
    date: str("date", 20),
    message: str("message", 2000),
    attribution: Object.fromEntries(attributionKeys.map((k) => [k, str(k)]).filter(([, v]) => v)),
    receivedAt: new Date().toISOString(),
  };

  if (!lead.name || !lead.phone || !lead.car || !lead.service) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }

  console.log("[lead]", JSON.stringify(lead));
  // TODO: forward the lead to the studio, e.g. an email via Resend or a CRM webhook (HubSpot, Salesforce, Pipedrive).

  return NextResponse.json({ ok: true });
}
