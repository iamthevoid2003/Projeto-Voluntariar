import { useEffect, useRef, useState } from "react";
import type React from "react";
import type { Organization, OrganizationMember, OrganizationDashboardTab, Page, Project, VolunteerApplication, VolunteerDashboardTab, VolunteerProfile } from "./types/models";
import { currentUser, initialApplications, initialMembers, organizations, projects } from "./data/mock-data";
import { getOrganization } from "./utils/presentation";
import { BtnPrimary, BtnSecondary, FormGroup, ModalOverlay } from "./components/ui";
import { HomePage, OrganizationsPage, ProjectsPage, OrganizationDetailPage, DonationPage } from "./pages/discovery-pages";
import { LoginPage, AccountTypePage, VolunteerLoginPage, VolunteerRegistrationPage, OrganizationLoginPage, OrganizationRegistrationPage } from "./pages/auth-pages";
import { VolunteerDashboardPage, OrganizationDashboardPage } from "./pages/dashboard-pages";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [applications, setApplications] = useState<VolunteerApplication[]>(initialApplications);
  const [organizationMembers, setOrganizationMembers] = useState<OrganizationMember[]>(initialMembers);
  const [loggedIn, setLoggedIn] = useState(true);
  // ── novo: dois tipos de usuário ─────────────────────────────────────────
  const [accountType, setAccountType] = useState<"voluntario" | "ong" | null>("voluntario");
  const [organizationLoggedIn, setOrganizationLoggedIn] = useState(false);
  const [activeOrganizationId, setActiveOrganizationId] = useState<number>(1);
  const [organizationTab, setOrganizationTab] = useState<OrganizationDashboardTab>("dashboard");
  // ────────────────────────────────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<null | "candidatura" | "membro">(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [modalOrganization, setModalOrganization] = useState<Organization | null>(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [toast, setToast] = useState("");
  const [causeFilter, setCauseFilter] = useState("Todas");
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [dashTab, setDashTab] = useState<VolunteerDashboardTab>("overview");

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
    setModalProject(p);
    setApplicationMessage("");
    setModal("candidatura");
  }

  function openMembership(o: Organization) {
    setModalOrganization(o);
    setModal("membro");
  }

  function submitApplication() {
    if (!modalProject) return;
    const alreadyApplied = applications.some(v => v.userId === currentUser.id && v.projectId === modalProject.id);
    if (!alreadyApplied) {
      setApplications(prev => [...prev, {
        id: prev.length + 10,
        userId: currentUser.id,
        projectId: modalProject.id,
        status: "pendente",
        appliedAt: new Date().toISOString().split("T")[0],
        message: applicationMessage,
      }]);
    }
    setModal(null);
    showToast("Candidatura enviada com sucesso! 🎉");
  }

  function joinOrganization() {
    if (!modalOrganization) return;
    const alreadyMember = organizationMembers.some(m => m.userId === currentUser.id && m.organizationId === modalOrganization.id);
    if (!alreadyMember) {
      setOrganizationMembers(prev => [...prev, {
        id: prev.length + 10,
        userId: currentUser.id,
        organizationId: modalOrganization.id,
        isAdmin: false,
      }]);
    }
    setModal(null);
    showToast(`Você agora é membro da ${modalOrganization.name}! 🎉`);
  }

  function hasApplied(projectId: number) {
    return applications.some(application => application.userId === currentUser.id && application.projectId === projectId);
  }

  function isMember(organizationId: number) {
    return organizationMembers.some(member => member.userId === currentUser.id && member.organizationId === organizationId);
  }

  const filteredProjects = causeFilter === "Todas" ? projects : projects.filter(p => p.cause === causeFilter);
  const myApplications = applications.filter(v => v.userId === currentUser.id);
  const myOrganizationMembers = organizationMembers.filter(m => m.userId === currentUser.id);

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
        {page === "home"       && <HomePage nav={nav} onApply={openApplication} hasApplied={hasApplied} />}
        {page === "ongs"       && <OrganizationsPage nav={nav} isMember={isMember} onJoin={openMembership} />}
        {page === "projetos"   && <ProjectsPage causeFilter={causeFilter} setCauseFilter={setCauseFilter} filteredProjects={filteredProjects} nav={nav} onApply={openApplication} hasApplied={hasApplied} />}
        {page === "doar"       && <DonationPage showToast={showToast} />}
        {page === "ong-detalhe" && selectedOrganization && (
          <OrganizationDetailPage organization={selectedOrganization} nav={nav} onApply={openApplication} hasApplied={hasApplied} isMember={isMember} onJoin={openMembership} />
        )}
        {page === "login"      && <LoginPage nav={nav} authTab={authTab} setAuthTab={setAuthTab} onLogin={() => { setLoggedIn(true); nav("dashboard"); showToast("Bem-vindo de volta! 🎉"); }} onRegister={() => { setLoggedIn(true); nav("dashboard"); showToast("Cadastro realizado! 🚀"); }} />}
        {page === "dashboard"  && loggedIn && (
          <VolunteerDashboardPage profile={currentUser} myApplications={myApplications} myOrganizationMembers={myOrganizationMembers} dashTab={dashTab} setDashTab={setDashTab} nav={nav} onLogout={() => { setLoggedIn(false); setAccountType(null); nav("home"); showToast("Até logo! 👋"); }} />
        )}
        {/* ── NOVOS: fluxo dois tipos de usuário ─────────────────────────── */}
        {page === "login-escolha"      && <AccountTypePage nav={nav} />}
        {page === "login-voluntario"   && <VolunteerLoginPage nav={nav} onLogin={() => { setLoggedIn(true); setAccountType("voluntario"); setOrganizationLoggedIn(false); nav("dashboard"); showToast("Bem-vindo, voluntário! 🎉"); }} />}
        {page === "cadastro-voluntario"&& <VolunteerRegistrationPage nav={nav} onSuccess={() => { setLoggedIn(true); setAccountType("voluntario"); setOrganizationLoggedIn(false); nav("dashboard"); showToast("Conta criada com sucesso! 🚀"); }} />}
        {page === "login-ong"          && <OrganizationLoginPage nav={nav} onLogin={(id) => { setOrganizationLoggedIn(true); setLoggedIn(false); setAccountType("ong"); setActiveOrganizationId(id); nav("dashboard-ong"); showToast("Bem-vinda ao Voluntariar! 🏢"); }} />}
        {page === "cadastro-ong-full"  && <OrganizationRegistrationPage nav={nav} onSuccess={() => { showToast("ONG cadastrada! Aguarde verificação. ✅"); nav("login-ong"); }} />}
        {page === "dashboard-ong"      && organizationLoggedIn && (
          <OrganizationDashboardPage organization={getOrganization(activeOrganizationId)} applications={applications} organizationTab={organizationTab} setOrganizationTab={setOrganizationTab} nav={nav}
            onLogout={() => { setOrganizationLoggedIn(false); setAccountType(null); nav("home"); showToast("Até logo! 👋"); }}
            onStatusChange={(volId, status) => setApplications(prev => prev.map(v => v.id === volId ? { ...v, status } : v))}
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
          <p style={{ color: "#4b5563", fontSize: "0.9rem", marginBottom: "1.25rem" }}>{modalProject.title} · {getOrganization(modalProject.organizationId).name}</p>
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
