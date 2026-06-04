"use client";
import { Apple, Facebook } from "lucide-react";

export function SocialButtons() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <SocialBtn label="Google" svg={<GoogleIcon />} />
      <SocialBtn label="Apple" svg={<Apple className="h-4 w-4" />} />
      <SocialBtn label="Facebook" svg={<Facebook className="h-4 w-4" />} />
    </div>
  );
}

function SocialBtn({ label, svg }: { label: string; svg: React.ReactNode }) {
  return (
    <button
      type="button"
      className="group relative flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] py-2.5 text-xs font-medium text-white/85 transition hover:bg-white/[0.08]"
    >
      <span className="text-white/85">{svg}</span>
      {label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.6 6.5 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.6 0 19-7.7 19-19 0-1.3-.1-2.6-.4-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.6 6.5 29.1 4.5 24 4.5 16.5 4.5 10.1 8.5 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 43.5c5 0 9.6-1.9 13-5l-6-4.9C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.9 39.5 16.4 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H24v8h11.3c-.7 2.1-2.1 3.9-3.8 5.1l6 4.9c4.2-3.9 7-9.6 7-15 0-1.3-.1-2.6-.4-4z"/>
    </svg>
  );
}
