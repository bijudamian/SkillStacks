import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { products } from "@/data/products";

export async function POST(req: Request) {
  try {
    const { sessionId, message, history } = await req.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: "Session ID and message are required" },
        { status: 400 }
      );
    }

    // 1. Verify the order
    await connectDB();
    const order = await Order.findOne({ stripeSessionId: sessionId }).lean();
    
    if (!order) {
      return NextResponse.json(
        { error: "Unauthorized access. No purchase found." },
        { status: 401 }
      );
    }

    // 2. Get Product Context
    const product = products.find((p) => p.slug === order.productSlug);
    
    if (!product) {
      return NextResponse.json(
        { error: "Product metadata not found." },
        { status: 404 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // 3. Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const systemInstruction = `
      You are the official AI Tutor for SkillStacks, specifically an expert on the playbook titled "${product.title}".
      Tagline of the playbook: "${product.tagline}"
      
      Your goal is to help the user execute the strategies within this playbook. 
      Be encouraging, highly actionable, concise, and professional.
      Use Markdown formatting to make your responses readable (bolding, lists, etc).
      If the user asks something completely unrelated to ${product.title} or business/skills, politely steer them back.
    `;

    // 4. Construct Chat Session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemInstruction }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I will act as the AI Tutor for this playbook." }],
        },
        // Filter out the initial welcome message from UI history to prevent duplication context issues, 
        // or just append user history
        ...history.slice(1).map((m: { role: string; parts: { text: string }[] }) => ({
          role: m.role,
          parts: m.parts,
        }))
      ],
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[tutor] Error:", err);
    return NextResponse.json(
      { error: "Failed to process chat. Please try again." },
      { status: 500 }
    );
  }
}
