import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if lead already exists
    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      return NextResponse.json(
        { error: "You are already subscribed!" },
        { status: 400 }
      );
    }

    await Lead.create({ email });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[subscribe] Error:", err);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
