export default function HoodieBazarLogo({ className = "h-7 w-7 text-[#111111]" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Hoodie Bazar Logo"
    >
      {/* Outer rounded container with editorial black fill */}
      <rect
        x="12"
        y="12"
        width="76"
        height="76"
        rx="20"
        fill="#111111"
      />
      {/* Outer hood contour in white */}
      <path
        d="M28 66C28 42 37 26 50 26C63 26 72 42 72 66"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Inner neckline curve */}
      <path
        d="M38 66C38 52 43 42 50 42C57 42 62 52 62 66"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Signature Electric Lime drawcord accent knot */}
      <circle cx="50" cy="74" r="5" fill="#b6e600" />
    </svg>
  );
}
