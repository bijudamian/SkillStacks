import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { topic, audience } = await req.json();

    if (!topic || !audience) {
      return NextResponse.json(
        { error: "Topic and audience are required" },
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

    const prompt = `
      You are an expert curriculum designer and copywriter for SkillStacks, a platform selling premium, highly actionable PDF playbooks.
      
      Topic: ${topic}
      Target Audience: ${audience}

      Please generate the first draft of an Action Playbook. Do not include fluff. Be extremely practical, structured, and use Markdown.
      
      Structure the output exactly like this:
      # [Catchy Playbook Title]
      > [Strong 1-sentence tagline]

      ## The System Overview
      [A brief 2-paragraph overview of the playbook's core framework]

      ## Chapter 1: The Foundation
      [Actionable content for chapter 1]
      
      ### Action Steps
      - [ ] Action item 1
      - [ ] Action item 2

      ## Chapter 2: The Execution
      [Actionable content for chapter 2]

      ### Action Steps
      - [ ] Action item 1
      - [ ] Action item 2
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ markdown: responseText });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[generator] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate playbook. See logs." },
      { status: 500 }
    );
  }
}
