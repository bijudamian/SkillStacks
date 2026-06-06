import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { products } from "@/data/products";

export async function POST(req: Request) {
  try {
    const { productSlug } = await req.json();

    if (!productSlug) {
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      );
    }

    const product = products.find((p) => p.slug === productSlug);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an expert action-taker. The user has just bought the following playbook and needs a simple, 10-step action checklist to guarantee their success.
      
      Playbook Title: ${product.title}
      Description: ${product.description}
      What they learn:
      ${product.whatYouLearn.map((s) => "- " + s).join("\n")}
      
      ${
        product.contentSnippet
          ? `Detailed Content Snippet: ${product.contentSnippet}`
          : ""
      }

      Return a raw JSON array of exactly 10 checklist objects. Each object must have an "id" (string, e.g., "step-1"), a "text" (string, the actionable step), and "isCompleted" (boolean, false).
      Format exactly like this:
      [
        {
          "id": "step-1",
          "text": "Set up your broker account.",
          "isCompleted": false
        }
      ]
      No markdown code blocks, just raw JSON. Ensure the steps are sequential and highly actionable.
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    if (responseText.startsWith("\`\`\`json")) {
      responseText = responseText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    } else if (responseText.startsWith("\`\`\`")) {
      responseText = responseText.replace(/\`\`\`/g, "").trim();
    }

    const checklist = JSON.parse(responseText);

    return NextResponse.json({ checklist });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[checklist] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate checklist." },
      { status: 500 }
    );
  }
}
