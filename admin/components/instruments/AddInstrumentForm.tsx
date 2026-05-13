"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_BASEURL;

const c = {
  bgCard:    "#FFFFFF",
  bgInput:   "#F4F8FE",
  bgSection: "#F4F8FE",
  border:    "#C5DCEF",
  borderLight: "#EBF4FF",
  borderFocus: "#70AAE4",
  primary:   "#030334",
  textPri:   "#030334",
  textSec:   "#4A6A8A",
  textMuted: "#7A8BAA",
  negative:  "#EF4444",
  positive:  "#22C55E",
};
const font = { display: "var(--font-display)", sans: "var(--font-sans)", mono: "var(--font-mono)" };

const INSTRUMENT_TYPE_SUGGESTIONS = ["mutual_fund_equity","mutual_fund_debt","etf","stock","government_scheme","bank_deposit","bond_govt","bond_corporate","reit","invit","p2p","pension","commodity_linked"];
const ASSET_CLASS_SUGGESTIONS      = ["equity","debt","gold","real_estate","infrastructure","hybrid","alternative"];

const RETURN_NATURES  = ["fixed","market_linked","mixed"];
const RISK_LEVELS     = ["low","low_to_moderate","moderate","moderately_high","high","very_high"];
const CAPITAL_PROT    = ["full","partial_insured","none"];
const LIQUIDITY       = ["instant","t1","t2_t3","low","very_low","locked"];
const TAX_TREATMENTS  = ["EEE","EET","ETT","TET","TTT","complex"];
const HORIZONS        = ["short","medium","long","very_long"];
const INFLATION_BEAT  = ["high","moderate","low","negative"];
const GOAL_TAGS       = ["emergency_fund","tax_saving_80c","retirement","wealth_creation","regular_income","child_education","short_term_parking","gold_exposure","real_estate_exposure","inflation_hedge"];

const INIT = {
  instrument_id: "", name: "", description: "", instrument_type: "", asset_class: "",
  return_nature: "", indicative_return_min_pct_pa: "", indicative_return_max_pct_pa: "",
  risk_level: "", capital_protection: "",
  liquidity_level: "", lock_in_years: "",
  typical_cost_pct_pa: "",
  tax_treatment: "", suitable_for_80c: false, tax_deduction_section: "",
  recommended_horizon: "", inflation_beat_potential: "",
  goal_tags: [] as string[],
  ideal_age_min: "", ideal_age_max: "",
  special_features: [] as string[],
};

function buildPayload(f: typeof INIT) {
  const num = (v: string) => v === "" ? null : parseFloat(v);
  return {
    ...f,
    indicative_return_min_pct_pa: num(f.indicative_return_min_pct_pa),
    indicative_return_max_pct_pa: num(f.indicative_return_max_pct_pa),
    lock_in_years:                num(f.lock_in_years),
    typical_cost_pct_pa:          num(f.typical_cost_pct_pa),
    ideal_age_min:                num(f.ideal_age_min),
    ideal_age_max:                num(f.ideal_age_max),
    tax_deduction_section:        f.tax_deduction_section || null,
  };
}

const inputStyle: React.CSSProperties = {
  backgroundColor: c.bgInput,
  border: `1.5px solid ${c.border}`,
  borderRadius: 12,
  height: 52,
  padding: "0 16px",
  color: c.textPri,
  fontFamily: font.sans,
  fontSize: 15,
  outline: "none",
  width: "100%",
  transition: "border-color 200ms, box-shadow 200ms",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{
        fontFamily: font.sans, fontWeight: 700, fontSize: 11, color: "#70AAE4",
        letterSpacing: "1.5px", textTransform: "uppercase",
        margin: "0 0 12px", paddingBottom: 10,
        borderBottom: `1px solid ${c.borderLight}`,
      }}>{title}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, required, full, children }: { label: string; required?: boolean; full?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined, display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: font.sans, fontSize: 13, fontWeight: 500, color: c.textSec }}>
        {label}{required && <span style={{ color: c.primary }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      style={inputStyle}
      value={value}
      placeholder={placeholder ?? ""}
      onChange={e => onChange(e.target.value)}
      onFocus={e => { e.target.style.borderColor = c.borderFocus; e.target.style.boxShadow = "0 0 0 3px rgba(112,170,228,0.15)"; }}
      onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      style={{ ...inputStyle, height: "auto", padding: "12px 16px", resize: "vertical", lineHeight: 1.6 }}
      rows={rows}
      value={value}
      placeholder={placeholder ?? ""}
      onChange={e => onChange(e.target.value)}
      onFocus={e => { e.target.style.borderColor = c.borderFocus; e.target.style.boxShadow = "0 0 0 3px rgba(112,170,228,0.15)"; }}
      onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }}
    />
  );
}

function NumInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      style={inputStyle}
      type="number" step="any"
      value={value}
      placeholder={placeholder ?? ""}
      onChange={e => onChange(e.target.value)}
      onFocus={e => { e.target.style.borderColor = c.borderFocus; e.target.style.boxShadow = "0 0 0 3px rgba(112,170,228,0.15)"; }}
      onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }}
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Select…</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function DatalistInput({ id, value, onChange, options, placeholder }: { id: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <>
      <input
        style={inputStyle}
        list={id}
        value={value}
        placeholder={placeholder ?? "Type or pick…"}
        onChange={e => onChange(e.target.value)}
        onFocus={e => { e.target.style.borderColor = c.borderFocus; e.target.style.boxShadow = "0 0 0 3px rgba(112,170,228,0.15)"; }}
        onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }}
      />
      <datalist id={id}>{options.map(o => <option key={o} value={o} />)}</datalist>
    </>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: font.sans, fontSize: 13, fontWeight: 500, color: c.textSec }}>{label}</label>
      <button type="button" onClick={() => onChange(!value)} style={{
        height: 52, borderRadius: 12, cursor: "pointer",
        border: `1.5px solid ${value ? c.primary : c.border}`,
        backgroundColor: value ? `${c.primary}15` : c.bgInput,
        color: value ? c.primary : c.textMuted,
        fontFamily: font.sans, fontSize: 15, fontWeight: value ? 600 : 400,
        transition: "all 200ms ease",
      }}>{value ? "Yes" : "No"}</button>
    </div>
  );
}

function GoalTagsField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (tag: string) =>
    onChange(value.includes(tag) ? value.filter(t => t !== tag) : [...value, tag]);
  return (
    <Field label="Goal Tags" full>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {GOAL_TAGS.map(tag => {
          const active = value.includes(tag);
          return (
            <button key={tag} type="button" onClick={() => toggle(tag)} style={{
              padding: "6px 14px", borderRadius: 9999, cursor: "pointer",
              border: `1.5px solid ${active ? c.primary : c.border}`,
              backgroundColor: active ? `${c.primary}15` : c.bgInput,
              color: active ? c.primary : c.textMuted,
              fontFamily: font.sans, fontSize: 12, fontWeight: active ? 600 : 400,
              transition: "all 200ms ease",
            }}>{tag}</button>
          );
        })}
      </div>
    </Field>
  );
}

function SpecialFeaturesField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => { if (draft.trim()) { onChange([...value, draft.trim()]); setDraft(""); } };
  return (
    <Field label="Special Features" full>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          style={{ ...inputStyle, flex: 1 }}
          value={draft}
          placeholder="Add a plain-English fact…"
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          onFocus={e => { e.target.style.borderColor = c.borderFocus; e.target.style.boxShadow = "0 0 0 3px rgba(112,170,228,0.15)"; }}
          onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }}
        />
        <button type="button" onClick={add} style={{
          padding: "0 20px", height: 52, borderRadius: 12, cursor: "pointer",
          backgroundColor: c.primary,
          border: "none",
          color: "#FFFFFF",
          fontFamily: font.sans, fontSize: 14, fontWeight: 600,
          boxShadow: "0 4px 12px rgba(3,3,52,0.20)",
        }}>Add</button>
      </div>
      {value.map((f, i) => (
        <div key={i} style={{
          display: "flex", gap: 8, padding: "10px 14px", marginBottom: 6,
          backgroundColor: c.bgSection, borderRadius: 10, border: `1px solid ${c.borderLight}`,
        }}>
          <span style={{ flex: 1, fontFamily: font.sans, fontSize: 13, color: c.textSec, lineHeight: 1.6 }}>{f}</span>
          <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} style={{
            background: "none", border: "none", color: c.negative, cursor: "pointer",
            fontFamily: font.sans, fontSize: 12, fontWeight: 500,
          }}>Remove</button>
        </div>
      ))}
    </Field>
  );
}

export default function AddInstrumentForm() {
  const [form, setForm] = useState(INIT);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<string[]>([]);

  const set = (key: keyof typeof INIT) => (val: string | boolean | string[]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading"); setErrors([]);
    try {
      const res = await fetch(`${API}/api/v1/admin/instruments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form)),
      });
      const data = await res.json();
      if (!res.ok) { setErrors(data.errors ?? [data.message]); setStatus("error"); }
      else { setStatus("success"); setForm(INIT); }
    } catch {
      setErrors(["Network error — is the backend running?"]); setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <Section title="Identity">
        <Field label="Instrument ID" required>
          <TextInput value={form.instrument_id} onChange={set("instrument_id")} placeholder="ppf, elss, bank-fd…" />
        </Field>
        <Field label="Name" required>
          <TextInput value={form.name} onChange={set("name")} placeholder="PPF — Public Provident Fund" />
        </Field>
        <Field label="Description" full>
          <TextArea value={form.description} onChange={set("description")} rows={3} placeholder="2–4 sentences explaining what this instrument is, how it works, and who it's for…" />
        </Field>
        <Field label="Instrument Type" required>
          <DatalistInput id="dl-type" value={form.instrument_type} onChange={set("instrument_type")} options={INSTRUMENT_TYPE_SUGGESTIONS} placeholder="government_scheme, crypto…" />
        </Field>
        <Field label="Asset Class" required>
          <DatalistInput id="dl-class" value={form.asset_class} onChange={set("asset_class")} options={ASSET_CLASS_SUGGESTIONS} placeholder="equity, debt, gold…" />
        </Field>
      </Section>

      <Section title="Returns">
        <Field label="Return Nature" required>
          <Select value={form.return_nature} onChange={set("return_nature")} options={RETURN_NATURES} />
        </Field>
        <div />
        <Field label="Indicative Return Min % p.a.">
          <NumInput value={form.indicative_return_min_pct_pa} onChange={set("indicative_return_min_pct_pa")} placeholder="null for market-linked" />
        </Field>
        <Field label="Indicative Return Max % p.a.">
          <NumInput value={form.indicative_return_max_pct_pa} onChange={set("indicative_return_max_pct_pa")} placeholder="null for market-linked" />
        </Field>
      </Section>

      <Section title="Risk">
        <Field label="Risk Level" required>
          <Select value={form.risk_level} onChange={set("risk_level")} options={RISK_LEVELS} />
        </Field>
        <Field label="Capital Protection" required>
          <Select value={form.capital_protection} onChange={set("capital_protection")} options={CAPITAL_PROT} />
        </Field>
      </Section>

      <Section title="Liquidity">
        <Field label="Liquidity Level" required>
          <Select value={form.liquidity_level} onChange={set("liquidity_level")} options={LIQUIDITY} />
        </Field>
        <Field label="Lock-in Years">
          <NumInput value={form.lock_in_years} onChange={set("lock_in_years")} placeholder="3 for ELSS, 15 for PPF…" />
        </Field>
      </Section>

      <Section title="Cost">
        <Field label="Typical Cost % p.a." required>
          <NumInput value={form.typical_cost_pct_pa} onChange={set("typical_cost_pct_pa")} placeholder="0 for govt schemes, 0.5 for MF…" />
        </Field>
        <div />
      </Section>

      <Section title="Taxation">
        <Field label="Tax Treatment" required>
          <Select value={form.tax_treatment} onChange={set("tax_treatment")} options={TAX_TREATMENTS} />
        </Field>
        <Field label="Tax Deduction Section">
          <TextInput value={form.tax_deduction_section} onChange={set("tax_deduction_section")} placeholder="80C, 80CCD(1B)…" />
        </Field>
        <Toggle label="Suitable for 80C" value={form.suitable_for_80c} onChange={set("suitable_for_80c")} />
        <div />
      </Section>

      <Section title="Horizon & Goals">
        <Field label="Recommended Horizon" required>
          <Select value={form.recommended_horizon} onChange={set("recommended_horizon")} options={HORIZONS} />
        </Field>
        <Field label="Inflation Beat Potential" required>
          <Select value={form.inflation_beat_potential} onChange={set("inflation_beat_potential")} options={INFLATION_BEAT} />
        </Field>
        <GoalTagsField value={form.goal_tags} onChange={v => set("goal_tags")(v)} />
      </Section>

      <Section title="Ideal Age Group">
        <Field label="Best from age">
          <NumInput value={form.ideal_age_min} onChange={set("ideal_age_min")} placeholder="18 for ELSS, 60 for SCSS… (null = any)" />
        </Field>
        <Field label="Best until age">
          <NumInput value={form.ideal_age_max} onChange={set("ideal_age_max")} placeholder="10 for SSY, 55 for NPS… (null = any)" />
        </Field>
      </Section>

      <Section title="Special Features">
        <SpecialFeaturesField value={form.special_features} onChange={v => set("special_features")(v)} />
      </Section>

      {status === "error" && errors.length > 0 && (
        <div style={{ marginBottom: 20, padding: 16, borderRadius: 14, backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
          {errors.map((e, i) => <p key={i} style={{ fontFamily: font.sans, fontSize: 13, color: c.negative, margin: "2px 0" }}>{e}</p>)}
        </div>
      )}

      {status === "success" && (
        <div style={{ marginBottom: 20, padding: 16, borderRadius: 14, backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <p style={{ fontFamily: font.sans, fontSize: 13, color: "#166534", margin: 0 }}>Instrument created successfully.</p>
        </div>
      )}

      <button type="submit" disabled={status === "loading"} style={{
        width: "100%", height: 54, borderRadius: 9999, border: "none",
        cursor: status === "loading" ? "not-allowed" : "pointer",
        backgroundColor: "#030334",
        color: "#FFFFFF",
        fontFamily: font.sans, fontWeight: 600, fontSize: 15,
        opacity: status === "loading" ? 0.6 : 1,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        transition: "opacity 200ms",
      }}>
        {status === "loading" ? "Creating…" : "Create Instrument"}
      </button>
    </form>
  );
}
