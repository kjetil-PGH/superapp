import { NavLink } from "react-router-dom";

const tabs = [
  {
    to: "/",
    label: "Hjem",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.5z"
          stroke={active ? "currentColor" : "#BFBFBF"}
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.12 : 0}
        />
        <rect
          x="9"
          y="14"
          width="6"
          height="7"
          rx="1"
          stroke={active ? "currentColor" : "#BFBFBF"}
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
  {
    to: "/budget",
    label: "Budsjett",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="14"
          width="4"
          height="7"
          rx="1"
          stroke={active ? "currentColor" : "#BFBFBF"}
          strokeWidth="1.6"
        />
        <rect
          x="10"
          y="9"
          width="4"
          height="12"
          rx="1"
          stroke={active ? "currentColor" : "#BFBFBF"}
          strokeWidth="1.6"
        />
        <rect
          x="17"
          y="3"
          width="4"
          height="18"
          rx="1"
          stroke={active ? "currentColor" : "#BFBFBF"}
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
  {
    to: "/economy",
    label: "Økonomi",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={active ? "currentColor" : "#BFBFBF"}
          strokeWidth="1.6"
        />
        <path
          d="M12 7v2m0 6v2m-3-7h1.5a1.5 1.5 0 0 1 0 3H11a1.5 1.5 0 0 0 0 3h1.5M12 7h-1.5M12 7h1.5m-3 10h3"
          stroke={active ? "currentColor" : "#BFBFBF"}
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: "/ask",
    label: "Spør",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 12a9 9 0 0 1-9 9 9.1 9.1 0 0 1-4.25-1.05L3 21l1.05-4.75A9.1 9.1 0 0 1 3 12a9 9 0 0 1 18 0z"
          stroke={active ? "currentColor" : "#BFBFBF"}
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.12 : 0}
        />
        <circle cx="8" cy="12" r="1" fill={active ? "currentColor" : "#BFBFBF"} />
        <circle cx="12" cy="12" r="1" fill={active ? "currentColor" : "#BFBFBF"} />
        <circle cx="16" cy="12" r="1" fill={active ? "currentColor" : "#BFBFBF"} />
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
    <nav className="flex items-center justify-around bg-surface/95 backdrop-blur-md border-t border-border py-3 flex-shrink-0">
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${isActive ? "text-accent" : "text-ink-4"}`
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
