import { useState } from "react";
import type React from "react";
import type { Organization, Project } from "../types/models";
import { getOrganization } from "../utils/presentation";
import { AreaBadge, Badge, BtnSm } from "./ui";

export function OrganizationCard({ organization, onClick, extraAction }: { organization: Organization; onClick: () => void; extraAction?: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}
      style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: `1px solid ${hov ? "#22c55e" : "#e5e7eb"}`, transition: "all 0.25s", cursor: "pointer", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? "0 12px 32px #00000015" : "none" }}>
      <div style={{ background: "linear-gradient(135deg,#1a2e1a,#0d1f0d)", height: 120, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {organization.image ? <img src={organization.image} alt={`Logo da ${organization.name}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "3.5rem" }}>{organization.icon}</span>}
      </div>
      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          <AreaBadge area={organization.cause} />
          <Badge label={`👥 ${organization.memberCount}`} />
        </div>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.35rem" }}>{organization.name}</h3>
        <p style={{ color: "#4b5563", fontSize: "0.88rem", marginBottom: "0.5rem", lineHeight: 1.5 }}>{organization.description.slice(0, 90)}...</p>
        <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.75rem" }}>📍 {organization.city}</p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <BtnSm onClick={onClick}>Ver mais</BtnSm>
          {extraAction}
        </div>
      </div>
    </div>
  );
}

export function ProjectCard({ project, hasApplied, onApply }: { project: Project; hasApplied: boolean; onApply: () => void }) {
  const organization = getOrganization(project.organizationId);
  return (
    <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #e5e7eb" }}>
      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          <Badge label="Voluntariado" style={{ background: "#dcfce7", color: "#166534" }} />
          <AreaBadge area={project.cause} />
        </div>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.25rem" }}>{project.title}</h3>
        <p style={{ color: "#4b5563", fontSize: "0.88rem", marginBottom: "0.5rem" }}>{organization.name} · {project.city} · {project.schedule}</p>
        <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.75rem" }}>🎯 {project.slots} vagas disponíveis</p>
        <BtnSm onClick={onApply}>{hasApplied ? "✓ Inscrito" : "Candidatar-se"}</BtnSm>
      </div>
    </div>
  );
}

export function ProjectRow({ project, hasApplied, onApply }: { project: Project; hasApplied: boolean; onApply: () => void }) {
  const organization = getOrganization(project.organizationId);
  const areaIcons: Record<string, string> = { "Saúde": "🏥", "Assistência Social": "🤝", "Meio Ambiente": "🌿", "Educação": "📚" };
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb" }}>
      <div style={{ padding: "1.25rem", display: "flex", alignItems: "flex-start", gap: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ fontSize: "2.5rem", lineHeight: 1 }}>{areaIcons[project.cause] || "📋"}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
            <Badge label="Voluntariado" style={{ background: "#dcfce7", color: "#166534" }} />
            <AreaBadge area={project.cause} />
            <Badge label={project.city} />
          </div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.25rem" }}>{project.title}</h3>
          <p style={{ color: "#4b5563", fontSize: "0.88rem" }}>{organization.name} · {project.slots} vagas · {project.schedule}</p>
        </div>
        <BtnSm onClick={onApply}>{hasApplied ? "✓ Inscrito" : "Candidatar-se"}</BtnSm>
      </div>
    </div>
  );
}

// ── DOAR PAGE ─────────────────────────────────────────────────────────────
