import type React from "react";
import type { VolunteerStatus } from "../types/models";
import { areaBadgeStyle, statusLabel, statusStyle } from "../utils/presentation";

export function BtnPrimary({ onClick, children, full }: { onClick?: () => void; children: React.ReactNode; full?: boolean }) {
  return (
    <button onClick={onClick}
      style={{ background: "#22c55e", color: "#000", fontWeight: 700, padding: full ? "0.85rem" : "0.8rem 1.8rem", borderRadius: 10, border: "none", cursor: "pointer", fontSize: full ? "1rem" : "1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", width: full ? "100%" : undefined, justifyContent: full ? "center" : undefined, transition: "all 0.2s" }}
      onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "#16a34a"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
      onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "#22c55e"; (e.currentTarget as HTMLButtonElement).style.color = "#000"; }}>
      {children}
    </button>
  );
}

export function BtnSecondary({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      style={{ background: "transparent", color: "#fff", fontWeight: 600, padding: "0.8rem 1.8rem", borderRadius: 10, border: "1px solid #ffffff30", cursor: "pointer", fontSize: "1rem", transition: "all 0.2s" }}>
      {children}
    </button>
  );
}

export function BtnSm({ onClick, children, outline }: { onClick?: () => void; children: React.ReactNode; outline?: boolean }) {
  return (
    <button onClick={onClick}
      style={{ background: outline ? "transparent" : "#22c55e", color: outline ? "#22c55e" : "#000", fontWeight: 700, padding: "0.5rem 1.2rem", borderRadius: 8, border: outline ? "1.5px solid #22c55e" : "none", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s" }}>
      {children}
    </button>
  );
}

export function Badge({ label, style: s }: { label: string; style?: React.CSSProperties }) {
  return <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: 99, background: "#f3f4f6", color: "#374151", ...s }}>{label}</span>;
}

export function AreaBadge({ area }: { area: string }) {
  const s = areaBadgeStyle[area] || { bg: "#f3f4f6", color: "#374151" };
  return <Badge label={area} style={{ background: s.bg, color: s.color }} />;
}

export function StatusBadge({ status }: { status: VolunteerStatus }) {
  const s = statusStyle[status];
  return <Badge label={statusLabel[status]} style={{ background: s.bg, color: s.color }} />;
}

export function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.5rem", color: "#374151" }}>{label}</label>
      {children}
    </div>
  );
}

export function FormInput({ placeholder, type = "text" }: { placeholder: string; type?: string }) {
  return (
    <input type={type} placeholder={placeholder}
      style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
  );
}

export function ModalOverlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", maxWidth: 460, width: "100%", position: "relative", animation: "fadeIn 0.25s ease" }}>
        <button onClick={onClose}
          style={{ position: "absolute", top: "1rem", right: "1rem", background: "#f3f4f6", border: "none", borderRadius: 8, width: 32, height: 32, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        {children}
      </div>
    </div>
  );
}

export function PageHero({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #0a0a0a, #0d1f14)", padding: "3.5rem 1.5rem 3rem", textAlign: "center" }}>
      <h1 style={{ color: "#fff", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, marginBottom: "0.5rem" }}>{title}</h1>
      <p style={{ color: "#9ca3af", fontSize: "1rem", maxWidth: 500, margin: "0 auto" }}>{sub}</p>
    </div>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────

export function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.5rem 0 1.25rem" }}>
      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
    </div>
  );
}

// ── 6. DASHBOARD DA ONG ───────────────────────────────────────────────────
