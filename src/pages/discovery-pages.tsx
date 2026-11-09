import { useState } from "react";
import type { EntityId, Organization, Project, PageNavigation } from "../types/models";
import { AreaBadge, Badge, BtnPrimary, BtnSecondary, BtnSm, FormGroup, FormInput, PageHero } from "../components/ui";
import { OrganizationCard, ProjectCard, ProjectRow } from "../components/cards";

export function HomePage({ organizations, projects, nav, onApply, hasApplied }: { organizations: Organization[]; projects: Project[]; nav: PageNavigation; onApply: (p: Project) => void; hasApplied: (id: EntityId) => boolean }) {
  const featuredOrganizations = organizations.slice(0, 3);
  const recentProjects = projects.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #0d1f14 60%, #0a2a16 100%)", padding: "6rem 1.5rem 5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 100%, #22c55e18, transparent)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#22c55e15", border: "1px solid #22c55e30", color: "#22c55e", padding: "0.3rem 1rem", borderRadius: 99, fontSize: "0.8rem", fontWeight: 600, marginBottom: "1.5rem" }}>
            ✨ Plataforma de voluntariado do Espírito Santo
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem,6vw,4.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "1.25rem" }}>
            Conectando você a<br /><em style={{ fontStyle: "normal", color: "#22c55e" }}>boas causas</em>
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "clamp(1rem,2.5vw,1.2rem)", maxWidth: 600, margin: "0 auto 2.5rem" }}>
            Encontre ONGs capixabas, candidate-se a projetos de voluntariado e acompanhe sua jornada de impacto social.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <BtnPrimary onClick={() => nav("ongs")}>🔍 Buscar ONGs</BtnPrimary>
            <BtnSecondary onClick={() => nav("doar")}>💚 Quero Doar</BtnSecondary>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", padding: "3rem 1.5rem", background: "#0a0a0a", borderBottom: "1px solid #1f1f1f" }}>
        {[
          { n: organizations.length, label: "ONGs parceiras" },
          { n: projects.length, label: "Projetos ativos" },
          { n: "ES", label: "Estado de atuação" },
          { n: organizations.length + projects.length, label: "Cadastros ativos" },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <strong style={{ display: "block", fontSize: "2rem", fontWeight: 900, color: "#22c55e" }}>{s.n}</strong>
            <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ONGs em destaque */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span style={{ display: "inline-block", background: "#dcfce7", color: "#166534", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 99, marginBottom: "0.5rem" }}>🏆 Em destaque</span>
            <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 800, marginBottom: "0.5rem" }}>ONGs que transformam o ES</h2>
            <p style={{ color: "#4b5563" }}>Organizações reais do Espírito Santo parceiras da plataforma</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.5rem" }}>
            {featuredOrganizations.map(organization => (
              <OrganizationCard key={organization.id} organization={organization} onClick={() => { nav("ong-detalhe", organization); }} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button onClick={() => nav("ongs")} style={{ background: "transparent", color: "#374151", border: "1px solid #d1d5db", fontWeight: 600, padding: "0.8rem 1.8rem", borderRadius: 10, cursor: "pointer", fontSize: "1rem" }}>
              Ver todas as ONGs →
            </button>
          </div>
        </div>
      </section>

      {/* Últimos projetos */}
      <section style={{ padding: "4rem 1.5rem", background: "#f3f4f6" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span style={{ display: "inline-block", background: "#dcfce7", color: "#166534", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 99, marginBottom: "0.5rem" }}>🔥 Novas vagas</span>
            <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 800, marginBottom: "0.5rem" }}>Últimas oportunidades</h2>
            <p style={{ color: "#4b5563" }}>Projetos publicados recentemente</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "1.5rem" }}>
            {recentProjects.map(p => (
              <ProjectCard key={p.id} project={p} organizations={organizations} hasApplied={hasApplied(p.id)} onApply={() => onApply(p)} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button onClick={() => nav("projetos")} style={{ background: "transparent", color: "#374151", border: "1px solid #d1d5db", fontWeight: 600, padding: "0.8rem 1.8rem", borderRadius: 10, cursor: "pointer", fontSize: "1rem" }}>
              Ver todos os projetos →
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "4rem 1.5rem", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>Pronto para fazer a diferença?</h2>
          <p style={{ color: "#9ca3af", marginBottom: "2rem" }}>Cadastre-se gratuitamente e conecte-se com ONGs do Espírito Santo</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <BtnPrimary onClick={() => nav("login")}>🚀 Cadastrar grátis</BtnPrimary>
            <BtnSecondary onClick={() => nav("ongs")}>Explorar ONGs</BtnSecondary>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── ONGS PAGE ─────────────────────────────────────────────────────────────

export function OrganizationsPage({ organizations, nav, isMember, onJoin }: { organizations: Organization[]; nav: PageNavigation; isMember: (id: EntityId) => boolean; onJoin: (o: Organization) => void }) {
  const [searchTerm, setBusca] = useState("");
  const [causeFilter, setCauseFilter] = useState("Todas");

  const filtered = organizations.filter(o => {
    const matchBusca = o.name.toLowerCase().includes(searchTerm.toLowerCase()) || o.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchArea = causeFilter === "Todas" || o.cause === causeFilter;
    return matchBusca && matchArea;
  });

  return (
    <div>
      <PageHero title="🔍 Buscar ONGs" sub="Organizações verificadas no Espírito Santo" />
      <section style={{ padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem", background: "#fff", padding: "1.25rem", borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px #0000000a" }}>
            <input value={searchTerm} onChange={e => setBusca(e.target.value)}
              placeholder="🔍 Buscar por nome ou causa..."
              style={{ flex: 1, minWidth: 180, padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }} />
            <select value={causeFilter} onChange={e => setCauseFilter(e.target.value)}
              style={{ padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}>
              {["Todas", "Saúde", "Assistência Social", "Meio Ambiente", "Educação"].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.5rem" }}>
            {filtered.map(organization => (
              <OrganizationCard key={organization.id} organization={organization} onClick={() => nav("ong-detalhe", organization)}
                extraAction={
                  <BtnSm outline={isMember(organization.id)} onClick={() => { if (!isMember(organization.id)) onJoin(organization); }}>
                    {isMember(organization.id) ? "✓ Membro" : "Ser membro"}
                  </BtnSm>
                }
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "#9ca3af", padding: "3rem" }}>Nenhuma ONG encontrada.</p>
          )}
        </div>
      </section>
    </div>
  );
}

// ── PROJETOS PAGE ─────────────────────────────────────────────────────────

export function ProjectsPage({ organizations, causeFilter, setCauseFilter, filteredProjects, nav, onApply, hasApplied }: {
  causeFilter: string; setCauseFilter: (a: string) => void; filteredProjects: Project[];
  organizations: Organization[]; nav: PageNavigation; onApply: (p: Project) => void; hasApplied: (id: EntityId) => boolean;
}) {
  const [searchTerm, setBusca] = useState("");
  const final = filteredProjects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <PageHero title="💼 Projetos de Voluntariado" sub="Oportunidades para você fazer a diferença no ES" />
      <section style={{ padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem", background: "#fff", padding: "1.25rem", borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px #0000000a" }}>
            <input value={searchTerm} onChange={e => setBusca(e.target.value)}
              placeholder="🔍 Buscar projeto..."
              style={{ flex: 1, minWidth: 180, padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }} />
            <select value={causeFilter} onChange={e => setCauseFilter(e.target.value)}
              style={{ padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}>
              {["Todas", "Saúde", "Assistência Social", "Meio Ambiente", "Educação"].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {final.map(p => (
              <ProjectRow key={p.id} project={p} organizations={organizations} hasApplied={hasApplied(p.id)} onApply={() => onApply(p)} />
            ))}
          </div>
          {final.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: "3rem" }}>Nenhum projeto encontrado.</p>}
        </div>
      </section>
    </div>
  );
}

// ── ONG DETALHE PAGE ──────────────────────────────────────────────────────

export function OrganizationDetailPage({ organization, organizations, projects, nav, onApply, hasApplied, isMember, onJoin }: {
  organization: Organization; organizations: Organization[]; projects: Project[]; nav: PageNavigation; onApply: (p: Project) => void;
  hasApplied: (id: EntityId) => boolean; isMember: (id: EntityId) => boolean; onJoin: (o: Organization) => void;
}) {
  const organizationProjects = projects.filter(p => String(p.organizationId) === String(organization.id));
  const membro = isMember(organization.id);

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #0a0a0a, #0a2010)", padding: "3rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem", maxWidth: 900, margin: "0 auto", flexWrap: "wrap" }}>
          <div style={{ width: 100, height: 100, borderRadius: 20, background: "linear-gradient(135deg, #22c55e, #166534)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
            {organization.image ? <img src={organization.image} alt={`Logo da ${organization.name}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "3rem" }}>{organization.icon}</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              <AreaBadge area={organization.cause} />
              <Badge label={`📍 ${organization.city}`} style={{ background: "#1a1a1a", color: "#9ca3af" }} />
              {membro && <Badge label="✓ Você é membro" style={{ background: "#22c55e20", color: "#22c55e" }} />}
            </div>
            <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: 900, marginBottom: "0.35rem" }}>{organization.name}</h1>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem", marginBottom: "0.75rem" }}>CNPJ: {organization.cnpj}</p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <BtnPrimary onClick={() => { if (!membro) onJoin(organization); }}>
                {membro ? "✓ Já sou membro" : "💚 Ser membro"}
              </BtnPrimary>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
          <div>
            <div style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.25rem" }}>Sobre a organização</h2>
              <p style={{ color: "#4b5563", lineHeight: 1.8 }}>{organization.description}</p>
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.25rem" }}>Projetos ativos ({organizationProjects.length})</h2>
              {organizationProjects.map(p => (
                <div key={p.id} style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: "1px solid #e5e7eb", marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>📋</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>{p.title}</h3>
                    <p style={{ color: "#4b5563", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{p.slots} vagas · {p.schedule}</p>
                    <BtnSm onClick={() => onApply(p)}>
                      {hasApplied(p.id) ? "✓ Inscrito" : "Candidatar-se"}
                    </BtnSm>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ background: "#f3f4f6", borderRadius: 14, padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "1rem", color: "#374151" }}>DADOS DA ONG</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {organization.memberCount !== undefined && <div><strong style={{ fontSize: "1.3rem", color: "#22c55e" }}>{organization.memberCount}</strong><br /><span style={{ fontSize: "0.8rem", color: "#4b5563" }}>Membros cadastrados</span></div>}
                <div><strong style={{ fontSize: "1.3rem", color: "#22c55e" }}>{organizationProjects.length}</strong><br /><span style={{ fontSize: "0.8rem", color: "#4b5563" }}>Projetos ativos</span></div>
              </div>
            </div>
            <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "1.5rem" }}>
              <h3 style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.75rem" }}>REGISTRO</h3>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "0.25rem" }}>🏢 CNPJ: {organization.cnpj}</p>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>📍 {organization.city}</p>
              {organization.website && <a href={organization.website} target="_blank" rel="noreferrer" style={{ display: "inline-block", color: "#9ca3af", fontSize: "0.85rem", textDecoration: "none" }}>🌐 Visitar site</a>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN PAGE ────────────────────────────────────────────────────────────

export function DonationPage({ organizations, showToast }: { organizations: Organization[]; showToast: (msg: string) => void }) {
  const [ongSel, setOngSel] = useState(0);
  const [valor, setValor] = useState(50);
  const [valorCustom, setValorCustom] = useState("");
  const [recorrente, setRecorrente] = useState(false);
  const [anonimo, setAnonimo] = useState(false);
  const [pagamento, setPagamento] = useState<"pix" | "cartao" | "boleto">("pix");
  const [sucesso, setSucesso] = useState(false);

  const valorFinal = valor === 0 ? Number(valorCustom) || 0 : valor;
  const selectedOrganization = organizations[ongSel];

  const impactos: Record<number, string> = {
    50:  "Com R$50, você garante materiais de apoio para <strong>1 criança</strong> em tratamento na ACACCI por um mês.",
    100: "Com R$100, você financia <strong>3 refeições diárias</strong> para famílias atendidas pela ASA por uma semana.",
    200: "Com R$200, você custeia o plantio de <strong>20 mudas nativas</strong> da Mata Atlântica capixaba.",
  };

  const impactoMsg = impactos[valorFinal] || `Cada real transforma uma vida no Espírito Santo. <strong>Obrigado por contribuir!</strong>`;

  if (sucesso) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: 460 }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.75rem" }}>Doação confirmada!</h2>
          <p style={{ color: "#4b5563", marginBottom: "1.5rem" }}>
            Obrigado! Sua doação de <strong>R${valorFinal}</strong> para a <strong>{selectedOrganization?.name ?? "organização selecionada"}</strong> chegará em até 1 dia útil.
          </p>
          <div style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", borderLeft: "4px solid #22c55e", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.5rem", textAlign: "left" }}>
            <p style={{ fontSize: "0.9rem", color: "#374151" }} dangerouslySetInnerHTML={{ __html: "💡 <strong>Impacto da sua doação:</strong> " + impactoMsg }} />
          </div>
          <BtnPrimary onClick={() => setSucesso(false)}>Fazer outra doação</BtnPrimary>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero title="💚 Quero Doar" sub="Cada doação tem um impacto real na vida de alguém no ES" />
      <section style={{ padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* Escolher ONG */}
          <FormGroup label="Escolha a ONG beneficiada">
            <select value={ongSel} onChange={e => setOngSel(Number(e.target.value))}
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit", background: "#fff" }}>
              {organizations.length === 0
                ? <option value={0}>Nenhuma ONG cadastrada</option>
                : organizations.map((o, i) => <option key={o.id} value={i}>{o.icon} {o.name} – {o.cause}</option>)}
            </select>
          </FormGroup>

          {/* Valor */}
          <FormGroup label="Selecione o valor da doação">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.75rem", marginBottom: "0.75rem" }}>
              {[50, 100, 200, 0].map(v => (
                <button key={v} onClick={() => setValor(v)}
                  style={{ padding: "0.75rem", borderRadius: 10, border: `2px solid ${valor === v ? "#22c55e" : "#e5e7eb"}`, background: valor === v ? "#dcfce7" : "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", color: valor === v ? "#166534" : "#374151", transition: "all 0.15s" }}>
                  {v === 0 ? "Outro" : `R$ ${v}`}
                </button>
              ))}
            </div>
            {valor === 0 && (
              <input type="number" value={valorCustom} onChange={e => setValorCustom(e.target.value)}
                placeholder="R$ Valor personalizado..."
                style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
            )}
          </FormGroup>

          {/* Impacto */}
          <div style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", borderLeft: "4px solid #22c55e", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.9rem", color: "#374151" }} dangerouslySetInnerHTML={{ __html: "💡 <strong>Impacto da sua doação:</strong> " + impactoMsg }} />
          </div>

          {/* Opções */}
          <FormGroup label="Opções da doação">
            {[
              { label: "🔄 Doação recorrente (mensal)", val: recorrente, set: setRecorrente },
              { label: "🕵️ Doação anônima", val: anonimo, set: setAnonimo },
            ].map(opt => (
              <div key={opt.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid #f3f4f6" }}>
                <label style={{ fontSize: "0.9rem", color: "#374151", fontWeight: 500 }}>{opt.label}</label>
                <button onClick={() => opt.set(!opt.val)}
                  style={{ width: 44, height: 24, background: opt.val ? "#22c55e" : "#e5e7eb", borderRadius: 99, cursor: "pointer", position: "relative", transition: "0.3s", border: "none", flexShrink: 0 }}>
                  <span style={{ position: "absolute", top: 3, left: opt.val ? 23 : 3, width: 18, height: 18, background: "#fff", borderRadius: "50%", transition: "0.3s", display: "block" }} />
                </button>
              </div>
            ))}
          </FormGroup>

          {/* Pagamento */}
          <FormGroup label="Forma de pagamento">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {([
                { id: "pix", icon: "📱", label: "Pix" },
                { id: "cartao", icon: "💳", label: "Cartão" },
                { id: "boleto", icon: "📄", label: "Boleto" },
              ] as const).map(p => (
                <button key={p.id} onClick={() => setPagamento(p.id)}
                  style={{ padding: "0.75rem", borderRadius: 10, border: `2px solid ${pagamento === p.id ? "#22c55e" : "#e5e7eb"}`, background: pagamento === p.id ? "#dcfce7" : "#fff", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", transition: "all 0.15s" }}>
                  <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>{p.label}
                </button>
              ))}
            </div>
          </FormGroup>

          {/* Dados pessoais */}
          {!anonimo && (
            <FormGroup label="Seus dados (para recibo)">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <FormInput placeholder="Nome completo" />
                <FormInput placeholder="E-mail" type="email" />
                <FormInput placeholder="CPF (opcional)" />
              </div>
            </FormGroup>
          )}

          {organizations.length > 0
            ? <BtnPrimary onClick={() => { setSucesso(true); showToast("Doação confirmada! 💚"); }} full>
                ✅ Confirmar Doação{valorFinal > 0 ? ` de R$${valorFinal}` : ""}
              </BtnPrimary>
            : <p role="status" style={{ color: "#6b7280", textAlign: "center" }}>Nenhuma ONG cadastrada para receber doações.</p>}
        </div>
      </section>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// NOVOS COMPONENTES – Fluxo dois tipos de usuário
// ════════════════════════════════════════════════════════════════════════════

// ── 1. TELA DE ESCOLHA ───────────────────────────────────────────────────
