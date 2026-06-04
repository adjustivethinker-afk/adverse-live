/** Google brand "G" mark in official 4 colors. */
export function GoogleIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M21.6 12.227c0-.66-.06-1.29-.17-1.9H12v3.59h5.4c-.23 1.27-.94 2.35-2 3.07v2.55h3.24c1.9-1.75 2.96-4.33 2.96-7.31z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.63-2.45l-3.24-2.51c-.9.6-2.05.96-3.4.96-2.6 0-4.8-1.76-5.6-4.13H3.06v2.6C4.7 19.7 8.1 22 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.85c-.2-.6-.32-1.24-.32-1.85s.12-1.25.32-1.85V7.55H3.06A9.96 9.96 0 002 12c0 1.6.38 3.13 1.06 4.45l3.34-2.6z"
      />
      <path
        fill="#EA4335"
        d="M12 6.04c1.47 0 2.78.5 3.82 1.5l2.86-2.86C16.96 3.07 14.7 2 12 2 8.1 2 4.7 4.3 3.06 7.55l3.34 2.6c.8-2.37 3-4.1 5.6-4.1z"
      />
    </svg>
  );
}
