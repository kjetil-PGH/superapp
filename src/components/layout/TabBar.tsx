import { NavLink } from "react-router-dom";

const tabs = [
  {
    to: "/",
    label: "Oversikt",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect
          x="3"
          y="10"
          width="7"
          height="9"
          rx="1.5"
          stroke={active ? "currentColor" : "#BFBFBF"}
          strokeWidth="1.6"
        />
        <rect
          x="12"
          y="3"
          width="7"
          height="16"
          rx="1.5"
          stroke={active ? "currentColor" : "#BFBFBF"}
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
  {
    to: "/recurring",
    label: "Faste",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M4 6h14M4 11h10M4 16h7"
          stroke={active ? "currentColor" : "#BFBFBF"}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: "/insights",
    label: "Innsikt",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle
          cx="11"
          cy="11"
          r="8"
          stroke={active ? "currentColor" : "#BFBFBF"}
          strokeWidth="1.6"
        />
        <path
          d="M11 7v4l3 2"
          stroke={active ? "currentColor" : "#BFBFBF"}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: "/settings",
    label: "Innstillinger",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "currentColor" : "#BFBFBF"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export function TabBar() {
  return (
    <nav className="flex items-center justify-around bg-surface/95 backdrop-blur-md border-t border-border py-4 flex-shrink-0">
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-colors ${isActive ? "text-accent" : "text-ink-4"}`
          }
        >
          {({ isActive }) => (
            <>
              {icon(isActive)}
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
