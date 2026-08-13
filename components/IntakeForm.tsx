"use client";

interface IntakeFormProps {
  jobDescription: string;
  background: string;
  onJobDescriptionChange: (v: string) => void;
  onBackgroundChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function IntakeForm({
  jobDescription,
  background,
  onJobDescriptionChange,
  onBackgroundChange,
  onSubmit,
  loading,
}: IntakeFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-stage-line bg-stage-soft p-5">
        <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-spotlight">
          <span className="flex h-5 w-5 items-center justify-center rounded border border-spotlight/50 text-[0.65rem]">
            1
          </span>
          The role you&apos;re rehearsing for
        </div>
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the job description you're preparing to interview for."
          className="min-h-[180px] w-full resize-y rounded-md border border-stage-line bg-stage p-4 font-body text-sm leading-relaxed text-card placeholder:text-card/35 focus:border-spotlight/60 focus:outline-none"
        />
      </div>

      <div className="rounded-lg border border-stage-line bg-stage-soft p-5">
        <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cue">
          <span className="flex h-5 w-5 items-center justify-center rounded border border-cue/50 text-[0.65rem]">
            2
          </span>
          Your background <span className="text-card/40">(optional)</span>
        </div>
        <textarea
          value={background}
          onChange={(e) => onBackgroundChange(e.target.value)}
          placeholder="Paste your resume or a quick summary of your experience — helps sharpen the behavioral questions."
          className="min-h-[110px] w-full resize-y rounded-md border border-stage-line bg-stage p-4 font-body text-sm leading-relaxed text-card placeholder:text-card/35 focus:border-cue/60 focus:outline-none"
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="mx-auto inline-flex items-center gap-2 rounded-full bg-spotlight px-8 py-4 font-display text-sm font-semibold text-stage shadow-[0_10px_30px_-10px_rgba(255,183,3,0.55)] transition-all hover:enabled:-translate-y-px hover:enabled:bg-spotlight-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-cue disabled:cursor-progress disabled:opacity-60"
      >
        <span>{loading ? "Building your rehearsal…" : "Build my interview prep"}</span>
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
