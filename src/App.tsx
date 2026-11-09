import { useEffect, useRef, useState } from "react";
import type React from "react";
import type { EntityId, Organization, OrganizationMember, OrganizationDashboardTab, Page, Project, VolunteerApplication, VolunteerDashboardTab, VolunteerProfile } from "./types/models";
import { getOrganization } from "./utils/presentation";
import { BtnPrimary, BtnSecondary, FormGroup, ModalOverlay } from "./components/ui";
import { HomePage, OrganizationsPage, ProjectsPage, OrganizationDetailPage, DonationPage } from "./pages/discovery-pages";
import { AccountTypePage, VolunteerLoginPage, VolunteerRegistrationPage, OrganizationLoginPage, OrganizationRegistrationPage } from "./pages/auth-pages";
import { VolunteerDashboardPage, OrganizationDashboardPage } from "./pages/dashboard-pages";
import { applyToProject } from "./services/volunteering.service";
import { loadMyApplications, loadOrganizationApplications, registerAccount, restoreSession, signIn, signOut } from "./services/auth.service";
import { joinOrganization as saveOrganizationMembership, listOrganizationMembers, listOrganizations, organizationFromRecord } from "./repositories/organization.repository";
import { createProject, listActiveProjects, projectFromRecord } from "./repositories/project.repository";
import { updateApplicationStatus } from "./repositories/volunteer-application.repository";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [organizationMembers, setOrganizationMembers] = useState<OrganizationMember[]>([]);
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [accountType, setAccountType] = useState<"voluntario" | "ong" | null>(null);
  const [organizationLoggedIn, setOrganizationLoggedIn] = useState(false);
  const [activeOrganization, setActiveOrganization] = useState<Organization | null>(null);
  const [organizationTab, setOrganizationTab] = useState<OrganizationDashboardTab>("dashboard");
  // ────────────────────────────────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<null | "candidatura" | "membro">(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [modalOrganization, setModalOrganization] = useState<Organization | null>(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [toast, setToast] = useState("");
  const [causeFilter, setCauseFilter] = useState("Todas");
  const [dashTab, setDashTab] = useState<VolunteerDashboardTab>("overview");
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function refreshPublicData() {
    const [organizationRows, projectRows] = await Promise.all([listOrganizations(), listActiveProjects()]);
    setOrganizations(organizationRows.map(record => organizationFromRecord(record)));
    setProjects(projectRows.map(projectFromRecord));
  }

  async function refreshAccountData(type: "voluntario" | "ong") {
    if (type === "voluntario") {
      const [applicationRows, memberRows] = await Promise.all([loadMyApplications(), listOrganizationMembers()]);
      setApplications(applicationRows);
      setOrganizationMembers(memberRows.map(member => ({
        id: member.id,
        userId: member.user_id,
        organizationId: member.organization_id,
        isAdmin: member.is_admin,
      })));
    } else {
      setApplications(await loadOrganizationApplications());
      setOrganizationMembers([]);
    }
  }

  useEffect(() => {
    let active = true;
    async function initialize() {
      try {
        await refreshPublicData();
        const session = await restoreSession();
        if (!active || !session) return;
        setProfile(session.profile);
        setAccountType(session.accountType);
        setLoggedIn(session.accountType === "voluntario");
        setOrganizationLoggedIn(session.accountType === "ong");
        setActiveOrganization(session.organization);
        await refreshAccountData(session.accountType);
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : "Não foi possível carregar os dados do Supabase.");
      } finally {
        if (active) setLoadingData(false);
      }
    }
    void initialize();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setNavVisible(currentScrollY < 24 || currentScrollY <= lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function nav(page: Page, organization?: Organization, project?: Project) {
    setPage(page);
    if (organization) setSelectedOrganization(organization);
    if (project) setSelectedProject(project);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  function openApplication(p: Project) {
    if (!profile || accountType !== "voluntario") {
      showToast("Entre como voluntário para se candidatar.");
      nav("login-voluntario");
      return;
    }
    if (hasApplied(p.id)) {
      showToast("Você já se candidatou a este projeto.");
      return;
    }
    setModalProject(p);
    setApplicationMessage("");
    setModal("candidatura");
  }

  function openMembership(o: Organization) {
    if (!profile || accountType !== "voluntario") {
      showToast("Entre como voluntário para se vincular a uma ONG.");
      nav("login-voluntario");
      return;
    }
    setModalOrganization(o);
    setModal("membro");
  }

  async function submitApplication() {
    if (!modalProject) return;
    try {
      await applyToProject(String(modalProject.id), applicationMessage);
      setApplications(await loadMyApplications());
      setModal(null);
      showToast("Candidatura enviada com sucesso!");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Não foi possível enviar a candidatura.");
    }
  }

  async function joinOrganization() {
    if (!modalOrganization) return;
    try {
      await saveOrganizationMembership(String(modalOrganization.id));
      const members = await listOrganizationMembers();
      setOrganizationMembers(members.map(member => ({
        id: member.id,
        userId: member.user_id,
        organizationId: member.organization_id,
        isAdmin: member.is_admin,
      })));
      setModal(null);
      showToast(`Você agora é membro da ${modalOrganization.name}!`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Não foi possível entrar na organização.");
    }
  }

  function hasApplied(projectId: EntityId) {
    return applications.some(application =>
      application.userId === profile?.id && String(application.projectId) === String(projectId),
    );
  }

  function isMember(organizationId: EntityId) {
    return organizationMembers.some(member => String(member.organizationId) === String(organizationId));
  }

  const filteredProjects = causeFilter === "Todas" ? projects : projects.filter(p => p.cause === causeFilter);
  const myApplications = applications;
  const myOrganizationMembers = organizationMembers;

  async function handleLogin(email: string, password: string, type: "voluntario" | "ong") {
    try {
      const result = await signIn(email, password, type);
      setProfile(result.profile);
      setAccountType(type);
      setLoggedIn(type === "voluntario");
      setOrganizationLoggedIn(type === "ong");
      setActiveOrganization(result.organization);
      await refreshAccountData(type);
      nav(type === "ong" ? "dashboard-ong" : "dashboard");
      showToast(type === "ong" ? "Bem-vinda ao painel da ONG!" : "Bem-vindo, voluntário!");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Não foi possível entrar.");
    }
  }

  async function handleRegistration(details: Parameters<typeof registerAccount>[0]) {
    try {
      const hasSession = await registerAccount(details);
      if (!hasSession) {
        nav(details.accountType === "ong" ? "login-ong" : "login-voluntario");
        showToast("Conta criada. Confirme seu e-mail e depois entre.");
        return;
      }
      await handleLogin(details.email, details.password, details.accountType);
      if (details.accountType === "ong") await refreshPublicData();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Não foi possível concluir o cadastro.");
    }
  }

  async function handleLogout() {
    try {
      await signOut();
      setProfile(null);
      setAccountType(null);
      setLoggedIn(false);
      setOrganizationLoggedIn(false);
      setActiveOrganization(null);
      setApplications([]);
      setOrganizationMembers([]);
      nav("home");
      showToast("Até logo!");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Não foi possível sair da conta.");
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#fff", color: "#111827", minHeight: "100vh" }}>

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(10,10,10,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a", padding: "0 1.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", transform: navVisible ? "translateY(0)" : "translateY(-100%)", transition: "transform 0.35s ease, box-shadow 0.25s ease", boxShadow: navVisible ? "0 4px 18px rgba(0,0,0,0.18)" : "none" }}>
        <div onClick={() => nav("home")} style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          🌱 <span style={{ color: "#22c55e" }}>Voluntariar</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="hidden-mobile">
          {[
            { label: "Início", p: "home" as Page },
            { label: "Buscar ONGs", p: "ongs" as Page },
          ].map(item => (
            <button key={item.p} onClick={() => nav(item.p)}
              style={{ color: page === item.p ? "#fff" : "#9ca3af", background: page === item.p ? "#ffffff15" : "transparent", border: "none", padding: "0.4rem 0.75rem", borderRadius: 6, cursor: "pointer", fontSize: "0.9rem", fontWeight: 500 }}>
              {item.label}
            </button>
          ))}
          <button onClick={() => nav("doar")}
            style={{ background: page === "doar" ? "#16a34a" : "#22c55e", color: "#000", fontWeight: 700, padding: "0.45rem 1.1rem", borderRadius: 8, border: "none", cursor: "pointer", fontSize: "0.9rem" }}>
            💚 Quero Doar
          </button>
          {(loggedIn || organizationLoggedIn) ? (
            <button onClick={() => nav(organizationLoggedIn ? "dashboard-ong" : "dashboard")}
              style={{ border: "1px solid #333", color: "#fff", background: "transparent", padding: "0.45rem 1.1rem", borderRadius: 8, cursor: "pointer", fontSize: "0.9rem" }}>
              {organizationLoggedIn ? "🏢 Painel ONG" : "Meu Painel"}
            </button>
          ) : (
            <button onClick={() => nav("login-escolha")}
              style={{ border: "1px solid #333", color: "#fff", background: "transparent", padding: "0.45rem 1.1rem", borderRadius: 8, cursor: "pointer", fontSize: "0.9rem" }}>
              Entrar
            </button>
          )}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", flexDirection: "column", gap: 5, cursor: "pointer", background: "transparent", border: "none" }} className="hamburger-btn">
          {[0,1,2].map(i => <span key={i} style={{ width: 24, height: 2, background: "#fff", borderRadius: 2, display: "block" }} />)}
        </button>
      </nav>

      {/* Mobile nav */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, background: "#0a0a0a", padding: "1rem", zIndex: 999, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {[
            { label: "Início", p: "home" as Page },
            { label: "Buscar ONGs", p: "ongs" as Page },
            { label: "💚 Quero Doar", p: "doar" as Page },
            { label: (loggedIn || organizationLoggedIn) ? (organizationLoggedIn ? "🏢 Painel ONG" : "Meu Painel") : "Entrar",
              p: organizationLoggedIn ? "dashboard-ong" as Page : loggedIn ? "dashboard" as Page : "login-escolha" as Page },
          ].map(item => (
            <button key={item.p} onClick={() => nav(item.p)}
              style={{ color: "#9ca3af", background: "transparent", border: "none", padding: "0.75rem 1rem", borderRadius: 8, cursor: "pointer", fontSize: "0.95rem", textAlign: "left" }}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ── PAGES ───────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 64 }}>
        {loadError && <p role="alert" style={{ maxWidth: 1100, margin: "1rem auto", padding: "1rem", color: "#991b1b", background: "#fee2e2", borderRadius: 8 }}>{loadError}</p>}
        {loadingData && <p style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>Conectando ao Supabase...</p>}
        {page === "home" && !loadingData && <HomePage organizations={organizations} projects={projects} nav={nav} onApply={openApplication} hasApplied={hasApplied} />}
        {page === "ongs" && !loadingData && <OrganizationsPage organizations={organizations} nav={nav} isMember={isMember} onJoin={openMembership} />}
        {page === "projetos" && !loadingData && <ProjectsPage organizations={organizations} causeFilter={causeFilter} setCauseFilter={setCauseFilter} filteredProjects={filteredProjects} nav={nav} onApply={openApplication} hasApplied={hasApplied} />}
        {page === "doar" && !loadingData && <DonationPage organizations={organizations} showToast={showToast} />}
        {page === "ong-detalhe" && selectedOrganization && (
          <OrganizationDetailPage organization={selectedOrganization} organizations={organizations} projects={projects} nav={nav} onApply={openApplication} hasApplied={hasApplied} isMember={isMember} onJoin={openMembership} />
        )}
        {page === "login" && <AccountTypePage nav={nav} />}
        {page === "dashboard" && loggedIn && profile && (
          <VolunteerDashboardPage profile={profile} organizations={organizations} projects={projects} myApplications={myApplications} myOrganizationMembers={myOrganizationMembers} dashTab={dashTab} setDashTab={setDashTab} nav={nav} onLogout={() => void handleLogout()} />
        )}
        {/* ── NOVOS: fluxo dois tipos de usuário ─────────────────────────── */}
        {page === "login-escolha"      && <AccountTypePage nav={nav} />}
        {page === "login-voluntario" && <VolunteerLoginPage nav={nav} onLogin={(email, password) => void handleLogin(email, password, "voluntario")} />}
        {page === "cadastro-voluntario" && <VolunteerRegistrationPage nav={nav} onSuccess={details => void handleRegistration(details)} />}
        {page === "login-ong" && <OrganizationLoginPage nav={nav} onLogin={(email, password) => void handleLogin(email, password, "ong")} />}
        {page === "cadastro-ong-full" && <OrganizationRegistrationPage nav={nav} onSuccess={details => void handleRegistration(details)} />}
        {page === "dashboard-ong" && organizationLoggedIn && activeOrganization && (
          <OrganizationDashboardPage organization={activeOrganization} projects={projects} applications={applications} organizationTab={organizationTab} setOrganizationTab={setOrganizationTab} nav={nav}
            onLogout={() => void handleLogout()}
            onCreateProject={async project => {
              try {
                const created = await createProject(String(activeOrganization.id), project);
                setProjects(previous => [created, ...previous]);
                showToast("Oportunidade publicada com sucesso.");
              } catch (error) {
                showToast(error instanceof Error ? error.message : "Não foi possível publicar a oportunidade.");
                return false;
              }
              return true;
            }}
            onStatusChange={async (applicationId, status) => {
              try {
                await updateApplicationStatus(String(applicationId), status);
                setApplications(await loadOrganizationApplications());
              } catch (error) {
                showToast(error instanceof Error ? error.message : "Não foi possível atualizar a candidatura.");
              }
            }}
          />
        )}
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      {page === "home" && (
        <footer style={{ background: "#0a0a0a", color: "#9ca3af", padding: "3rem 1.5rem 1.5rem", borderTop: "1px solid #1a1a1a" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: "0.75rem" }}>🌱 <span style={{ color: "#22c55e" }}>Voluntariar</span></div>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.7, maxWidth: 260 }}>Conectando pessoas a ONGs do Espírito Santo. Plataforma gratuita para voluntários e organizações.</p>
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem" }}>Plataforma</p>
              {["Buscar ONGs", "Quero Doar", "Entrar"].map(l => <p key={l} style={{ fontSize: "0.85rem", marginBottom: "0.5rem", cursor: "pointer" }}>{l}</p>)}
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem" }}>Espírito Santo</p>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.8 }}>Vitória · Serra · Vila Velha<br />Cachoeiro · Cariacica</p>
            </div>
          </div>
          <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center", paddingTop: "2rem", borderTop: "1px solid #1a1a1a", fontSize: "0.8rem" }}>
            © 2026 Voluntariar — Projeto acadêmico · Espírito Santo, Brasil
          </div>
        </footer>
      )}

      {/* ── MODAL CANDIDATURA ──────────────────────────────────────── */}
      {modal === "candidatura" && modalProject && (
        <ModalOverlay onClose={() => setModal(null)}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>💼</div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>Candidatar-se ao projeto</h2>
          <p style={{ color: "#4b5563", fontSize: "0.9rem", marginBottom: "1.25rem" }}>{modalProject.title} · {getOrganization(modalProject.organizationId, organizations).name}</p>
          <FormGroup label="Por que quer participar?">
            <textarea value={applicationMessage} onChange={e => setApplicationMessage(e.target.value)} rows={3}
              placeholder="Conte sua motivação e disponibilidade..."
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", resize: "none", outline: "none", fontFamily: "inherit" }} />
          </FormGroup>
          <BtnPrimary onClick={submitApplication} full>Enviar Candidatura</BtnPrimary>
        </ModalOverlay>
      )}

      {/* ── MODAL MEMBRO ───────────────────────────────────────────── */}
      {modal === "membro" && modalOrganization && (
        <ModalOverlay onClose={() => setModal(null)}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🏢</div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>Tornar-se membro</h2>
          <p style={{ color: "#4b5563", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Ao se tornar membro da <strong>{modalOrganization.name}</strong>, você terá acesso às atividades internas da organização. Membros com perfil <strong>adm_ong</strong> podem gerenciar projetos e inscrições.
          </p>
          <BtnPrimary onClick={joinOrganization} full>Confirmar vínculo como Membro</BtnPrimary>
        </ModalOverlay>
      )}

      {/* ── TOAST ───────────────────────────────────────────────────── */}
      {toast && (
        <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", background: "#0a0a0a", color: "#fff", padding: "0.85rem 1.5rem", borderRadius: 10, fontSize: "0.9rem", fontWeight: 500, zIndex: 3000, display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 8px 24px #00000040", border: "1px solid #333", animation: "fadeIn 0.25s ease" }}>
          <span style={{ color: "#22c55e", fontSize: "1.1rem" }}>✅</span> {toast}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

// ── SHARED COMPONENTS ────────────────────────────────────────────────────
