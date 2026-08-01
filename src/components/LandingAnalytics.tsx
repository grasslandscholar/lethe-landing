"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

export type AnalysisCtaSource = "hero" | "floating" | "section" | "footer";

export function trackAnalysisCtaClicked(source: AnalysisCtaSource) {
  track("analysis_cta_clicked", { source });
}

export default function LandingAnalytics() {
  useEffect(() => {
    track("landing_view");
  }, []);

  return null;
}
