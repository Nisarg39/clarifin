"use client";

import { useState } from "react";
import AddInstrumentForm from "@/components/instruments/AddInstrumentForm";
import InstrumentList from "@/components/instruments/InstrumentList";

type Tab = "create" | "list";

export default function InstrumentControlsPage() {
  const [tab, setTab] = useState<Tab>("create");

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 36,
          color: "#030334", letterSpacing: "-1.5px", margin: 0,
        }}>
          Instrument Controls
        </h1>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 15, color: "#4A6A8A",
          marginTop: 6, marginBottom: 0,
        }}>
          Manage investment instruments in the Clarifin database.
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 24,
        padding: 4, borderRadius: 14,
        backgroundColor: "#FFFFFF",
        border: "1px solid #EBF4FF",
        width: "fit-content",
        boxShadow: "0 4px 20px rgba(3,3,52,0.08)",
      }}>
        <TabBtn label="Create Instrument" active={tab === "create"} onClick={() => setTab("create")} />
        <TabBtn label="All Instruments"   active={tab === "list"}   onClick={() => setTab("list")}   />
      </div>

      {/* Panel */}
      <div style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(112,170,228,0.15)",
        borderRadius: 20,
        padding: 32,
        boxShadow: "0 8px 32px rgba(3,3,52,0.08)",
      }}>
        {tab === "create" ? <AddInstrumentForm /> : <InstrumentList />}
      </div>
    </div>
  );
}

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 18px",
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        color: active ? "#FFFFFF" : "#4A6A8A",
        backgroundColor: active ? "#030334" : "transparent",
        transition: "all 200ms ease",
        boxShadow: active ? "0 4px 12px rgba(3,3,52,0.30)" : "none",
      }}
    >
      {label}
    </button>
  );
}
