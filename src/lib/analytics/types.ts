export type LetheEventName =
  | "landing_view"
  | "analysis_cta_clicked"
  | "analysis_started"
  | "analysis_completed"
  | "analysis_failed"
  | "cleanup_interest_clicked"
  | "cleanup_priority_submitted";

export type LetheEventProperties = Record<string, string | number | boolean | null>;
