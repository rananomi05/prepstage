import { NextRequest, NextResponse } from "next/server";
import { callGemini, GeminiApiError, GeminiConfigError } from "@/lib/gemini";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are a supportive but honest interview coach reviewing a candidate's
practice answer to a specific interview question.

Respond with ONLY valid JSON (no markdown fences, no preamble), matching exactly this shape:

{
  "strengths": ["<specific thing the answer did well>"],
  "improvements": ["<specific, actionable suggestion to strengthen the answer>"],
  "overallNote": "<one encouraging but honest sentence summarizing the answer's readiness>"
}

Rules:
- Give 2-4 strengths and 2-4 improvements, each one short sentence, specific to what they actually wrote.
- Do not invent details about the candidate's real experience — only comment on what's on the page.
- If the answer is very short or empty, say so directly in overallNote and keep suggestions focused on adding structure (e.g. STAR method) rather than praising sparse content.
- Be direct and useful, not just encouraging.`;

export async function POST(req: NextRequest) {
  let body: { question?: string; answer?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const question = body.question?.trim();
  const answer = body.answer?.trim();

  if (!question || !answer) {
    return NextResponse.json(
      { error: "A question and an answer are both required." },
      { status: 400 }
    );
  }

  const userContent = `INTERVIEW QUESTION:\n"""\n${question}\n"""\n\nCANDIDATE'S PRACTICE ANSWER:\n"""\n${answer}\n"""`;

  try {
    const parsed = await callGemini(SYSTEM_PROMPT, userContent);
    return NextResponse.json(parsed);
  } catch (err) {
    if (err instanceof GeminiConfigError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    if (err instanceof GeminiApiError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong on the server. Please try again." },
      { status: 500 }
    );
  }
}
