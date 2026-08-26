import type { ReactNode } from "react";

type IconProps = {
  size?: number;
  strokeWidth?: number;
};

function Svg({
  size = 20,
  strokeWidth = 2,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function CheckIcon({ size = 18, strokeWidth = 2.5 }: IconProps) {
  return (
    <Svg size={size} strokeWidth={strokeWidth}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

export function WarningIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </Svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 16v-4M12 8h.01M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" />
    </Svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 8v4l3 3M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" />
    </Svg>
  );
}

export function BrokenChartIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v10M3 9v10a2 2 0 0 0 2 2h10m-9-5 4-4 3 3 5-6" />
    </Svg>
  );
}

export function TrendIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />
    </Svg>
  );
}

export function MoneyIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2 4 5v6c0 5.5 3.4 9.7 8 11 4.6-1.3 8-5.5 8-11V5l-8-3Z" />
    </Svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="1" y="6" width="15" height="12" rx="2" />
      <path d="M16 10h3l3 3v3h-6z" />
      <circle cx="6" cy="18.5" r="1.5" />
      <circle cx="17.5" cy="18.5" r="1.5" />
    </Svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 2v4M16 2v4" />
    </Svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </Svg>
  );
}

export function RerouteIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 4v6a4 4 0 0 0 4 4h9m0 0-4-4m4 4-4 4" />
    </Svg>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8Z" />
      <path d="M3.3 7 12 12l8.7-5M12 22V12" />
    </Svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

export function ReportIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M16 13H8M16 17H8" />
    </Svg>
  );
}
