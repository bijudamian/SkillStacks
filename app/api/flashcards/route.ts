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
      You are an expert educator. I want you to create exactly 5 bite-sized flashcards to help a user memorize the core concepts of the following playbook.
      
      Playbook Title: ${product.title}
      Description: ${product.description}
      Syllabus/Content:
      ${product.whatYouLearn.map((s) => "- " + s).join("\n")}
      
      ${
        product.contentSnippet
          ? `Detailed Content Snippet: ${product.contentSnippet}`
          : ""
      }

      Return a raw JSON array of 5 objects. Each object must have a "front" (the question or concept) and a "back" (the concise answer or definition). 
      Format exactly like this:
      [
        {
          "front": "What is...",
          "back": "It is..."
        }
      ]
      No markdown code blocks, just raw JSON.
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    if (responseText.startsWith("\`\`\`json")) {
      responseText = responseText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    } else if (responseText.startsWith("\`\`\`")) {
      responseText = responseText.replace(/\`\`\`/g, "").trim();
    }

    const flashcards = JSON.parse(responseText);

    return NextResponse.json({ flashcards });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[flashcards] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate flashcards." },
      { status: 500 }
    );
  }
}
