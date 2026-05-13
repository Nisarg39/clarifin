"use client";

import { useEffect } from "react";

const c = {
  bgApp:     "#EBF4FF",
  bgCard:    "#FFFFFF",
  bgSection: "#F4F8FE",
  border:    "#EBF4FF",
  borderDef: "#C5DCEF",
  primary:   "#030334",
  textPri:   "#030334",
  textSec:   "#4A6A8A",
  textMuted: "#7A8BAA",
  negative:  "#EF4444",
  positive:  "#22C55E",
};
const font = { display: "var(--font-display)", sans: "var(--font-sans)", mono: "var(--font-mono)" };

const RISK_STYLE: Record<string, { bg: string; text: string; border: string; label: string }> = {
  low:             { bg: "#DCFCE7", text: "#166534", border: "#BBF7D0", label: "Low" },
  low_to_moderate: { bg: "#D1FAE5", text: "#065F46", border: "#A7F3D0", label: "Low–Moderate" },
  moderate:        { bg: "#FEF9C3", text: "#854D0E", border: "#FEF08A", label: "Moderate" },
  moderately_high: { bg: "#FFEDD5", text: "#9A3412", border: "#FED7AA", label: "Mod. High" },
  high:            { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA", label: "High" },
  very_high:       { bg: "#FFE4E6", text: "#9F1239", border: "#FECDD3", label: "Very High" },
};

const HORIZON_LABEL: Record<string, string> = {
  short: "Short (<3 yr)", medium: "Medium (3–7 yr)", long: "Long (>7 yr)", very_long: "Very Long (>15 yr)",
};

type Instrument = {
  _id: string;
  instrument_id: string; name: string; description: string; instrument_type: string; asset_class: string;
  return_nature: string; indicative_return_min_pct_pa: number | null; indicative_return_max_pct_pa: number | null;
  risk_level: string; capital_protection: string; liquidity_level: string; lock_in_years: number | null;
  typical_cost_pct_pa: number; tax_treatment: string; suitable_for_80c: boolean;
  tax_deduction_section: string | null; recommended_horizon: string; inflation_beat_potential: string;
  goal_tags: string[]; ideal_age_min: number | null; ideal_age_max: number | null;
  special_features: string[]; createdAt?: string;
};

export default function InstrumentDetail({ instrument: inst, onClose }: { instrument: Instrument; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const risk = RISK_STYLE[inst.risk_level] ?? { bg: "#F4F8FE", text: "#4A6A8A", border: "#C5DCEF", label: inst.risk_level };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        backgroundColor: "rgba(3,3,52,0.35)",
        backdropFilter: "blur(4px)",
        display: "flex", justifyContent: "flex-end",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "min(600px, 95vw)", height: "100vh",
          backgroundColor: c.bgCard,
          borderLeft: `1px solid ${c.border}`,
          boxShadow: "-8px 0 40px rgba(3,3,52,0.08)",
          overflowY: "auto",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Sticky header */}
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: `1px solid ${c.border}`,
          position: "sticky", top: 0,
          backgroundColor: c.bgCard, zIndex: 1,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1, paddingRight: 12 }}>
              <p style={{ fontFamily: font.mono, fontSize: 11, color: c.textMuted, margin: "0 0 4px", letterSpacing: "0.5px" }}>
                {inst.instrument_id}
              </p>
              <h2 style={{ fontFamily: font.display, fontWeight: 800, fontSize: 20, color: c.textPri, margin: 0, lineHeight: 1.2 }}>
                {inst.name}
              </h2>
            </div>
            <button type="button" onClick={onClose} style={{
              width: 36, height: 36, borderRadius: 9999, cursor: "pointer",
              backgroundColor: c.bgSection, border: `1px solid ${c.border}`,
              color: c.textMuted, fontFamily: font.sans, fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>✕</button>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
            <Badge label={inst.instrument_type} />
            <Badge label={inst.asset_class} />
            <span style={{
              padding: "4px 12px", borderRadius: 9999,
              backgroundColor: risk.bg, border: `1px solid ${risk.border}`,
              fontFamily: font.sans, fontSize: 11, fontWeight: 600, color: risk.text,
            }}>{risk.label} Risk</span>
            <Badge label={inst.return_nature} />
            {inst.suitable_for_80c && <Badge label="80C eligible" accent />}
          </div>

          {/* Description */}
          {inst.description && (
            <p style={{
              fontFamily: font.sans, fontSize: 13, color: c.textSec,
              lineHeight: 1.7, margin: "14px 0 0",
              paddingTop: 14, borderTop: `1px solid ${c.border}`,
            }}>{inst.description}</p>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 24 }}>

          <Section title="Returns">
            <Row label="Return Nature" value={inst.return_nature} />
            <Row label="Indicative Min" value={inst.indicative_return_min_pct_pa != null ? `${inst.indicative_return_min_pct_pa}% p.a.` : "—"} mono />
            <Row label="Indicative Max" value={inst.indicative_return_max_pct_pa != null ? `${inst.indicative_return_max_pct_pa}% p.a.` : "—"} mono />
          </Section>

          <Section title="Risk">
            <Row label="Risk Level" value={risk.label} valueColor={risk.text} />
            <Row label="Capital Protection" value={inst.capital_protection} />
            <Row label="Inflation Beat" value={inst.inflation_beat_potential} />
          </Section>

          <Section title="Liquidity">
            <Row label="Liquidity Level" value={inst.liquidity_level} />
            <Row label="Lock-in Period" value={inst.lock_in_years != null ? `${inst.lock_in_years} yr${inst.lock_in_years !== 1 ? "s" : ""}` : "None"} mono />
          </Section>

          <Section title="Cost">
            <Row label="Typical Cost % p.a." value={`${inst.typical_cost_pct_pa}%`} mono />
          </Section>

          <Section title="Taxation">
            <Row label="Tax Treatment" value={inst.tax_treatment} mono />
            <Row label="80C Eligible" value={inst.suitable_for_80c ? "Yes" : "No"} valueColor={inst.suitable_for_80c ? c.positive : c.textMuted} />
            <Row label="Deduction Section" value={inst.tax_deduction_section ?? "—"} />
          </Section>

          <Section title="Horizon & Goals">
            <Row label="Recommended Horizon" value={HORIZON_LABEL[inst.recommended_horizon] ?? inst.recommended_horizon} />
          </Section>

          {inst.goal_tags.length > 0 && (
            <div>
              <SectionTitle title="Goal Tags" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {inst.goal_tags.map(tag => <Badge key={tag} label={tag} accent />)}
              </div>
            </div>
          )}

          <Section title="Ideal Age Group">
            <Row label="Best from age" value={inst.ideal_age_min != null ? `${inst.ideal_age_min} yrs` : "Any age"} />
            <Row label="Best until age" value={inst.ideal_age_max != null ? `${inst.ideal_age_max} yrs` : "Any age"} />
          </Section>

          {inst.special_features.length > 0 && (
            <div>
              <SectionTitle title="Special Features" />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {inst.special_features.map((f, i) => (
                  <div key={i} style={{
                    padding: "10px 14px", borderRadius: 10,
                    backgroundColor: c.bgSection, border: `1px solid ${c.border}`,
                    fontFamily: font.sans, fontSize: 13, color: c.textSec, lineHeight: 1.6,
                  }}>{f}</div>
                ))}
              </div>
            </div>
          )}

          {inst.createdAt && (
            <p style={{ fontFamily: font.mono, fontSize: 11, color: `${c.textMuted}88`, margin: 0 }}>
              Created {new Date(inst.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <p style={{
      fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 11, color: "#70AAE4",
      letterSpacing: "1.5px", textTransform: "uppercase",
      margin: "0 0 10px", paddingBottom: 8, borderBottom: `1px solid ${c.border}`,
    }}>{title}</p>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SectionTitle title={title} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 0" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, valueColor, mono }: { label: string; value: string; valueColor?: string; mono?: boolean }) {
  return (
    <>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: c.textMuted }}>{label}</span>
      <span style={{
        fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
        fontSize: 13,
        color: valueColor ?? c.textPri,
        fontWeight: 500,
      }}>{value}</span>
    </>
  );
}

function Badge({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span style={{
      padding: "4px 12px", borderRadius: 9999,
      backgroundColor: accent ? "#EBF4FF" : "#F4F8FE",
      border: `1px solid ${accent ? "#70AAE4" : "#EBF4FF"}`,
      fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
      color: accent ? "#1E4D8C" : c.textSec,
      letterSpacing: "0.3px",
    }}>{label}</span>
  );
}
