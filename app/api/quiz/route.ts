import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { products } from "@/data/products";

export async function POST(req: Request) {
  try {
    const { sessionId, answer, question } = await req.json();

    if (!sessionId || !answer || !question) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();
    const order = await Order.findOne({ stripeSessionId: sessionId }).lean();
    
    if (!order) {
      return NextResponse.json(
        { error: "Unauthorized access. No purchase found." },
        { status: 401 }
      );
    }

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an expert evaluator and instructor for the playbook: "${product.title}".
      The playbook teaches the following: ${product.description}
      Here is the question that was asked to the student: "${question}"
      Here is the student's answer: "${answer}"

      Evaluate their answer strictly but fairly based on the context of the playbook topic.
      Return a raw JSON object (without markdown formatting) containing exactly these 3 keys:
      {
        "score": <number between 0 and 100>,
        "passed": <boolean, true if score >= 70>,
        "feedback": "<A concise 2-3 sentence explanation of why they got this score, and what they missed if anything.>"
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    if (responseText.startsWith("\`\`\`json")) {
      responseText = responseText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    }

    const gradeData = JSON.parse(responseText);

    return NextResponse.json(gradeData);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[quiz] Error:", err);
    return NextResponse.json(
      { error: "Failed to grade quiz. Please try again." },
      { status: 500 }
    );
  }
}
