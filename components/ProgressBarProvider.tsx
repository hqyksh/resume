"use client";

import { Suspense } from "react";
import TopProgressBar from "./TopProgressBar";

export default function ProgressBarProvider() {
  return (
    <Suspense fallback={null}>
      <TopProgressBar />
    </Suspense>
  );
}
