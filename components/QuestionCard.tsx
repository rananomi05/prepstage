"use client";

import { useState } from "react";
import { FeedbackResult, PrepQuestion, QuestionCategory } from "@/lib/types";

const CATEGORY_STYLES: Record<
  QuestionCategory,
  { text: string; bg: string; border: string }
> = {
  Behavioral: { text: "text-spotlight", bg: "bg-spotlight-soft", border: "border-spotlight/40" },
  Technical: { text: "text-cue", bg: "bg-cue-soft", border: "border-cue/40" },
  "Culture Fit": { text: "text-encore", bg: "bg-encore-soft", border: "border-encore/40" },
};

export default function QuestionCard({
  question,
  index,
}: {
  question: PrepQuestion;
  index: number;
}) {
  const [revealed, setRevealed] = useState(false);
  const [practicing, setPracticing] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  const style = CATEGORY_STYLES[question.category];

  async function getFeedback() {
    if (!answer.trim()) {
      setFeedbackError("Write a practice answer first.");
      return;
    }
    setFeedbackError("");
    setLoadingFeedback(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.question, answer }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedbackError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setFeedback(data);
    } catch {
      setFeedbackError("Could not reach the server. Please try again.");
    } finally {
      setLoadingFeedback(false);
    }
  }

  return (
    <div
      className="card-flip-enter cue-edge rounded-xl bg-card p-5 text-stage shadow-[0_14px_34px_-18px_rgba(0,0,0,0.7)]"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`rounded-full border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wide ${style.text} ${style.bg} ${style.border}`}
        >
          {question.category}
        </span>
        <span className="font-mono text-[0.68rem] text-stage/40">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <p className="mb-3 font-display text-[1.05rem] font-semibold leading-snug">
        {question.question}
      </p>

      <button
        onClick={() => setRevealed((r) => !r)}
        className="mb-2 font-mono text-[0.72rem] uppercase tracking-wide text-stage/50 underline decoration-dotted underline-offset-4 hover:text-stage/80"
      >
        {revealed ? "Hide coach notes" : "What a strong answer covers"}
      </button>

      {revealed && (
        <p className="mb-4 rounded-md bg-stage/[0.05] p-3 text-[0.86rem] leading-relaxed text-stage/75">
          {question.whatGreatAnswersInclude}
        </p>
      )}

      {!practicing ? (
        <button
          onClick={() => setPracticing(true)}
          className="mt-1 w-full rounded-md border border-stage/15 py-2.5 font-body text-sm font-medium text-stage/80 transition-colors hover:border-cue hover:bg-cue-soft hover:text-stage"
        >
          Practice this answer
        </button>
      ) : (
        <div className="mt-2 border-t border-dashed border-stage/15 pt-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer out loud as you'd say it — don't over-polish, this is rehearsal."
            className="min-h-[110px] w-full resize-y rounded-md border border-stage/15 bg-white/40 p-3 font-body text-sm leading-relaxed text-stage placeholder:text-stage/35 focus:border-cue focus:outline-none"
          />

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={getFeedback}
              disabled={loadingFeedback}
              className="rounded-md bg-stage px-4 py-2 font-body text-sm font-medium text-card transition-opacity hover:opacity-90 disabled:cursor-progress disabled:opacity-60"
            >
              {loadingFeedback ? "Reviewing…" : "Get feedback"}
            </button>
            {feedbackError && (
              <span className="font-mono text-[0.72rem] text-flag">{feedbackError}</span>
            )}
          </div>

          {feedback && (
            <div className="mt-4 flex flex-col gap-3">
              <div className="rounded-md bg-cue-soft p-3">
                <div className="mb-1.5 font-mono text-[0.68rem] uppercase tracking-wide text-cue">
                  Working well
                </div>
                <ul className="list-inside list-disc space-y-1 text-[0.85rem] text-stage/80">
                  {feedback.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-md bg-spotlight-soft p-3">
                <div className="mb-1.5 font-mono text-[0.68rem] uppercase tracking-wide text-spotlight">
                  Sharpen next
                </div>
                <ul className="list-inside list-disc space-y-1 text-[0.85rem] text-stage/80">
                  {feedback.improvements.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <p className="font-display text-[0.9rem] italic text-stage/70">
                {feedback.overallNote}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
