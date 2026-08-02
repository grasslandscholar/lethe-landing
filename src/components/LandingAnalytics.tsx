"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";
import { recordLetheEvent } from "@/lib/analytics/client";

export type AnalysisCtaSource = "hero" | "floating" | "section" | "footer";

export function trackAnalysisCtaClicked(source: AnalysisCtaSource) {
  track("analysis_cta_clicked", { source });
  void recordLetheEvent("analysis_cta_clicked", { source });
}

export default function LandingAnalytics() {
  useEffect(() => {
    track("landing_view");
    void recordLetheEvent("landing_view");
  }, []);

  return null;
}
