"use client";

import { useRef, useState } from "react";
import IntakeForm from "@/components/IntakeForm";
import QuestionCard from "@/components/QuestionCard";
import { QuestionsResult } from "@/lib/types";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<QuestionsResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function handleSubmit() {
    setError("");

    if (!jobDescription.trim()) {
      setError("Paste a job description first — that's what the questions are built from.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, background }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setResult(data);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const grouped = result
    ? {
        Behavioral: result.questions.filter((q) => q.category === "Behavioral"),
        Technical: result.questions.filter((q) => q.category === "Technical"),
        "Culture Fit": result.questions.filter((q) => q.category === "Culture Fit"),
      }
    : null;

  return (
    <>
      <header className="stage-wash border-b border-stage-line px-6 pb-12 pt-16">
        <div className="mx-auto max-w-[880px]">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-spotlight/30 bg-spotlight-soft px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wide text-spotlight">
            <span className="h-1.5 w-1.5 rounded-full bg-spotlight" />
            Free forever — runs on the Gemini free tier
          </div>
          <h1 className="font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight">
            Prep<span className="text-spotlight">Stage</span>
          </h1>
          <p className="mt-3 max-w-[52ch] text-[1.05rem] text-card/65">
            Paste the job posting. Get interview questions built for that exact
            role — then rehearse your answers out loud and get told, honestly,
            what&apos;s working.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[880px] px-6 pb-24 pt-12">
        <IntakeForm
          jobDescription={jobDescription}
          background={background}
          onJobDescriptionChange={setJobDescription}
          onBackgroundChange={setBackground}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {error && (
          <p className="mt-6 text-center font-mono text-[0.82rem] text-flag">{error}</p>
        )}

        {result && grouped && (
          <div ref={resultsRef} className="mt-14">
            <div className="mb-8 rounded-lg border border-stage-line bg-stage-soft p-5">
              <div className="mb-1.5 font-mono text-[0.72rem] uppercase tracking-wide text-card/50">
                On stage today
              </div>
              <p className="font-display text-lg font-medium">{result.roleSummary}</p>
            </div>

            {(["Behavioral", "Technical", "Culture Fit"] as const).map((cat) =>
              grouped[cat].length ? (
                <div key={cat} className="mb-10">
                  <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-card/45">
                    {cat}
                  </h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {grouped[cat].map((q, i) => (
                      <QuestionCard key={q.id} question={q} index={i} />
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </main>

      <footer className="px-6 pb-14 text-center font-mono text-[0.75rem] text-card/40">
        <p>PrepStage doesn&apos;t store your answers — everything lives in this browser tab only.</p>
      </footer>
    </>
  );
}
