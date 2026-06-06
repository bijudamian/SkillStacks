import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { products } from "@/data/products";

export async function POST(req: Request) {
  try {
    const { goal, skillLevel, timeCommitment } = await req.json();

    if (!goal || !skillLevel || !timeCommitment) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Format products catalog
    const catalog = products
      .map(
        (p) =>
          `- Title: ${p.title}\n  Slug: ${p.slug}\n  Description: ${p.description}`
      )
      .join("\n\n");

    const prompt = `
      You are an expert career and skills coach for SkillStacks.
      The user has provided the following profile:
      - Primary Goal: ${goal}
      - Current Skill Level: ${skillLevel}
      - Time Commitment: ${timeCommitment}

      Here is our catalog of available playbooks:
      ${catalog}

      Task: Based on their profile, build a step-by-step roadmap for them using ONLY the playbooks from our catalog. 
      You do not have to use all playbooks, just the ones that make sense for their goal. Order them chronologically.

      Return a raw JSON object (without markdown codeblocks) with the following structure:
      {
        "title": "A catchy title for their custom roadmap",
        "summary": "A 2-sentence encouraging summary of their path.",
        "steps": [
          {
            "phase": "e.g., Month 1, Phase 1",
            "playbookSlug": "the slug of the playbook",
            "reasoning": "Why this playbook is the perfect next step for them right now."
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Strip markdown JSON formatting if Gemini adds it accidentally
    if (responseText.startsWith("\`\`\`json")) {
      responseText = responseText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    }

    const roadmapData = JSON.parse(responseText);

    return NextResponse.json(roadmapData);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[roadmap] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate roadmap. Please try again." },
      { status: 500 }
    );
  }
}
