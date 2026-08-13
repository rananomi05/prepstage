const DEFAULT_MODEL = "gemini-3.5-flash";

export async function callGemini(
  systemPrompt: string,
  userContent: string
) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new GeminiConfigError(
      "Server is missing GEMINI_API_KEY. Add it to your .env.local file."
    );
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userContent }],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();

    console.error("Gemini API error:", response.status, errText);

    throw new GeminiApiError(
      response.status === 429
        ? "The free Gemini tier is rate-limited right now — wait a few seconds and try again."
        : "The AI service returned an error. Please try again."
    );
  }

  const data = await response.json();

  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new GeminiApiError("The AI service returned no content.");
  }

  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error("Failed to parse Gemini JSON:", cleaned);

    throw new GeminiApiError(
      "Could not parse the AI response. Please try again."
    );
  }
}

export class GeminiConfigError extends Error {}
export class GeminiApiError extends Error {}