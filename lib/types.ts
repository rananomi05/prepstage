export type QuestionCategory = "Behavioral" | "Technical" | "Culture Fit";

export interface PrepQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  whatGreatAnswersInclude: string;
}

export interface QuestionsResult {
  roleSummary: string;
  questions: PrepQuestion[];
}

export interface FeedbackResult {
  strengths: string[];
  improvements: string[];
  overallNote: string;
}
