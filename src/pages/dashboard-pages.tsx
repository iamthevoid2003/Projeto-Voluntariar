import { useState } from "react";
import type React from "react";
import type { Organization, OrganizationDashboardTab, OrganizationMember, Project, VolunteerApplication, VolunteerDashboardTab, VolunteerProfile, VolunteerStatus, PageNavigation } from "../types/models";
import { projects } from "../data/mock-data";
import { getOrganization, getProject } from "../utils/presentation";
import { Badge, BtnPrimary, BtnSm, FormGroup, SectionDivider, StatusBadge } from "../components/ui";
import { statusLabel, statusStyle } from "../utils/presentation";

export const statusOportunidade: Record<string, { bg: string; color: string; label: string }> = {
  ativa:     { bg: "#dcfce7", color: "#166534", label: "Ativa" },
  encerrada: { bg: "#fee2e2", color: "#991b1b", label: "Encerrada" },
  rascunho:  { bg: "#fef3c7", color: "#92400e", label: "Rascunho" },
};

export const statusOportunidades = ["ativa", "ativa", "encerrada", "rascunho", "ativa", "ativa", "ativa", "ativa", "ativa"];

export function VolunteerDashboardPage({ profile, myApplications, myOrganizationMembers, dashTab, setDashTab, nav, onLogout }: {
  profile: VolunteerProfile; myApplications: VolunteerApplication[]; myOrganizationMembers: OrganizationMember[];
  dashTab: VolunteerDashboardTab; setDashTab: (tab: VolunteerDashboardTab) => void; nav: PageNavigation; onLogout: () => void;
}) {
  const countStatus = (s: VolunteerStatus) => myApplications.filter(v => v.status === s).length;

  return (
    <section style={{ padding: "2.5rem 1.5rem", minHeight: "calc(100vh - 64px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem" }}>

        {/* Sidebar */}
        <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "1.5rem", alignSelf: "start" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#166534)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: "1rem" }}>👤</div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem" }}>{profile.name}</div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem", marginBottom: "1.5rem" }}>@{profile.username} · {profile.city}</div>
          <nav>
            {[
              { id: "overview" as const, label: "🏠 Visão Geral" },
              { id: "applications" as const, label: "💼 Meus Voluntariados" },
              { id: "organizationMembers" as const, label: "🏢 Minhas ONGs (Membro)" },
            ].map(item => (
              <button key={item.id} onClick={() => setDashTab(item.id)}
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: dashTab === item.id ? "#22c55e" : "#9ca3af", background: dashTab === item.id ? "#ffffff10" : "transparent", textDecoration: "none", padding: "0.65rem 0.75rem", borderRadius: 8, fontSize: "0.9rem", cursor: "pointer", marginBottom: "0.25rem", width: "100%", border: "none", textAlign: "left" }}>
                {item.label}
              </button>
            ))}
            <button onClick={onLogout}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#ff6b6b", background: "transparent", padding: "0.65rem 0.75rem", borderRadius: 8, fontSize: "0.9rem", cursor: "pointer", marginTop: "1rem", width: "100%", border: "none", textAlign: "left" }}>
              🚪 Sair
            </button>
          </nav>
        </div>

        {/* Content */}
        <div>
          {dashTab === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  { n: myApplications.length, label: "Candidaturas" },
                  { n: countStatus("aprovado") + countStatus("em_andamento"), label: "Voluntariados ativos" },
                  { n: myOrganizationMembers.length, label: "ONGs como membro" },
                ].map(c => (
                  <div key={c.label} style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: "1px solid #e5e7eb" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 900, color: "#22c55e" }}>{c.n}</div>
                    <div style={{ color: "#4b5563", fontSize: "0.85rem" }}>{c.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb", marginBottom: "1.5rem" }}>
                <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>📋 Dados cadastrais</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.88rem" }}>
                  {[
                    { label: "Nome", val: profile.name },
                    { label: "E-mail", val: profile.email },
                    { label: "CPF", val: profile.cpf },
                    { label: "Nome de usuário", val: profile.username },
                    { label: "Cidade", val: profile.city },
                  ].map(f => (
                    <div key={f.label} style={{ padding: "0.6rem 0.75rem", background: "#f9fafb", borderRadius: 8 }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.75rem", fontFamily: "monospace" }}>{f.label}</span><br />
                      <span style={{ fontWeight: 600 }}>{f.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
                <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>📊 Resumo de voluntariados por status</h3>
                {(["pendente", "aprovado", "em_andamento", "recusado", "concluido"] as VolunteerStatus[]).map(s => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.6rem 0", borderBottom: "1px solid #f3f4f6" }}>
                    <StatusBadge status={s} />
                    <span style={{ fontSize: "0.85rem", color: "#4b5563" }}>{countStatus(s)} {countStatus(s) === 1 ? "registro" : "registros"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dashTab === "applications" && (
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "1.5rem" }}>Meus Voluntariados (VOLUNTARIADO)</h2>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
                {myApplications.length === 0 ? (
                  <p style={{ color: "#9ca3af", textAlign: "center", padding: "2rem" }}>Nenhum voluntariado ainda. Explore os projetos!</p>
                ) : myApplications.map(v => {
                  const p = getProject(v.projectId);
                  const o = getOrganization(p.organizationId);
                  return (
                    <div key={v.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 0", borderBottom: "1px solid #f3f4f6" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>{o.icon}</div>
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: "block", fontSize: "0.9rem", fontWeight: 600 }}>{p.title}</strong>
                        <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{o.name} · Inscrito em {v.appliedAt}</span>
                      </div>
                      <StatusBadge status={v.status} />
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.75rem", fontFamily: "monospace" }}>
                Tabela: volunteer_applications (user_id FK, project_id FK, status TEXT)
              </p>
            </div>
          )}

          {dashTab === "organizationMembers" && (
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "1.5rem" }}>Minhas ONGs — Vínculo de Membro (MEMBRO)</h2>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
                {myOrganizationMembers.length === 0 ? (
                  <p style={{ color: "#9ca3af", textAlign: "center", padding: "2rem" }}>Você ainda não é membro de nenhuma ONG.</p>
                ) : myOrganizationMembers.map(m => {
                  const o = getOrganization(m.organizationId);
                  return (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 0", borderBottom: "1px solid #f3f4f6" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>{o.icon}</div>
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: "block", fontSize: "0.9rem", fontWeight: 600 }}>{o.name}</strong>
                        <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{o.city} · CNPJ: {o.cnpj}</span>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Badge label={m.isAdmin ? "👑 adm_ong" : "Membro"} style={m.isAdmin ? { background: "#fef3c7", color: "#92400e" } : { background: "#dcfce7", color: "#166534" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.75rem", fontFamily: "monospace" }}>
                Tabela: organization_members (user_id FK, organization_id FK, is_admin BOOLEAN)
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── CARD COMPONENTS ───────────────────────────────────────────────────────

export function OrganizationDashboardPage({ organization, applications, organizationTab, setOrganizationTab, nav, onLogout, onStatusChange }: {
  organization: Organization; applications: VolunteerApplication[]; organizationTab: OrganizationDashboardTab; setOrganizationTab: (tab: OrganizationDashboardTab) => void;
  nav: PageNavigation; onLogout: () => void; onStatusChange: (id: number, s: VolunteerStatus) => void;
}) {
  const organizationProjects = projects.filter(project => project.organizationId === organization.id);
  const inscricoes = applications.filter(v => organizationProjects.some(p => p.id === v.projectId));

  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "opportunities", icon: "📋", label: "Oportunidades" },
    { id: "volunteers", icon: "👥", label: "Voluntários" },
    { id: "create", icon: "➕", label: "Criar oportunidade" },
    { id: "settings", icon: "⚙️", label: "Configurações" },
  ] as const;

  return (
    <section style={{ padding: "2.5rem 1.5rem", minHeight: "calc(100vh - 64px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "260px 1fr", gap: "2rem" }}>

        {/* Sidebar ONG */}
        <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "1.5rem", alignSelf: "start" }}>
          <div style={{ width: 64, height: 64, borderRadius: 14, background: "linear-gradient(135deg,#22c55e,#166534)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: "1rem" }}>
            {organization.icon}
          </div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.3 }}>{organization.name}</div>
          <div style={{ color: "#9ca3af", fontSize: "0.78rem", marginBottom: "1.5rem" }}>CNPJ: {organization.cnpj}</div>
          <nav>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setOrganizationTab(item.id)}
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: organizationTab === item.id ? "#22c55e" : "#9ca3af", background: organizationTab === item.id ? "#ffffff10" : "transparent", padding: "0.65rem 0.75rem", borderRadius: 8, fontSize: "0.9rem", cursor: "pointer", marginBottom: "0.25rem", width: "100%", border: "none", textAlign: "left" }}>
                {item.icon} {item.label}
              </button>
            ))}
            <button onClick={onLogout}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#ff6b6b", background: "transparent", padding: "0.65rem 0.75rem", borderRadius: 8, fontSize: "0.9rem", cursor: "pointer", marginTop: "1rem", width: "100%", border: "none", textAlign: "left" }}>
              🚪 Sair
            </button>
          </nav>
        </div>

        {/* Conteúdo */}
        <div>
          {/* Dashboard principal */}
          {organizationTab === "dashboard" && (
            <div>
              <div style={{ marginBottom: "1.75rem" }}>
                <h1 style={{ fontSize: "1.4rem", fontWeight: 900, marginBottom: "0.25rem" }}>Painel da ONG 🏢</h1>
                <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Bem-vinda ao Voluntariar. Gerencie suas ações e conecte-se com novos voluntários.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  { n: organization.memberCount, label: "Total de voluntários", icon: "👥" },
                  { n: organizationProjects.length, label: "Oportunidades publicadas", icon: "📋" },
                  { n: inscricoes.length, label: "Inscrições recebidas", icon: "📩" },
                  { n: inscricoes.filter(v => v.status === "concluido").length, label: "Ações realizadas", icon: "✅" },
                ].map(c => (
                  <div key={c.label} style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: "1px solid #e5e7eb" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{c.icon}</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#22c55e" }}>{c.n}</div>
                    <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>{c.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h3 style={{ fontWeight: 700 }}>📋 Suas oportunidades</h3>
                  <BtnSm onClick={() => setOrganizationTab("create")}>+ Criar oportunidade</BtnSm>
                </div>
                <OpportunitiesTable organizationProjects={organizationProjects} statusList={statusOportunidades} />
              </div>
            </div>
          )}

          {/* Oportunidades */}
          {organizationTab === "opportunities" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontWeight: 800, fontSize: "1.3rem" }}>Oportunidades publicadas</h2>
                <BtnSm onClick={() => setOrganizationTab("create")}>+ Criar oportunidade</BtnSm>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
                <OpportunitiesTable organizationProjects={organizationProjects} statusList={statusOportunidades} />
              </div>
            </div>
          )}

          {/* Voluntários */}
          {organizationTab === "volunteers" && (
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "1.5rem" }}>Gerenciamento de Voluntários</h2>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
                {inscricoes.length === 0 ? (
                  <p style={{ color: "#9ca3af", textAlign: "center", padding: "2rem" }}>Nenhuma inscrição recebida ainda.</p>
                ) : (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 0.85fr 0.95fr 2fr", gap: "0.75rem", padding: "0.5rem 0.75rem", marginBottom: "0.5rem" }}>
                      {["Voluntário", "Oportunidade", "Inscrição", "Status", "Ação"].map(h => (
                        <span key={h} style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
                      ))}
                    </div>
                    {inscricoes.map((v, i) => {
                      const p = getProject(v.projectId);
                      const nomes = ["Marcos Lima", "Beatriz Costa", "Rafael Souza", "Carla Mendes", "João Pedro"];
                      const nome = nomes[i % nomes.length];
                      const sstyle = statusStyle[v.status];
                      return (
                        <div key={v.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 0.85fr 0.95fr 2fr", gap: "0.75rem", padding: "0.75rem", borderBottom: "1px solid #f3f4f6", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>👤</div>
                            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{nome}</span>
                          </div>
                          <span style={{ fontSize: "0.82rem", color: "#374151" }}>{p.title}</span>
                          <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{v.appliedAt}</span>
                          <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: 99, background: sstyle.bg, color: sstyle.color }}>
                            {statusLabel[v.status]}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", minWidth: 0 }}>
                            <select value={v.status} onChange={e => onStatusChange(v.id, e.target.value as VolunteerStatus)}
                              style={{ flex: 1, minWidth: 0, fontSize: "0.8rem", padding: "0.3rem 0.4rem", borderRadius: 7, border: "1px solid #e5e7eb", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
                              {(["pendente", "aprovado", "em_andamento", "recusado", "concluido"] as VolunteerStatus[]).map(s => (
                                <option key={s} value={s}>{statusLabel[s]}</option>
                              ))}
                            </select>
                            <button type="button" onClick={() => onStatusChange(v.id, "concluido")}
                              disabled={v.status !== "em_andamento"}
                              aria-label={v.status === "concluido" ? "Ação confirmada" : "Confirmar ação"}
                              title={v.status === "concluido" ? "Ação confirmada" : "Confirmar ação realizada"}
                              style={{ flexShrink: 0, padding: "0.35rem 0.55rem", borderRadius: 7, border: "none", background: v.status === "concluido" ? "#dcfce7" : "#22c55e", color: v.status === "concluido" ? "#166534" : "#000", fontSize: "0.75rem", fontWeight: 700, cursor: v.status === "em_andamento" ? "pointer" : "not-allowed", opacity: v.status === "em_andamento" || v.status === "concluido" ? 1 : 0.5, whiteSpace: "nowrap" }}>
                              {v.status === "concluido" ? "Confirmada" : "Confirmar"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Criar oportunidade */}
          {organizationTab === "create" && <OpportunityForm onPublicar={() => setOrganizationTab("opportunities")} />}

          {/* Configurações */}
          {organizationTab === "settings" && (
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "1.5rem" }}>Configurações da ONG</h2>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
                <SectionDivider label="Dados da organização" />
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <FormGroup label="Nome da ONG">
                    <input defaultValue={organization.name} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
                  </FormGroup>
                  <FormGroup label="CNPJ">
                    <input defaultValue={organization.cnpj} disabled style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", background: "#f9fafb", color: "#9ca3af", fontFamily: "inherit" }} />
                  </FormGroup>
                  <FormGroup label="Cidade">
                    <input defaultValue={organization.city} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
                  </FormGroup>
                  <BtnPrimary>Salvar alterações</BtnPrimary>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function OpportunitiesTable({ organizationProjects, statusList }: { organizationProjects: Project[]; statusList: string[] }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "0.75rem", padding: "0.5rem 0.75rem", marginBottom: "0.5rem" }}>
        {["Nome", "Local", "Vagas", "Vagas Prench.", "Status"].map(h => (
          <span key={h} style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
        ))}
      </div>
      {organizationProjects.map((p, i) => {
        const s = statusOportunidade[statusList[i] || "ativa"];
        const preenchidas = Math.floor(p.slots * (0.3 + Math.random() * 0.6));
        return (
          <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "0.75rem", padding: "0.75rem", borderBottom: "1px solid #f3f4f6", alignItems: "center" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{p.title}</span>
            <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>{p.city.split(",")[0]}</span>
            <span style={{ fontSize: "0.88rem" }}>{p.slots}</span>
            <span style={{ fontSize: "0.88rem", color: "#22c55e", fontWeight: 600 }}>{preenchidas}</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: 99, background: s.bg, color: s.color }}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function OpportunityForm({ onPublicar }: { onPublicar: () => void }) {
  const [formato, setFormato] = useState<"presencial" | "online" | "hibrido">("presencial");
  const fi = (ph: string, type = "text") => (
    <input type={type} placeholder={ph} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
  );
  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "1.5rem" }}>Criar oportunidade de voluntariado</h2>
      <div style={{ background: "#fff", borderRadius: 12, padding: "2rem", border: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <FormGroup label="Nome da oportunidade">{fi("Ex: Plantio de mudas nativas")}</FormGroup>
          <FormGroup label="Descrição">
            <textarea rows={4} placeholder="Descreva a oportunidade em detalhes..."
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
          </FormGroup>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormGroup label="Categoria">
              <select style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", background: "#fff", fontFamily: "inherit" }}>
                {["Saúde", "Assistência Social", "Meio Ambiente", "Educação"].map(a => <option key={a}>{a}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Número de vagas">{fi("Ex: 10", "number")}</FormGroup>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormGroup label="Data">{fi("DD/MM/AAAA", "date")}</FormGroup>
            <FormGroup label="Horário">{fi("HH:MM", "time")}</FormGroup>
          </div>
          <FormGroup label="Local">{fi("Endereço ou link (se online)")}</FormGroup>
          <FormGroup label="Formato">
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {(["presencial", "online", "hibrido"] as const).map(f => (
                <button key={f} onClick={() => setFormato(f)}
                  style={{ flex: 1, padding: "0.65rem", borderRadius: 9, border: `2px solid ${formato === f ? "#22c55e" : "#e5e7eb"}`, background: formato === f ? "#dcfce7" : "#fff", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem", color: formato === f ? "#166534" : "#374151", textTransform: "capitalize" }}>
                  {f === "hibrido" ? "Híbrido" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </FormGroup>
          <FormGroup label="Requisitos">{fi("Ex: Maior de 18 anos, disponibilidade aos sábados")}</FormGroup>
          <FormGroup label="Imagem da oportunidade">
            <div style={{ border: "2px dashed #e5e7eb", borderRadius: 10, padding: "1.5rem", textAlign: "center", color: "#9ca3af", cursor: "pointer", fontSize: "0.9rem" }}>
              📷 Clique para fazer upload
            </div>
          </FormGroup>
          <BtnPrimary onClick={onPublicar} full>Publicar oportunidade</BtnPrimary>
        </div>
      </div>
    </div>
  );
}

// ── MONTAGEM DO APP NO DOM ──────────────────────────────────────────────
