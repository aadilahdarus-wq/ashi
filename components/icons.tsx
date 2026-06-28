export type NavIconName =
  | "dashboard"
  | "performance"
  | "budget"
  | "ai"
  | "spy"
  | "prompts"
  | "adCopy"
  | "organic"
  | "utm"
  | "client"
  | "practices"
  | "reports"
  | "settings";

type IconProps = {
  className?: string;
};

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

export function NavIcon({
  name,
  className,
}: IconProps & { name: NavIconName }) {
  switch (name) {
    case "dashboard":
      return (
        <svg
          className={className}
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stroke}
        >
          <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" />
          <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" />
          <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" />
          <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" />
        </svg>
      );
    case "performance":
      return (
        <svg
          className={className}
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stroke}
        >
          <path d="M3 15V9" />
          <path d="M8 15V5" />
          <path d="M13 15V8" />
          <path d="M18 15V3" />
        </svg>
      );
    case "budget":
      return (
        <svg
          className={className}
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stroke}
        >
          <rect x="2.5" y="5" width="15" height="11" rx="2" />
          <path d="M2.5 9h15" />
          <circle cx="14" cy="12.5" r="1.25" fill="currentColor" stroke="none" />
        </svg>
      );
    case "ai":
      return (
        <svg
          className={className}
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stroke}
        >
          <path d="M10 3.5v3" />
          <path d="M10 13.5v3" />
          <path d="M5.5 5.5l2.1 2.1" />
          <path d="M12.4 12.4l2.1 2.1" />
          <path d="M3.5 10h3" />
          <path d="M13.5 10h3" />
          <path d="M5.5 14.5l2.1-2.1" />
          <path d="M12.4 7.6l2.1-2.1" />
          <circle cx="10" cy="10" r="2.5" />
        </svg>
      );
    case "spy":
      return (
        <svg
          className={className}
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stroke}
        >
          <path d="M10 4.5C5.5 4.5 2.5 10 2.5 10s3 5.5 7.5 5.5S17.5 10 17.5 10 14.5 4.5 10 4.5z" />
          <circle cx="10" cy="10" r="2.25" />
        </svg>
      );
    case "prompts":
      return (
        <svg
          className={className}
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stroke}
        >
          <path d="M5 4.5h10v11H5z" />
          <path d="M8 8.5h4" />
          <path d="M8 11.5h2.5" />
          <path d="M12.5 14.5l2.5 1.5v-9l-2.5 1.5" />
        </svg>
      );
    case "adCopy":
      return (
        <svg
          className={className}
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stroke}
        >
          <path d="M12.5 4.5l3 3L8 15H5v-3l7.5-7.5z" />
          <path d="M11 6l2.5 2.5" />
        </svg>
      );
    case "organic":
      return (
        <svg
          className={className}
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stroke}
        >
          <path d="M10 16.5V8" />
          <path d="M6.5 11.5C4.5 10 3.5 7.5 4 5.5c2.5-.5 5 1 6 3.5" />
          <path d="M13.5 11.5c2-1.5 3-4 2.5-6-2.5-.5-5 1-6 3.5" />
        </svg>
      );
    case "utm":
      return (
        <svg
          className={className}
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stroke}
        >
          <path d="M7 6.5h6" />
          <path d="M7 10h4" />
          <path d="M7 13.5h5" />
          <path d="M4 4.5h12v11H4z" />
          <path d="M13.5 12.5l2 2" />
        </svg>
      );
    case "client":
      return (
        <svg
          className={className}
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stroke}
        >
          <circle cx="10" cy="7" r="2.75" />
          <path d="M4.5 16c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
        </svg>
      );
    case "practices":
      return (
        <svg
          className={className}
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stroke}
        >
          <path d="M10 3.5l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L4.2 7.7l4-.6L10 3.5z" />
        </svg>
      );
    case "reports":
      return (
        <svg
          className={className}
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stroke}
        >
          <path d="M6 4.5h8v11H6z" />
          <path d="M8 8h4" />
          <path d="M8 11h4" />
          <path d="M8 14h2.5" />
        </svg>
      );
    case "settings":
      return (
        <svg
          className={className}
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stroke}
        >
          <circle cx="10" cy="10" r="2.25" />
          <path d="M10 3.5v1.5" />
          <path d="M10 15v1.5" />
          <path d="M16.5 10h-1.5" />
          <path d="M5 10H3.5" />
          <path d="M14.2 5.8l-1.1 1.1" />
          <path d="M6.9 13.1l-1.1 1.1" />
          <path d="M14.2 14.2l-1.1-1.1" />
          <path d="M6.9 6.9L5.8 5.8" />
        </svg>
      );
  }
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      aria-hidden="true"
      {...stroke}
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      aria-hidden="true"
      {...stroke}
    >
      <circle cx="10" cy="10" r="3.25" />
      <path d="M10 3v1.5" />
      <path d="M10 15.5V17" />
      <path d="M17 10h-1.5" />
      <path d="M4.5 10H3" />
      <path d="M14.7 5.3l-1.1 1.1" />
      <path d="M6.4 13.6l-1.1 1.1" />
      <path d="M14.7 14.7l-1.1-1.1" />
      <path d="M6.4 6.4L5.3 5.3" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      aria-hidden="true"
      {...stroke}
    >
      <path d="M14.5 11.5a5.5 5.5 0 01-7-7 5.5 5.5 0 107 7z" />
    </svg>
  );
}
