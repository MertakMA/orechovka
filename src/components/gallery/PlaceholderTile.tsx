export default function PlaceholderTile({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-cream text-clay ${className}`}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="opacity-50">
        <path
          d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="px-2 text-center text-[13px] leading-tight opacity-70">Fotka bude doplněna</span>
    </div>
  );
}
