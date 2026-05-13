"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const c = {
  bg:        "#FFFFFF",
  border:    "#EBF4FF",
  primary:   "#030334",
  textPri:   "#030334",
  textSec:   "#4A6A8A",
  textMuted: "#7A8BAA",
};

const navItems = [
  { label: "Instrument Controls", href: "/admin/instrument-controls" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 240,
      minHeight: "100dvh",
      backgroundColor: c.bg,
      borderRight: `1px solid ${c.border}`,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      boxShadow: "4px 0 24px rgba(3,3,52,0.08)",
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: `1px solid ${c.border}` }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: 26,
          color: c.primary,
          letterSpacing: "-1px",
        }}>
          Clarifin
        </span>
        <span style={{
          display: "block",
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: 11,
          color: "#70AAE4",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginTop: 2,
        }}>
          Admin Panel
        </span>
      </div>

      {/* Nav */}
      <nav style={{ padding: "12px 8px", flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 10,
                marginBottom: 4,
                fontFamily: "var(--font-sans)",
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                color: isActive ? "#FFFFFF" : c.textSec,
                backgroundColor: isActive ? c.primary : "transparent",
                border: isActive ? `1px solid ${c.primary}` : "1px solid transparent",
                textDecoration: "none",
                transition: "all 200ms ease",
                boxShadow: isActive ? "0 4px 16px rgba(3,3,52,0.30)" : "none",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
