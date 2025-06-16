import { NextResponse } from "next/server";
import { saveMarketingMessage } from "@/lib/messages";

export async function POST(req: Request) {
  const { emails, message } = await req.json();

  // 1. Save message to Firestore
  await saveMarketingMessage(message);

  // 2. (Fake) send emails
  console.log("Sending to:", emails);
  console.log("Message:", message);

  return NextResponse.json({ success: true });
}