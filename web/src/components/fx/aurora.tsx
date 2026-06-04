"use client";

export function AuroraBackground() {
  return (
    <div aria-hidden className="aurora-bg">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 noise" />
    </div>
  );
}
