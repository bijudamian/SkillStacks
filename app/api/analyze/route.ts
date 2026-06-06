import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { products } from "@/data/products";

export async function POST(req: Request) {
  try {
    const { resume } = await req.json();

    if (!resume) {
      return NextResponse.json(
        { error: "Resume text is required" },
        { status: 400 }
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

    // Prepare catalog context
    const catalogContext = products.map(p => 
      `- Title: ${p.title} (Slug: ${p.slug})
       Description: ${p.description}
       What they learn: ${p.whatYouLearn.join(", ")}`
    ).join("\n\n");

    const prompt = `
      You are an expert career and life coach.
      A user has submitted their resume / bio for analysis:
      """
      ${resume}
      """

      We have the following playbooks available for them to purchase:
      ${catalogContext}

      Analyze their profile. Identify what they are currently doing, what their strengths are, and importantly, what skill gap they have that is preventing them from achieving more (e.g. they know tech but don't know investing, or they work hard but are neglecting their fitness, or they need a passive income stream).

      Recommend exactly ONE playbook from the catalog that will have the highest ROI for them.

      Respond ONLY with a raw JSON object (no markdown, no backticks) with exactly these 3 keys:
      {
        "recommendedSlug": "<the EXACT slug of the chosen playbook from the list above>",
        "analysis": "<2-3 sentences identifying their current strengths and situation>",
        "whyThisPlaybook": "<2-3 sentences pitching exactly why this specific playbook bridges their gap and is the logical next step>"
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    if (responseText.startsWith("\`\`\`json")) {
      responseText = responseText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    }

    const analysisData = JSON.parse(responseText);

    // Validate the slug exists
    const validProduct = products.find(p => p.slug === analysisData.recommendedSlug);
    if (!validProduct) {
      // Fallback
      analysisData.recommendedSlug = products[0].slug;
    }

    return NextResponse.json(analysisData);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[analyze] Error:", err);
    return NextResponse.json(
      { error: "Failed to analyze profile. Please try again." },
      { status: 500 }
    );
  }
}
