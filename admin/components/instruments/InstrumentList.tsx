"use client";

import { useState, useEffect, useCallback } from "react";
import InstrumentDetail from "./InstrumentDetail";

const API = process.env.NEXT_PUBLIC_BASEURL;

const c = {
  bgCard:    "#FFFFFF",
  bgSection: "#F4F8FE",
  border:    "#EBF4FF",
  primary:   "#030334",
  textPri:   "#030334",
  textSec:   "#4A6A8A",
  textMuted: "#7A8BAA",
  negative:  "#EF4444",
};
const font = { sans: "var(--font-sans)", mono: "var(--font-mono)" };

const RISK_STYLE: Record<string, { bg: string; text: string; border: string; label: string }> = {
  low:             { bg: "#DCFCE7", text: "#166534", border: "#BBF7D0", label: "Low" },
  low_to_moderate: { bg: "#D1FAE5", text: "#065F46", border: "#A7F3D0", label: "Low–Moderate" },
  moderate:        { bg: "#FEF9C3", text: "#854D0E", border: "#FEF08A", label: "Moderate" },
  moderately_high: { bg: "#FFEDD5", text: "#9A3412", border: "#FED7AA", label: "Mod. High" },
  high:            { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA", label: "High" },
  very_high:       { bg: "#FFE4E6", text: "#9F1239", border: "#FECDD3", label: "Very High" },
};

type Instrument = {
  _id: string;
  instrument_id: string;
  name: string;
  description: string;
  instrument_type: string;
  asset_class: string;
  return_nature: string;
  indicative_return_min_pct_pa: number | null;
  indicative_return_max_pct_pa: number | null;
  risk_level: string;
  capital_protection: string;
  liquidity_level: string;
  lock_in_years: number | null;
  typical_cost_pct_pa: number;
  tax_treatment: string;
  suitable_for_80c: boolean;
  tax_deduction_section: string | null;
  recommended_horizon: string;
  inflation_beat_potential: string;
  goal_tags: string[];
  ideal_age_min: number | null;
  ideal_age_max: number | null;
  special_features: string[];
  createdAt?: string;
};

type Pagination = { page: number; limit: number; total: number; pages: number };

export default function InstrumentList() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Instrument | null>(null);

  const fetchPage = useCallback(async (page: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/v1/admin/instruments?page=${page}&limit=10`);
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? "Failed to load"); return; }
      setInstruments(data.data);
      setPagination(data.pagination);
    } catch {
      setError("Network error — is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPage(1); }, [fetchPage]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
      <div style={{ fontFamily: font.sans, fontSize: 14, color: c.textMuted }}>Loading instruments…</div>
    </div>
  );

  if (error) return (
    <div style={{ padding: 16, borderRadius: 14, backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
      <p style={{ fontFamily: font.sans, fontSize: 13, color: c.negative, margin: 0 }}>{error}</p>
    </div>
  );

  if (instruments.length === 0) return (
    <div style={{ textAlign: "center", padding: 60 }}>
      <p style={{ fontFamily: font.sans, fontSize: 14, color: c.textMuted }}>No instruments yet. Create one above.</p>
    </div>
  );

  return (
    <>
      {/* Header count */}
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: font.sans, fontSize: 13, color: c.textMuted }}>
          {pagination.total} instrument{pagination.total !== 1 ? "s" : ""} total
        </span>
        <span style={{ fontFamily: font.sans, fontSize: 13, color: c.textMuted }}>
          Page {pagination.page} of {pagination.pages}
        </span>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {instruments.map(inst => {
          const risk = RISK_STYLE[inst.risk_level] ?? { bg: "#F4F8FE", text: "#4A6A8A", border: "#C5DCEF", label: inst.risk_level };
          return (
            <button
              key={inst._id}
              type="button"
              onClick={() => setSelected(inst)}
              style={{
                display: "flex", flexDirection: "column", gap: 10, textAlign: "left",
                padding: 16, borderRadius: 20, cursor: "pointer",
                backgroundColor: c.bgCard,
                border: `1px solid ${c.border}`,
                boxShadow: "0 4px 20px rgba(3,3,52,0.05)",
                transition: "box-shadow 200ms, border-color 200ms",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(3,3,52,0.08)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#C5DCEF";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(3,3,52,0.05)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = c.border;
              }}
            >
              {/* Top row: name + risk badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <span style={{
                  fontFamily: font.sans, fontWeight: 600, fontSize: 14, color: c.textPri,
                  lineHeight: 1.3, flex: 1,
                }}>{inst.name}</span>
                <span style={{
                  flexShrink: 0, padding: "4px 12px", borderRadius: 9999,
                  backgroundColor: risk.bg,
                  border: `1px solid ${risk.border}`,
                  fontFamily: font.sans, fontSize: 11, fontWeight: 600,
                  color: risk.text, whiteSpace: "nowrap",
                }}>{risk.label}</span>
              </div>

              {/* Meta tags */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Tag label={inst.instrument_type} />
                <Tag label={inst.asset_class} />
                {inst.suitable_for_80c && <Tag label="80C" accent />}
              </div>

              {/* Description snippet */}
              {inst.description ? (
                <span style={{
                  fontFamily: font.sans, fontSize: 12, color: c.textMuted,
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>{inst.description}</span>
              ) : (
                <span style={{ fontFamily: font.sans, fontSize: 11, color: c.textMuted }}>
                  Click to view all metrics →
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          <PageBtn label="← Prev" disabled={pagination.page === 1} onClick={() => fetchPage(pagination.page - 1)} />
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
            <PageBtn key={p} label={String(p)} active={p === pagination.page} onClick={() => fetchPage(p)} />
          ))}
          <PageBtn label="Next →" disabled={pagination.page === pagination.pages} onClick={() => fetchPage(pagination.page + 1)} />
        </div>
      )}

      {selected && <InstrumentDetail instrument={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function Tag({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 9999,
      backgroundColor: accent ? "#EBF4FF" : "#F4F8FE",
      border: `1px solid ${accent ? "#70AAE4" : "#EBF4FF"}`,
      fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
      color: accent ? "#1E4D8C" : "#4A6A8A",
      letterSpacing: "0.3px",
    }}>{label}</span>
  );
}

function PageBtn({ label, onClick, disabled, active }: { label: string; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{
      minWidth: 36, height: 36, padding: "0 12px",
      borderRadius: 9999, cursor: disabled ? "default" : "pointer",
      backgroundColor: active ? "#030334" : "#FFFFFF",
      border: `1px solid ${active ? "#030334" : "#EBF4FF"}`,
      color: active ? "#FFFFFF" : disabled ? "rgba(112,170,228,0.40)" : "#4A6A8A",
      fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: active ? 600 : 500,
      transition: "all 200ms",
      boxShadow: active ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
    }}>{label}</button>
  );
}
