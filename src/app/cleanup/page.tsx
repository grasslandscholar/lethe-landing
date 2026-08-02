import { Suspense } from "react";
import CleanupClient from "./CleanupClient";

export default function CleanupPage() {
  return (
    <Suspense fallback={null}>
      <CleanupClient />
    </Suspense>
  );
}
