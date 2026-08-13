import { NextRequest, NextResponse } from "next/server";
import { callGemini, GeminiApiError, GeminiConfigError } from "@/lib/gemini";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are an expert interview coach who has sat on both sides of the hiring table.
You will be given a job description and, optionally, the candidate's background.

Generate a set of interview questions tailored specifically to this job posting — not generic
questions that could apply to any role. Base technical questions on the actual skills/tools
mentioned in the posting. Base behavioral questions on the responsibilities and team context
implied by the posting.

Respond with ONLY valid JSON (no markdown fences, no preamble), matching exactly this shape:

{
  "roleSummary": "<one sentence naming the role and its core focus, based on the JD>",
  "questions": [
    {
      "id": "<short unique id like q1, q2>",
      "category": "Behavioral" | "Technical" | "Culture Fit",
      "question": "<the interview question, specific to this role>",
      "whatGreatAnswersInclude": "<1-2 sentences on what a strong answer would cover, specific to this role's context>"
    }
  ]
}

Rules:
- Generate exactly 8 questions: 3 Behavioral, 3 Technical, 2 Culture Fit.
- Technical questions must reference specific tools, skills, or domains named in the job description.
- Do not invent facts about the company; only use what's in the job description.
- Keep each question to one clear sentence.`;

export async function POST(req: NextRequest) {
  let body: { jobDescription?: string; background?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const jobDescription = body.jobDescription?.trim();
  const background = body.background?.trim();

  if (!jobDescription) {
    return NextResponse.json(
      { error: "Please paste a job description." },
      { status: 400 }
    );
  }

  const userContent = background
    ? `JOB DESCRIPTION:\n"""\n${jobDescription}\n"""\n\nCANDIDATE BACKGROUND:\n"""\n${background}\n"""`
    : `JOB DESCRIPTION:\n"""\n${jobDescription}\n"""`;

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
