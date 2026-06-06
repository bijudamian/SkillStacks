import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { products } from "@/data/products";

export async function POST(req: Request) {
  try {
    const { command } = await req.json();

    if (!command) {
      return NextResponse.json({ error: "No command provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const catalogSlugs = products.map(p => p.slug).join(", ");

    const prompt = `
      You are an intelligent routing engine for the SkillStacks web application.
      The user clicked the voice microphone and said the following command:
      "${command}"

      Your job is to map their intent to exactly ONE of our application's routes.
      Here are the available routes:
      - "/" : The home page / store. Use this if they want to see all playbooks or go home.
      - "/roadmap" : The AI personalized roadmap generator.
      - "/analyze" : The AI resume scanner / career analyzer.
      - "/product/[slug]" : A specific playbook. Available slugs are: ${catalogSlugs}. Use this if they ask for a specific playbook (like investing, fitness, or youtube).

      Respond ONLY with a raw JSON object containing the exact path string.
      Format:
      {
        "path": "<the exact relative url path, e.g. /roadmap>"
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    if (responseText.startsWith("\`\`\`json")) {
      responseText = responseText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    }

    const data = JSON.parse(responseText);

    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[voice] Error:", err);
    return NextResponse.json(
      { error: "Failed to process voice command." },
      { status: 500 }
    );
  }
}
