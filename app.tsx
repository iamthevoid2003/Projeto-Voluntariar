// @ts-nocheck
const { useEffect, useRef, useState } = React;

// ── TYPES (reflecting the 5-entity DB model) ──────────────────────────────
type StatusVoluntariado = "pendente" | "aprovado" | "recusado" | "em_andamento" | "concluido";
type Page = "home" | "ongs" | "projetos" | "ong-detalhe" | "login" | "dashboard" | "cadastro-ong" | "doar"
         | "login-escolha" | "login-voluntario" | "cadastro-voluntario" | "login-ong" | "cadastro-ong-full"
         | "dashboard-ong";

interface CadastroUsuario {
  id_cadastro_voluntario: number;
  nome: string;
  email: string;
  CPF: string;
  nome_usuario: string;
  cidade: string;
  bio: string;
}

interface CadastroONG {
  id_cadastro_ONG: number;
  CNPJ: string;
  nome: string;
  cidade: string;
  area: string;
  descricao: string;
  site?: string;
  icone: string;
  imagem?: string;
  membros_count: number;
}

interface Membro {
  id: number;
  usuario: number;   // FK → CadastroUsuario
  ong: number;       // FK → CadastroONG
  adm_ong: boolean;
}

interface Projetos {
  id_projeto: number;
  ong: number;       // FK → CadastroONG
  titulo: string;
  descricao: string;
  area: string;
  cidade: string;
  vagas: number;
  periodo: string;
}

interface Voluntariado {
  id: number;
  usuario: number;   // FK → CadastroUsuario
  projeto: number;   // FK → Projetos
  status: StatusVoluntariado;
  data_inscricao: string;
  mensagem: string;
}

// ── SEED DATA ─────────────────────────────────────────────────────────────
const ongs: CadastroONG[] = [
  { id_cadastro_ONG: 1, CNPJ: "31.730.278/0001-48", nome: "ACACCI", cidade: "Vitória, ES", area: "Saúde", descricao: "Referência capixaba no acolhimento de crianças e adolescentes em tratamento oncológico. Seu programa de voluntariado reúne ações de acolhimento, recreação, eventos e bazares.", site: "https://acacci.org.br/", icone: "🎗️", imagem: "https://acacci.org.br/wp-content/uploads/2026/05/cfb5eb4d215998801468c21580b64404d3e80630-scaled.png", membros_count: 48 },
  { id_cadastro_ONG: 2, CNPJ: "Não informado", nome: "Instituto Ponte", cidade: "Vitória, ES", area: "Educação", descricao: "Apoia estudantes talentosos de baixa renda com bolsas de estudo e mentoria. Voluntários podem atuar como professores de apoio, mentores profissionais ou no suporte institucional.", site: "https://institutoponte.org.br/", icone: "🎓", imagem: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85", membros_count: 32 },
  { id_cadastro_ONG: 3, CNPJ: "Não informado", nome: "Instituto Social Esperança (ISE)", cidade: "Cariacica, ES", area: "Assistência Social", descricao: "Atua em comunidades vulneráveis com atividades de contraturno escolar, informática, música e esportes para crianças, além de oficinas voltadas para mulheres.", site: "https://www.google.com/search?q=Instituto+Social+Esperan%C3%A7a+ES", icone: "🤝", imagem: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=85", membros_count: 56 },
  { id_cadastro_ONG: 4, CNPJ: "Não informado", nome: "Instituto Maltrapilho", cidade: "Grande Vitória, ES", area: "Educação", descricao: "Trabalha com mobilização popular, educação complementar e garantia de direitos básicos para comunidades da Grande Vitória.", site: "https://www.google.com/search?q=Instituto+Maltrapilho+ES", icone: "📚", imagem: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=900&q=85", membros_count: 27 },
  { id_cadastro_ONG: 5, CNPJ: "Não informado", nome: "Hospital Evangélico de Vila Velha", cidade: "Vila Velha, ES", area: "Saúde", descricao: "Mantém ações humanizadas de apoio a pacientes e projetos internos, com oportunidades para voluntários maiores de 18 anos.", site: "https://www.google.com/search?q=Hospital+Evang%C3%A9lico+Vila+Velha+voluntariado", icone: "🏥", imagem: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=85", membros_count: 41 },
  { id_cadastro_ONG: 6, CNPJ: "Não informado", nome: "APAE Espírito Santo", cidade: "Vila Velha, ES", area: "Assistência Social", descricao: "Oferece o Programa Ajudar, com vagas formais de voluntariado e termo de adesão para áreas profissionais e de apoio geral.", site: "https://apaees.org.br/", icone: "💙", imagem: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=900&q=85", membros_count: 74 },
  { id_cadastro_ONG: 7, CNPJ: "Não informado", nome: "Instituto Últimos Refúgios", cidade: "Vitória, ES", area: "Meio Ambiente", descricao: "Atua na conservação ambiental, sensibilização cultural e fotografia de natureza, com oportunidades em biologia, educação ambiental, audiovisual e administração.", site: "https://institutoultimosrefugios.org.br/", icone: "🌿", imagem: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85", membros_count: 38 },
  { id_cadastro_ONG: 8, CNPJ: "Não informado", nome: "IEMA", cidade: "Cariacica, ES", area: "Meio Ambiente", descricao: "O Instituto Estadual de Meio Ambiente coordena ações de educação ambiental e o Programa de Voluntariado em Unidades de Conservação, com atuação em parques estaduais como Itaúnas e Paulo César Vinha.", site: "https://iema.es.gov.br/", icone: "🌊", imagem: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=85", membros_count: 82 },
];

const projetos: Projetos[] = [
  { id_projeto: 1, ong: 1, titulo: "Programa de Voluntariado ACACCI", descricao: "Acolhimento, recreação, apoio em eventos e organização de bazares para crianças, adolescentes e famílias em tratamento oncológico.", area: "Saúde", cidade: "Vitória, ES", vagas: 12, periodo: "Encontros e ações programadas" },
  { id_projeto: 2, ong: 2, titulo: "Mentoria e Apoio Educacional", descricao: "Apoio a estudantes bolsistas com reforço, orientação de estudos e mentoria profissional.", area: "Educação", cidade: "Vitória, ES", vagas: 10, periodo: "1 a 2 encontros por semana" },
  { id_projeto: 3, ong: 3, titulo: "Contraturno, Cultura e Esporte", descricao: "Atividades de informática, música e esportes para crianças, além de oficinas de autonomia para mulheres.", area: "Assistência Social", cidade: "Cariacica, ES", vagas: 18, periodo: "Tardes durante a semana" },
  { id_projeto: 4, ong: 4, titulo: "Educação Complementar e Direitos", descricao: "Ações de mobilização popular, educação complementar e orientação sobre direitos básicos.", area: "Educação", cidade: "Grande Vitória, ES", vagas: 8, periodo: "Sábados, 4h/semana" },
  { id_projeto: 5, ong: 5, titulo: "Apoio Humanizado a Pacientes", descricao: "Ações de acolhimento e apoio humanizado a pacientes e familiares em projetos internos do hospital.", area: "Saúde", cidade: "Vila Velha, ES", vagas: 10, periodo: "Escalas semanais, maiores de 18 anos" },
  { id_projeto: 6, ong: 6, titulo: "Programa Ajudar APAE", descricao: "Voluntariado formal em áreas profissionais, atendimento de apoio e atividades institucionais da APAE.", area: "Assistência Social", cidade: "Vila Velha, ES", vagas: 14, periodo: "Conforme termo de adesão" },
  { id_projeto: 7, ong: 7, titulo: "Conservação e Educação Ambiental", descricao: "Apoio em biologia, educação ambiental, audiovisual, fotografia de natureza e administração.", area: "Meio Ambiente", cidade: "Vitória, ES", vagas: 9, periodo: "Ações e processos recorrentes" },
  { id_projeto: 8, ong: 8, titulo: "Voluntariado em Unidades de Conservação", descricao: "Vivência temporária em parques estaduais, apoiando educação ambiental e conservação em áreas como Itaúnas e Paulo César Vinha.", area: "Meio Ambiente", cidade: "Cariacica, ES", vagas: 16, periodo: "Chamadas temporárias" },
];

const usuarioLogado: CadastroUsuario = {
  id_cadastro_voluntario: 1,
  nome: "João SixSeven da Silva",
  email: "Mr.Farmador@gmail.com",
  CPF: "123.456.789-00",
  nome_usuario: "João SixSeven da Silva",
  cidade: "Vitória, ES",
  bio: "Estudante de Serviço Social na UFES. Apaixonado por causas socioambientais.",
};

const membrosInicial: Membro[] = [
  { id: 1, usuario: 1, ong: 3, adm_ong: false },
];

const voluntariadosInicial: Voluntariado[] = [
  { id: 1, usuario: 1, projeto: 5, status: "aprovado", data_inscricao: "2026-08-10", mensagem: "Tenho disponibilidade total aos sábados." },
  { id: 2, usuario: 1, projeto: 7, status: "pendente", data_inscricao: "2026-09-02", mensagem: "Sou boa em matemática e adoraria ajudar." },
  { id: 3, usuario: 1, projeto: 1, status: "em_andamento", data_inscricao: "2026-07-15", mensagem: "Tenho experiência como cuidadora voluntária." },
];

// ── HELPERS ───────────────────────────────────────────────────────────────
const statusLabel: Record<StatusVoluntariado, string> = {
  pendente: "Aguardando análise",
  aprovado: "Aprovado",
  recusado: "Recusado",
  em_andamento: "Em andamento",
  concluido: "Concluído",
};

const statusStyle: Record<StatusVoluntariado, { bg: string; color: string }> = {
  pendente:     { bg: "#fef3c7", color: "#92400e" },
  aprovado:     { bg: "#dcfce7", color: "#166534" },
  recusado:     { bg: "#fee2e2", color: "#991b1b" },
  em_andamento: { bg: "#dbeafe", color: "#1e40af" },
  concluido:    { bg: "#f3f4f6", color: "#374151" },
};

const areaBadgeStyle: Record<string, { bg: string; color: string }> = {
  "Saúde":            { bg: "#fce7f3", color: "#9d174d" },
  "Assistência Social":{ bg: "#fef3c7", color: "#92400e" },
  "Meio Ambiente":    { bg: "#dcfce7", color: "#166534" },
  "Educação":         { bg: "#dbeafe", color: "#1e40af" },
};

function getOng(id: number) { return ongs.find(o => o.id_cadastro_ONG === id)!; }
function getProjeto(id: number) { return projetos.find(p => p.id_projeto === id)!; }

// ── ROOT ──────────────────────────────────────────────────────────────────
function App() {
  const [page, setPage] = useState<Page>("home");
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [selectedOng, setSelectedOng] = useState<CadastroONG | null>(null);
  const [selectedProjeto, setSelectedProjeto] = useState<Projetos | null>(null);
  const [voluntariados, setVoluntariados] = useState<Voluntariado[]>(voluntariadosInicial);
  const [membros, setMembros] = useState<Membro[]>(membrosInicial);
  const [loggedIn, setLoggedIn] = useState(true);
  // ── novo: dois tipos de usuário ─────────────────────────────────────────
  const [tipoUsuario, setTipoUsuario] = useState<"voluntario" | "ong" | null>("voluntario");
  const [loggedInOng, setLoggedInOng] = useState(false);
  const [ongLogadaId, setOngLogadaId] = useState<number>(1);
  const [ongDashTab, setOngDashTab] = useState<"dashboard" | "oportunidades" | "voluntarios" | "criar" | "configuracoes">("dashboard");
  // ────────────────────────────────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<null | "candidatura" | "membro">(null);
  const [modalProjeto, setModalProjeto] = useState<Projetos | null>(null);
  const [modalOng, setModalOng] = useState<CadastroONG | null>(null);
  const [candidaturaMsg, setCandidaturaMsg] = useState("");
  const [toast, setToast] = useState("");
  const [filtroArea, setFiltroArea] = useState("Todas");
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [dashTab, setDashTab] = useState<"geral" | "voluntariados" | "membros">("geral");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setNavVisible(currentScrollY < 24 || currentScrollY <= lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function nav(p: Page, ong?: CadastroONG, projeto?: Projetos) {
    setPage(p);
    if (ong) setSelectedOng(ong);
    if (projeto) setSelectedProjeto(projeto);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  function openCandidatura(p: Projetos) {
    setModalProjeto(p);
    setCandidaturaMsg("");
    setModal("candidatura");
  }

  function openMembro(o: CadastroONG) {
    setModalOng(o);
    setModal("membro");
  }

  function enviarCandidatura() {
    if (!modalProjeto) return;
    const jaInscrito = voluntariados.some(v => v.usuario === usuarioLogado.id_cadastro_voluntario && v.projeto === modalProjeto.id_projeto);
    if (!jaInscrito) {
      setVoluntariados(prev => [...prev, {
        id: prev.length + 10,
        usuario: usuarioLogado.id_cadastro_voluntario,
        projeto: modalProjeto.id_projeto,
        status: "pendente",
        data_inscricao: new Date().toISOString().split("T")[0],
        mensagem: candidaturaMsg,
      }]);
    }
    setModal(null);
    showToast("Candidatura enviada com sucesso! 🎉");
  }

  function entrarComMembro() {
    if (!modalOng) return;
    const jaEMembro = membros.some(m => m.usuario === usuarioLogado.id_cadastro_voluntario && m.ong === modalOng.id_cadastro_ONG);
    if (!jaEMembro) {
      setMembros(prev => [...prev, {
        id: prev.length + 10,
        usuario: usuarioLogado.id_cadastro_voluntario,
        ong: modalOng.id_cadastro_ONG,
        adm_ong: false,
      }]);
    }
    setModal(null);
    showToast(`Você agora é membro da ${modalOng.nome}! 🎉`);
  }

  function isInscrito(projetoId: number) {
    return voluntariados.some(v => v.usuario === usuarioLogado.id_cadastro_voluntario && v.projeto === projetoId);
  }

  function isMembro(ongId: number) {
    return membros.some(m => m.usuario === usuarioLogado.id_cadastro_voluntario && m.ong === ongId);
  }

  const projetosFiltrados = filtroArea === "Todas" ? projetos : projetos.filter(p => p.area === filtroArea);
  const meusVols = voluntariados.filter(v => v.usuario === usuarioLogado.id_cadastro_voluntario);
  const meusMembros = membros.filter(m => m.usuario === usuarioLogado.id_cadastro_voluntario);

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
          {(loggedIn || loggedInOng) ? (
            <button onClick={() => nav(loggedInOng ? "dashboard-ong" : "dashboard")}
              style={{ border: "1px solid #333", color: "#fff", background: "transparent", padding: "0.45rem 1.1rem", borderRadius: 8, cursor: "pointer", fontSize: "0.9rem" }}>
              {loggedInOng ? "🏢 Painel ONG" : "Meu Painel"}
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
            { label: (loggedIn || loggedInOng) ? (loggedInOng ? "🏢 Painel ONG" : "Meu Painel") : "Entrar",
              p: loggedInOng ? "dashboard-ong" as Page : loggedIn ? "dashboard" as Page : "login-escolha" as Page },
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
        {page === "home"       && <HomePage nav={nav} onCandidatura={openCandidatura} isInscrito={isInscrito} />}
        {page === "ongs"       && <ONGsPage nav={nav} isMembro={isMembro} onMembro={openMembro} />}
        {page === "projetos"   && <ProjetosPage filtroArea={filtroArea} setFiltroArea={setFiltroArea} projetosFiltrados={projetosFiltrados} nav={nav} onCandidatura={openCandidatura} isInscrito={isInscrito} />}
        {page === "doar"       && <DoarPage showToast={showToast} />}
        {page === "ong-detalhe" && selectedOng && (
          <OngDetalhePage ong={selectedOng} nav={nav} onCandidatura={openCandidatura} isInscrito={isInscrito} isMembro={isMembro} onMembro={openMembro} />
        )}
        {page === "login"      && <LoginPage nav={nav} authTab={authTab} setAuthTab={setAuthTab} onLogin={() => { setLoggedIn(true); nav("dashboard"); showToast("Bem-vindo de volta! 🎉"); }} onRegister={() => { setLoggedIn(true); nav("dashboard"); showToast("Cadastro realizado! 🚀"); }} />}
        {page === "dashboard"  && loggedIn && (
          <DashboardPage usuario={usuarioLogado} meusVols={meusVols} meusMembros={meusMembros} dashTab={dashTab} setDashTab={setDashTab} nav={nav} onLogout={() => { setLoggedIn(false); setTipoUsuario(null); nav("home"); showToast("Até logo! 👋"); }} />
        )}
        {/* ── NOVOS: fluxo dois tipos de usuário ─────────────────────────── */}
        {page === "login-escolha"      && <LoginEscolhaPage nav={nav} />}
        {page === "login-voluntario"   && <LoginVoluntarioPage nav={nav} onLogin={() => { setLoggedIn(true); setTipoUsuario("voluntario"); setLoggedInOng(false); nav("dashboard"); showToast("Bem-vindo, voluntário! 🎉"); }} />}
        {page === "cadastro-voluntario"&& <CadastroVoluntarioPage nav={nav} onSuccess={() => { setLoggedIn(true); setTipoUsuario("voluntario"); setLoggedInOng(false); nav("dashboard"); showToast("Conta criada com sucesso! 🚀"); }} />}
        {page === "login-ong"          && <LoginOngPage nav={nav} onLogin={(id) => { setLoggedInOng(true); setLoggedIn(false); setTipoUsuario("ong"); setOngLogadaId(id); nav("dashboard-ong"); showToast("Bem-vinda ao Voluntariar! 🏢"); }} />}
        {page === "cadastro-ong-full"  && <CadastroOngFullPage nav={nav} onSuccess={() => { showToast("ONG cadastrada! Aguarde verificação. ✅"); nav("login-ong"); }} />}
        {page === "dashboard-ong"      && loggedInOng && (
          <DashboardOngPage ong={getOng(ongLogadaId)} voluntariados={voluntariados} ongDashTab={ongDashTab} setOngDashTab={setOngDashTab} nav={nav}
            onLogout={() => { setLoggedInOng(false); setTipoUsuario(null); nav("home"); showToast("Até logo! 👋"); }}
            onStatusChange={(volId, status) => setVoluntariados(prev => prev.map(v => v.id === volId ? { ...v, status } : v))}
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
      {modal === "candidatura" && modalProjeto && (
        <ModalOverlay onClose={() => setModal(null)}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>💼</div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>Candidatar-se ao projeto</h2>
          <p style={{ color: "#4b5563", fontSize: "0.9rem", marginBottom: "1.25rem" }}>{modalProjeto.titulo} · {getOng(modalProjeto.ong).nome}</p>
          <FormGroup label="Por que quer participar?">
            <textarea value={candidaturaMsg} onChange={e => setCandidaturaMsg(e.target.value)} rows={3}
              placeholder="Conte sua motivação e disponibilidade..."
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", resize: "none", outline: "none", fontFamily: "inherit" }} />
          </FormGroup>
          <BtnPrimary onClick={enviarCandidatura} full>Enviar Candidatura</BtnPrimary>
        </ModalOverlay>
      )}

      {/* ── MODAL MEMBRO ───────────────────────────────────────────── */}
      {modal === "membro" && modalOng && (
        <ModalOverlay onClose={() => setModal(null)}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🏢</div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>Tornar-se membro</h2>
          <p style={{ color: "#4b5563", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Ao se tornar membro da <strong>{modalOng.nome}</strong>, você terá acesso às atividades internas da organização. Membros com perfil <strong>adm_ong</strong> podem gerenciar projetos e inscrições.
          </p>
          <BtnPrimary onClick={entrarComMembro} full>Confirmar vínculo como Membro</BtnPrimary>
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

function BtnPrimary({ onClick, children, full }: { onClick?: () => void; children: React.ReactNode; full?: boolean }) {
  return (
    <button onClick={onClick}
      style={{ background: "#22c55e", color: "#000", fontWeight: 700, padding: full ? "0.85rem" : "0.8rem 1.8rem", borderRadius: 10, border: "none", cursor: "pointer", fontSize: full ? "1rem" : "1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", width: full ? "100%" : undefined, justifyContent: full ? "center" : undefined, transition: "all 0.2s" }}
      onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "#16a34a"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
      onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "#22c55e"; (e.currentTarget as HTMLButtonElement).style.color = "#000"; }}>
      {children}
    </button>
  );
}

function BtnSecondary({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      style={{ background: "transparent", color: "#fff", fontWeight: 600, padding: "0.8rem 1.8rem", borderRadius: 10, border: "1px solid #ffffff30", cursor: "pointer", fontSize: "1rem", transition: "all 0.2s" }}>
      {children}
    </button>
  );
}

function BtnSm({ onClick, children, outline }: { onClick?: () => void; children: React.ReactNode; outline?: boolean }) {
  return (
    <button onClick={onClick}
      style={{ background: outline ? "transparent" : "#22c55e", color: outline ? "#22c55e" : "#000", fontWeight: 700, padding: "0.5rem 1.2rem", borderRadius: 8, border: outline ? "1.5px solid #22c55e" : "none", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s" }}>
      {children}
    </button>
  );
}

function Badge({ label, style: s }: { label: string; style?: React.CSSProperties }) {
  return <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: 99, background: "#f3f4f6", color: "#374151", ...s }}>{label}</span>;
}

function AreaBadge({ area }: { area: string }) {
  const s = areaBadgeStyle[area] || { bg: "#f3f4f6", color: "#374151" };
  return <Badge label={area} style={{ background: s.bg, color: s.color }} />;
}

function StatusBadge({ status }: { status: StatusVoluntariado }) {
  const s = statusStyle[status];
  return <Badge label={statusLabel[status]} style={{ background: s.bg, color: s.color }} />;
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.5rem", color: "#374151" }}>{label}</label>
      {children}
    </div>
  );
}

function FormInput({ placeholder, type = "text" }: { placeholder: string; type?: string }) {
  return (
    <input type={type} placeholder={placeholder}
      style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
  );
}

function ModalOverlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
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

function PageHero({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #0a0a0a, #0d1f14)", padding: "3.5rem 1.5rem 3rem", textAlign: "center" }}>
      <h1 style={{ color: "#fff", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, marginBottom: "0.5rem" }}>{title}</h1>
      <p style={{ color: "#9ca3af", fontSize: "1rem", maxWidth: 500, margin: "0 auto" }}>{sub}</p>
    </div>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────
function HomePage({ nav, onCandidatura, isInscrito }: { nav: Function; onCandidatura: (p: Projetos) => void; isInscrito: (id: number) => boolean }) {
  const destaqueONGs = ongs.slice(0, 3);
  const ultimosProjetos = projetos.slice(0, 4);

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
          { n: ongs.length, label: "ONGs parceiras" },
          { n: projetos.length, label: "Projetos ativos" },
          { n: "ES", label: "Estado de atuação" },
          { n: "5", label: "Entidades no sistema" },
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
            {destaqueONGs.map(ong => (
              <OngCard key={ong.id_cadastro_ONG} ong={ong} onClick={() => { nav("ong-detalhe", ong); }} />
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
            {ultimosProjetos.map(p => (
              <ProjetoCard key={p.id_projeto} projeto={p} isInscrito={isInscrito(p.id_projeto)} onCandidatura={() => onCandidatura(p)} />
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
function ONGsPage({ nav, isMembro, onMembro }: { nav: Function; isMembro: (id: number) => boolean; onMembro: (o: CadastroONG) => void }) {
  const [busca, setBusca] = useState("");
  const [filtroArea, setFiltroArea] = useState("Todas");

  const filtered = ongs.filter(o => {
    const matchBusca = o.nome.toLowerCase().includes(busca.toLowerCase()) || o.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchArea = filtroArea === "Todas" || o.area === filtroArea;
    return matchBusca && matchArea;
  });

  return (
    <div>
      <PageHero title="🔍 Buscar ONGs" sub="Organizações verificadas no Espírito Santo" />
      <section style={{ padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem", background: "#fff", padding: "1.25rem", borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px #0000000a" }}>
            <input value={busca} onChange={e => setBusca(e.target.value)}
              placeholder="🔍 Buscar por nome ou causa..."
              style={{ flex: 1, minWidth: 180, padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }} />
            <select value={filtroArea} onChange={e => setFiltroArea(e.target.value)}
              style={{ padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}>
              {["Todas", "Saúde", "Assistência Social", "Meio Ambiente", "Educação"].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.5rem" }}>
            {filtered.map(ong => (
              <OngCard key={ong.id_cadastro_ONG} ong={ong} onClick={() => nav("ong-detalhe", ong)}
                extraAction={
                  <BtnSm outline={isMembro(ong.id_cadastro_ONG)} onClick={() => { if (!isMembro(ong.id_cadastro_ONG)) onMembro(ong); }}>
                    {isMembro(ong.id_cadastro_ONG) ? "✓ Membro" : "Ser membro"}
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
function ProjetosPage({ filtroArea, setFiltroArea, projetosFiltrados, nav, onCandidatura, isInscrito }: {
  filtroArea: string; setFiltroArea: (a: string) => void; projetosFiltrados: Projetos[];
  nav: Function; onCandidatura: (p: Projetos) => void; isInscrito: (id: number) => boolean;
}) {
  const [busca, setBusca] = useState("");
  const final = projetosFiltrados.filter(p => p.titulo.toLowerCase().includes(busca.toLowerCase()) || p.descricao.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <PageHero title="💼 Projetos de Voluntariado" sub="Oportunidades para você fazer a diferença no ES" />
      <section style={{ padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem", background: "#fff", padding: "1.25rem", borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px #0000000a" }}>
            <input value={busca} onChange={e => setBusca(e.target.value)}
              placeholder="🔍 Buscar projeto..."
              style={{ flex: 1, minWidth: 180, padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }} />
            <select value={filtroArea} onChange={e => setFiltroArea(e.target.value)}
              style={{ padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}>
              {["Todas", "Saúde", "Assistência Social", "Meio Ambiente", "Educação"].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {final.map(p => (
              <ProjetoRow key={p.id_projeto} projeto={p} isInscrito={isInscrito(p.id_projeto)} onCandidatura={() => onCandidatura(p)} />
            ))}
          </div>
          {final.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: "3rem" }}>Nenhum projeto encontrado.</p>}
        </div>
      </section>
    </div>
  );
}

// ── ONG DETALHE PAGE ──────────────────────────────────────────────────────
function OngDetalhePage({ ong, nav, onCandidatura, isInscrito, isMembro, onMembro }: {
  ong: CadastroONG; nav: Function; onCandidatura: (p: Projetos) => void;
  isInscrito: (id: number) => boolean; isMembro: (id: number) => boolean; onMembro: (o: CadastroONG) => void;
}) {
  const projetosOng = projetos.filter(p => p.ong === ong.id_cadastro_ONG);
  const membro = isMembro(ong.id_cadastro_ONG);

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #0a0a0a, #0a2010)", padding: "3rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem", maxWidth: 900, margin: "0 auto", flexWrap: "wrap" }}>
          <div style={{ width: 100, height: 100, borderRadius: 20, background: "linear-gradient(135deg, #22c55e, #166534)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
            {ong.imagem ? <img src={ong.imagem} alt={`Logo da ${ong.nome}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "3rem" }}>{ong.icone}</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              <AreaBadge area={ong.area} />
              <Badge label={`📍 ${ong.cidade}`} style={{ background: "#1a1a1a", color: "#9ca3af" }} />
              {membro && <Badge label="✓ Você é membro" style={{ background: "#22c55e20", color: "#22c55e" }} />}
            </div>
            <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: 900, marginBottom: "0.35rem" }}>{ong.nome}</h1>
            <p style={{ color: "#9ca3af", fontSize: "0.95rem", marginBottom: "0.75rem" }}>CNPJ: {ong.CNPJ}</p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <BtnPrimary onClick={() => { if (!membro) onMembro(ong); }}>
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
              <p style={{ color: "#4b5563", lineHeight: 1.8 }}>{ong.descricao}</p>
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.25rem" }}>Projetos ativos ({projetosOng.length})</h2>
              {projetosOng.map(p => (
                <div key={p.id_projeto} style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: "1px solid #e5e7eb", marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>📋</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>{p.titulo}</h3>
                    <p style={{ color: "#4b5563", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{p.vagas} vagas · {p.periodo}</p>
                    <BtnSm onClick={() => onCandidatura(p)}>
                      {isInscrito(p.id_projeto) ? "✓ Inscrito" : "Candidatar-se"}
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
                <div><strong style={{ fontSize: "1.3rem", color: "#22c55e" }}>{ong.membros_count}</strong><br /><span style={{ fontSize: "0.8rem", color: "#4b5563" }}>Membros cadastrados</span></div>
                <div><strong style={{ fontSize: "1.3rem", color: "#22c55e" }}>{projetosOng.length}</strong><br /><span style={{ fontSize: "0.8rem", color: "#4b5563" }}>Projetos ativos</span></div>
              </div>
            </div>
            <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "1.5rem" }}>
              <h3 style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.75rem" }}>REGISTRO</h3>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "0.25rem" }}>🏢 CNPJ: {ong.CNPJ}</p>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>📍 {ong.cidade}</p>
              {ong.site && <a href={ong.site} target="_blank" rel="noreferrer" style={{ display: "inline-block", color: "#9ca3af", fontSize: "0.85rem", textDecoration: "none" }}>🌐 Visitar site</a>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN PAGE ────────────────────────────────────────────────────────────
function LoginPage({ nav, authTab, setAuthTab, onLogin, onRegister }: {
  nav: Function; authTab: "login" | "register"; setAuthTab: (t: "login" | "register") => void;
  onLogin: () => void; onRegister: () => void;
}) {
  const [tipoReg, setTipoReg] = useState<"voluntario" | "ong">("voluntario");

  return (
    <section style={{ padding: "3rem 1.5rem", minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 440, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🌱</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900 }}>Entrar no Voluntariar</h1>
          <p style={{ color: "#4b5563", fontSize: "0.9rem" }}>Conecte-se e comece a fazer a diferença no ES</p>
        </div>

        <div style={{ display: "flex", marginBottom: "2rem", borderRadius: 10, overflow: "hidden", border: "1.5px solid #e5e7eb" }}>
          {(["login", "register"] as const).map(t => (
            <button key={t} onClick={() => setAuthTab(t)}
              style={{ flex: 1, padding: "0.75rem", textAlign: "center", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem", background: authTab === t ? "#0a0a0a" : "#fff", color: authTab === t ? "#fff" : "#4b5563", border: "none" }}>
              {t === "login" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>

        {authTab === "login" ? (
          <div>
            <FormGroup label="E-mail"><FormInput placeholder="seu@email.com" type="email" /></FormGroup>
            <FormGroup label="Senha"><FormInput placeholder="••••••••" type="password" /></FormGroup>
            <BtnPrimary onClick={onLogin} full>Entrar</BtnPrimary>
            <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.85rem", marginTop: "1rem" }}>
              Esqueceu a senha? <span style={{ color: "#22c55e", cursor: "pointer" }}>Recuperar</span>
            </p>
          </div>
        ) : (
          <div>
            <FormGroup label="Tipo de conta">
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {(["voluntario", "ong"] as const).map(t => (
                  <button key={t} onClick={() => setTipoReg(t)}
                    style={{ flex: 1, padding: "0.75rem", borderRadius: 10, border: `2px solid ${tipoReg === t ? "#22c55e" : "#e5e7eb"}`, background: tipoReg === t ? "#dcfce7" : "#fff", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem", color: tipoReg === t ? "#166534" : "#374151" }}>
                    {t === "voluntario" ? "👤 Voluntário" : "🏢 ONG"}
                  </button>
                ))}
              </div>
            </FormGroup>
            <FormGroup label="Nome completo"><FormInput placeholder="Seu nome" /></FormGroup>
            {tipoReg === "voluntario" ? (
              <>
                <FormGroup label="Nome de usuário"><FormInput placeholder="nome_usuario" /></FormGroup>
                <FormGroup label="CPF"><FormInput placeholder="000.000.000-00" /></FormGroup>
              </>
            ) : (
              <FormGroup label="CNPJ"><FormInput placeholder="00.000.000/0000-00" /></FormGroup>
            )}
            <FormGroup label="E-mail"><FormInput placeholder="seu@email.com" type="email" /></FormGroup>
            <FormGroup label="Senha"><FormInput placeholder="Mínimo 8 caracteres" type="password" /></FormGroup>
            <BtnPrimary onClick={onRegister} full>Criar conta grátis</BtnPrimary>
          </div>
        )}
      </div>
    </section>
  );
}

// ── DASHBOARD PAGE ────────────────────────────────────────────────────────
function DashboardPage({ usuario, meusVols, meusMembros, dashTab, setDashTab, nav, onLogout }: {
  usuario: CadastroUsuario; meusVols: Voluntariado[]; meusMembros: Membro[];
  dashTab: string; setDashTab: (t: any) => void; nav: Function; onLogout: () => void;
}) {
  const countStatus = (s: StatusVoluntariado) => meusVols.filter(v => v.status === s).length;

  return (
    <section style={{ padding: "2.5rem 1.5rem", minHeight: "calc(100vh - 64px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem" }}>

        {/* Sidebar */}
        <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "1.5rem", alignSelf: "start" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#166534)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: "1rem" }}>👤</div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem" }}>{usuario.nome}</div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem", marginBottom: "1.5rem" }}>@{usuario.nome_usuario} · {usuario.cidade}</div>
          <nav>
            {[
              { id: "geral", label: "🏠 Visão Geral" },
              { id: "voluntariados", label: "💼 Meus Voluntariados" },
              { id: "membros", label: "🏢 Minhas ONGs (Membro)" },
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
          {dashTab === "geral" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  { n: meusVols.length, label: "Candidaturas" },
                  { n: countStatus("aprovado") + countStatus("em_andamento"), label: "Voluntariados ativos" },
                  { n: meusMembros.length, label: "ONGs como membro" },
                ].map(c => (
                  <div key={c.label} style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: "1px solid #e5e7eb" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 900, color: "#22c55e" }}>{c.n}</div>
                    <div style={{ color: "#4b5563", fontSize: "0.85rem" }}>{c.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb", marginBottom: "1.5rem" }}>
                <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>📋 Dados cadastrais (CADASTRO_USUARIO)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.88rem" }}>
                  {[
                    { label: "nome", val: usuario.nome },
                    { label: "email", val: usuario.email },
                    { label: "CPF", val: usuario.CPF },
                    { label: "nome_usuario", val: usuario.nome_usuario },
                    { label: "cidade", val: usuario.cidade },
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
                {(["pendente", "aprovado", "em_andamento", "recusado", "concluido"] as StatusVoluntariado[]).map(s => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.6rem 0", borderBottom: "1px solid #f3f4f6" }}>
                    <StatusBadge status={s} />
                    <span style={{ fontSize: "0.85rem", color: "#4b5563" }}>{countStatus(s)} {countStatus(s) === 1 ? "registro" : "registros"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dashTab === "voluntariados" && (
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "1.5rem" }}>Meus Voluntariados (VOLUNTARIADO)</h2>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
                {meusVols.length === 0 ? (
                  <p style={{ color: "#9ca3af", textAlign: "center", padding: "2rem" }}>Nenhum voluntariado ainda. Explore os projetos!</p>
                ) : meusVols.map(v => {
                  const p = getProjeto(v.projeto);
                  const o = getOng(p.ong);
                  return (
                    <div key={v.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 0", borderBottom: "1px solid #f3f4f6" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>{o.icone}</div>
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: "block", fontSize: "0.9rem", fontWeight: 600 }}>{p.titulo}</strong>
                        <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{o.nome} · Inscrito em {v.data_inscricao}</span>
                      </div>
                      <StatusBadge status={v.status} />
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.75rem", fontFamily: "monospace" }}>
                Entidade: VOLUNTARIADO (usuario FK, projeto FK, status CHAR)
              </p>
            </div>
          )}

          {dashTab === "membros" && (
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "1.5rem" }}>Minhas ONGs — Vínculo de Membro (MEMBRO)</h2>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
                {meusMembros.length === 0 ? (
                  <p style={{ color: "#9ca3af", textAlign: "center", padding: "2rem" }}>Você ainda não é membro de nenhuma ONG.</p>
                ) : meusMembros.map(m => {
                  const o = getOng(m.ong);
                  return (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 0", borderBottom: "1px solid #f3f4f6" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>{o.icone}</div>
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: "block", fontSize: "0.9rem", fontWeight: 600 }}>{o.nome}</strong>
                        <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{o.cidade} · CNPJ: {o.CNPJ}</span>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Badge label={m.adm_ong ? "👑 adm_ong" : "Membro"} style={m.adm_ong ? { background: "#fef3c7", color: "#92400e" } : { background: "#dcfce7", color: "#166534" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.75rem", fontFamily: "monospace" }}>
                Entidade: MEMBRO (usuario FK, ong FK, adm_ong BOOLEAN)
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── CARD COMPONENTS ───────────────────────────────────────────────────────
function OngCard({ ong, onClick, extraAction }: { ong: CadastroONG; onClick: () => void; extraAction?: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}
      style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: `1px solid ${hov ? "#22c55e" : "#e5e7eb"}`, transition: "all 0.25s", cursor: "pointer", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? "0 12px 32px #00000015" : "none" }}>
      <div style={{ background: "linear-gradient(135deg,#1a2e1a,#0d1f0d)", height: 120, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {ong.imagem ? <img src={ong.imagem} alt={`Logo da ${ong.nome}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "3.5rem" }}>{ong.icone}</span>}
      </div>
      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          <AreaBadge area={ong.area} />
          <Badge label={`👥 ${ong.membros_count}`} />
        </div>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.35rem" }}>{ong.nome}</h3>
        <p style={{ color: "#4b5563", fontSize: "0.88rem", marginBottom: "0.5rem", lineHeight: 1.5 }}>{ong.descricao.slice(0, 90)}...</p>
        <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.75rem" }}>📍 {ong.cidade}</p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <BtnSm onClick={onClick}>Ver mais</BtnSm>
          {extraAction}
        </div>
      </div>
    </div>
  );
}

function ProjetoCard({ projeto, isInscrito, onCandidatura }: { projeto: Projetos; isInscrito: boolean; onCandidatura: () => void }) {
  const ong = getOng(projeto.ong);
  return (
    <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #e5e7eb" }}>
      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          <Badge label="Voluntariado" style={{ background: "#dcfce7", color: "#166534" }} />
          <AreaBadge area={projeto.area} />
        </div>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.25rem" }}>{projeto.titulo}</h3>
        <p style={{ color: "#4b5563", fontSize: "0.88rem", marginBottom: "0.5rem" }}>{ong.nome} · {projeto.cidade} · {projeto.periodo}</p>
        <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.75rem" }}>🎯 {projeto.vagas} vagas disponíveis</p>
        <BtnSm onClick={onCandidatura}>{isInscrito ? "✓ Inscrito" : "Candidatar-se"}</BtnSm>
      </div>
    </div>
  );
}

function ProjetoRow({ projeto, isInscrito, onCandidatura }: { projeto: Projetos; isInscrito: boolean; onCandidatura: () => void }) {
  const ong = getOng(projeto.ong);
  const areaIcons: Record<string, string> = { "Saúde": "🏥", "Assistência Social": "🤝", "Meio Ambiente": "🌿", "Educação": "📚" };
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb" }}>
      <div style={{ padding: "1.25rem", display: "flex", alignItems: "flex-start", gap: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ fontSize: "2.5rem", lineHeight: 1 }}>{areaIcons[projeto.area] || "📋"}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
            <Badge label="Voluntariado" style={{ background: "#dcfce7", color: "#166534" }} />
            <AreaBadge area={projeto.area} />
            <Badge label={projeto.cidade} />
          </div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.25rem" }}>{projeto.titulo}</h3>
          <p style={{ color: "#4b5563", fontSize: "0.88rem" }}>{ong.nome} · {projeto.vagas} vagas · {projeto.periodo}</p>
        </div>
        <BtnSm onClick={onCandidatura}>{isInscrito ? "✓ Inscrito" : "Candidatar-se"}</BtnSm>
      </div>
    </div>
  );
}

// ── DOAR PAGE ─────────────────────────────────────────────────────────────
function DoarPage({ showToast }: { showToast: (msg: string) => void }) {
  const [ongSel, setOngSel] = useState(0);
  const [valor, setValor] = useState(50);
  const [valorCustom, setValorCustom] = useState("");
  const [recorrente, setRecorrente] = useState(false);
  const [anonimo, setAnonimo] = useState(false);
  const [pagamento, setPagamento] = useState<"pix" | "cartao" | "boleto">("pix");
  const [sucesso, setSucesso] = useState(false);

  const valorFinal = valor === 0 ? Number(valorCustom) || 0 : valor;

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
            Obrigado! Sua doação de <strong>R${valorFinal}</strong> para a <strong>{ongs[ongSel].nome}</strong> chegará em até 1 dia útil.
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
              {ongs.map((o, i) => <option key={o.id_cadastro_ONG} value={i}>{o.icone} {o.nome} – {o.area}</option>)}
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

          <BtnPrimary onClick={() => { setSucesso(true); showToast("Doação confirmada! 💚"); }} full>
            ✅ Confirmar Doação{valorFinal > 0 ? ` de R$${valorFinal}` : ""}
          </BtnPrimary>
        </div>
      </section>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// NOVOS COMPONENTES – Fluxo dois tipos de usuário
// ════════════════════════════════════════════════════════════════════════════

// ── 1. TELA DE ESCOLHA ───────────────────────────────────────────────────
function LoginEscolhaPage({ nav }: { nav: Function }) {
  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "linear-gradient(135deg,#0a0a0a 0%,#0d1f14 60%,#0a2a16 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: 680, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌱</div>
        <h1 style={{ color: "#fff", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, marginBottom: "0.75rem" }}>
          Bem-vindo ao <span style={{ color: "#22c55e" }}>Voluntariar</span>
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "1.05rem", marginBottom: "3rem" }}>
          Escolha como você deseja acessar a plataforma.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          {/* Card Voluntário */}
          <button onClick={() => nav("login-voluntario")}
            style={{ background: "#111", border: "1.5px solid #222", borderRadius: 16, padding: "2rem", cursor: "pointer", textAlign: "left", transition: "all 0.25s" }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = "#22c55e"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px #22c55e20"; }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = "#222"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}></div>
            <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "1.2rem", marginBottom: "0.5rem" }}>Voluntário</h2>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Encontre oportunidades, participe de ações e faça a diferença.
            </p>
            <div style={{ background: "#22c55e", color: "#000", fontWeight: 700, padding: "0.65rem 1.25rem", borderRadius: 9, fontSize: "0.9rem", display: "inline-block" }}>
              Entrar como Voluntário →
            </div>
          </button>

          {/* Card ONG */}
          <button onClick={() => nav("login-ong")}
            style={{ background: "#111", border: "1.5px solid #222", borderRadius: 16, padding: "2rem", cursor: "pointer", textAlign: "left", transition: "all 0.25s" }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = "#22c55e"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px #22c55e20"; }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = "#222"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}></div>
            <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "1.2rem", marginBottom: "0.5rem" }}>ONG</h2>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Cadastre sua organização, publique oportunidades e encontre voluntários.
            </p>
            <div style={{ background: "#22c55e", color: "#000", fontWeight: 700, padding: "0.65rem 1.25rem", borderRadius: 9, fontSize: "0.9rem", display: "inline-block" }}>
              Entrar como ONG →
            </div>
          </button>
        </div>

        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          Você ainda não possui uma conta?{" "}
          <span onClick={() => nav("cadastro-voluntario")} style={{ color: "#22c55e", cursor: "pointer", fontWeight: 600 }}>Cadastre-se</span>
        </p>
      </div>
    </div>
  );
}

// ── 2. LOGIN DO VOLUNTÁRIO ────────────────────────────────────────────────
function LoginVoluntarioPage({ nav, onLogin }: { nav: Function; onLogin: () => void }) {
  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#f9fafb" }}>
      <div style={{ maxWidth: 440, width: "100%", background: "#fff", borderRadius: 16, padding: "2.5rem", border: "1px solid #e5e7eb", boxShadow: "0 4px 24px #0000000a" }}>
        <button onClick={() => nav("login-escolha")} style={{ color: "#9ca3af", background: "transparent", border: "none", cursor: "pointer", fontSize: "0.85rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          ← Voltar e escolher outro tipo de acesso
        </button>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}></div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900 }}>Entrar como Voluntário</h1>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Acesse sua conta e encontre oportunidades</p>
        </div>
        <FormGroup label="CPF ou E-mail">
          <input placeholder="CPF ou E-mail" style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
        </FormGroup>
        <FormGroup label="Senha">
          <input type="password" placeholder="Senha" style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
        </FormGroup>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#374151", cursor: "pointer" }}>
            <input type="checkbox" /> Lembrar de mim
          </label>
          <span style={{ color: "#22c55e", cursor: "pointer" }}>Esqueci minha senha</span>
        </div>
        <BtnPrimary onClick={onLogin} full>Entrar</BtnPrimary>
        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.85rem", marginTop: "1.25rem" }}>
          Ainda não possui uma conta?{" "}
          <span onClick={() => nav("cadastro-voluntario")} style={{ color: "#22c55e", cursor: "pointer", fontWeight: 600 }}>Criar conta de Voluntário</span>
        </p>
      </div>
    </div>
  );
}

// ── 3. CADASTRO DO VOLUNTÁRIO ─────────────────────────────────────────────
function CadastroVoluntarioPage({ nav, onSuccess }: { nav: Function; onSuccess: () => void }) {
  const [termos, setTermos] = useState(false);
  const fi = (ph: string, type = "text") => (
    <input type={type} placeholder={ph} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
  );
  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "#f9fafb", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", background: "#fff", borderRadius: 16, padding: "2.5rem", border: "1px solid #e5e7eb", boxShadow: "0 4px 24px #0000000a" }}>
        <button onClick={() => nav("login-voluntario")} style={{ color: "#9ca3af", background: "transparent", border: "none", cursor: "pointer", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          ← Voltar
        </button>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🙋</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900 }}>Criar conta de Voluntário</h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <FormGroup label="Nome completo">{fi("Nome completo")}</FormGroup>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormGroup label="CPF">{fi("000.000.000-00")}</FormGroup>
            <FormGroup label="Telefone">{fi("(27) 99999-9999")}</FormGroup>
          </div>
          <FormGroup label="E-mail">{fi("seu@email.com", "email")}</FormGroup>
          <FormGroup label="Data de nascimento">{fi("DD/MM/AAAA", "date")}</FormGroup>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormGroup label="Senha">{fi("Mínimo 8 caracteres", "password")}</FormGroup>
            <FormGroup label="Confirmar senha">{fi("Confirmar senha", "password")}</FormGroup>
          </div>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.85rem", color: "#374151", cursor: "pointer", marginBottom: "0.5rem" }}>
            <input type="checkbox" checked={termos} onChange={e => setTermos(e.target.checked)} style={{ marginTop: 2 }} />
            Li e concordo com os termos de uso e política de privacidade.
          </label>
          <BtnPrimary onClick={onSuccess} full>Criar minha conta</BtnPrimary>
        </div>
      </div>
    </div>
  );
}

// ── 4. LOGIN DA ONG ───────────────────────────────────────────────────────
function LoginOngPage({ nav, onLogin }: { nav: Function; onLogin: (id: number) => void }) {
  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#f9fafb" }}>
      <div style={{ maxWidth: 440, width: "100%", background: "#fff", borderRadius: 16, padding: "2.5rem", border: "1px solid #e5e7eb", boxShadow: "0 4px 24px #0000000a" }}>
        <button onClick={() => nav("login-escolha")} style={{ color: "#9ca3af", background: "transparent", border: "none", cursor: "pointer", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          ← Voltar e escolher outro tipo de acesso
        </button>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🏢</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900 }}>Entrar como ONG</h1>
          <p style={{ color: "#6b7280", fontSize: "0.88rem", marginTop: "0.4rem" }}>
            Acesse o painel da sua organização para divulgar oportunidades, gerenciar voluntários e apresentar suas ações.
          </p>
        </div>
        <FormGroup label="CNPJ">
          <input placeholder="00.000.000/0000-00" style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
        </FormGroup>
        <FormGroup label="Senha">
          <input type="password" placeholder="Senha" style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
        </FormGroup>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#374151", cursor: "pointer" }}>
            <input type="checkbox" /> Lembrar de mim
          </label>
          <span style={{ color: "#22c55e", cursor: "pointer" }}>Esqueci minha senha</span>
        </div>
        <BtnPrimary onClick={() => onLogin(1)} full>Entrar como ONG</BtnPrimary>
        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.85rem", marginTop: "1.25rem" }}>
          Ainda não possui uma conta?{" "}
          <span onClick={() => nav("cadastro-ong-full")} style={{ color: "#22c55e", cursor: "pointer", fontWeight: 600 }}>Cadastrar minha ONG</span>
        </p>
      </div>
    </div>
  );
}

// ── 5. CADASTRO DA ONG ────────────────────────────────────────────────────
function CadastroOngFullPage({ nav, onSuccess }: { nav: Function; onSuccess: () => void }) {
  const [termos, setTermos] = useState(false);
  const fi = (ph: string, type = "text") => (
    <input type={type} placeholder={ph} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
  );
  return (
    <div style={{ background: "#f9fafb", padding: "2.5rem 1.5rem", minHeight: "calc(100vh - 64px)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", borderRadius: 16, padding: "2.5rem", border: "1px solid #e5e7eb", boxShadow: "0 4px 24px #0000000a" }}>
        <button onClick={() => nav("login-ong")} style={{ color: "#9ca3af", background: "transparent", border: "none", cursor: "pointer", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          ← Voltar
        </button>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🏢</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900 }}>Cadastrar ONG</h1>
        </div>

        <SectionDivider label="Dados da organização" />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormGroup label="Nome da ONG">{fi("Nome oficial")}</FormGroup>
            <FormGroup label="Nome fantasia">{fi("Como é conhecida")}</FormGroup>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormGroup label="CNPJ">{fi("00.000.000/0000-00")}</FormGroup>
            <FormGroup label="Telefone">{fi("(27) 99999-9999")}</FormGroup>
          </div>
          <FormGroup label="E-mail institucional">{fi("contato@ong.org.br", "email")}</FormGroup>
          <FormGroup label="Endereço">{fi("Rua, número, bairro")}</FormGroup>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
            <FormGroup label="Cidade">{fi("Vitória")}</FormGroup>
            <FormGroup label="Estado">
              <select style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit", background: "#fff" }}>
                <option value="ES">ES</option>
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
                <option value="MG">MG</option>
              </select>
            </FormGroup>
          </div>
        </div>

        <SectionDivider label="Informações da ONG" />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <FormGroup label="Área de atuação">
            <select style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit", background: "#fff" }}>
              {["Saúde", "Assistência Social", "Meio Ambiente", "Educação", "Cultura", "Tecnologia Social"].map(a => <option key={a}>{a}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="Descrição da organização">
            <textarea rows={4} placeholder="Conte a história e missão da sua ONG..."
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
          </FormGroup>
          <FormGroup label="Site ou redes sociais">{fi("https://www.suaong.org.br")}</FormGroup>
          <FormGroup label="Logo da ONG">
            <div style={{ border: "2px dashed #e5e7eb", borderRadius: 10, padding: "1.5rem", textAlign: "center", color: "#9ca3af", cursor: "pointer", fontSize: "0.9rem" }}>
              📷 Clique para fazer upload da logo
            </div>
          </FormGroup>
        </div>

        <SectionDivider label="Dados de acesso" />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormGroup label="Senha">{fi("Mínimo 8 caracteres", "password")}</FormGroup>
            <FormGroup label="Confirmar senha">{fi("Confirmar senha", "password")}</FormGroup>
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.85rem", color: "#374151", cursor: "pointer", marginBottom: "1.5rem" }}>
          <input type="checkbox" checked={termos} onChange={e => setTermos(e.target.checked)} style={{ marginTop: 2 }} />
          Li e concordo com os termos de uso e política de privacidade.
        </label>
        <BtnPrimary onClick={onSuccess} full>Cadastrar ONG</BtnPrimary>
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.5rem 0 1.25rem" }}>
      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
    </div>
  );
}

// ── 6. DASHBOARD DA ONG ───────────────────────────────────────────────────
const statusOportunidade: Record<string, { bg: string; color: string; label: string }> = {
  ativa:     { bg: "#dcfce7", color: "#166534", label: "Ativa" },
  encerrada: { bg: "#fee2e2", color: "#991b1b", label: "Encerrada" },
  rascunho:  { bg: "#fef3c7", color: "#92400e", label: "Rascunho" },
};

const statusOportunidades = ["ativa", "ativa", "encerrada", "rascunho", "ativa", "ativa", "ativa", "ativa", "ativa"];

function DashboardOngPage({ ong, voluntariados, ongDashTab, setOngDashTab, nav, onLogout, onStatusChange }: {
  ong: CadastroONG; voluntariados: Voluntariado[]; ongDashTab: string; setOngDashTab: (t: any) => void;
  nav: Function; onLogout: () => void; onStatusChange: (id: number, s: StatusVoluntariado) => void;
}) {
  const projetosOng = projetos.filter(p => p.ong === ong.id_cadastro_ONG);
  const inscricoes = voluntariados.filter(v => projetosOng.some(p => p.id_projeto === v.projeto));

  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "oportunidades", icon: "📋", label: "Oportunidades" },
    { id: "voluntarios", icon: "👥", label: "Voluntários" },
    { id: "criar", icon: "➕", label: "Criar oportunidade" },
    { id: "configuracoes", icon: "⚙️", label: "Configurações" },
  ];

  return (
    <section style={{ padding: "2.5rem 1.5rem", minHeight: "calc(100vh - 64px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "260px 1fr", gap: "2rem" }}>

        {/* Sidebar ONG */}
        <div style={{ background: "#0a0a0a", borderRadius: 14, padding: "1.5rem", alignSelf: "start" }}>
          <div style={{ width: 64, height: 64, borderRadius: 14, background: "linear-gradient(135deg,#22c55e,#166534)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: "1rem" }}>
            {ong.icone}
          </div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.3 }}>{ong.nome}</div>
          <div style={{ color: "#9ca3af", fontSize: "0.78rem", marginBottom: "1.5rem" }}>CNPJ: {ong.CNPJ}</div>
          <nav>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setOngDashTab(item.id)}
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: ongDashTab === item.id ? "#22c55e" : "#9ca3af", background: ongDashTab === item.id ? "#ffffff10" : "transparent", padding: "0.65rem 0.75rem", borderRadius: 8, fontSize: "0.9rem", cursor: "pointer", marginBottom: "0.25rem", width: "100%", border: "none", textAlign: "left" }}>
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
          {ongDashTab === "dashboard" && (
            <div>
              <div style={{ marginBottom: "1.75rem" }}>
                <h1 style={{ fontSize: "1.4rem", fontWeight: 900, marginBottom: "0.25rem" }}>Painel da ONG 🏢</h1>
                <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Bem-vinda ao Voluntariar. Gerencie suas ações e conecte-se com novos voluntários.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  { n: ong.membros_count, label: "Total de voluntários", icon: "👥" },
                  { n: projetosOng.length, label: "Oportunidades publicadas", icon: "📋" },
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
                  <BtnSm onClick={() => setOngDashTab("criar")}>+ Criar oportunidade</BtnSm>
                </div>
                <OportunidadesTable projetosOng={projetosOng} statusList={statusOportunidades} />
              </div>
            </div>
          )}

          {/* Oportunidades */}
          {ongDashTab === "oportunidades" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontWeight: 800, fontSize: "1.3rem" }}>Oportunidades publicadas</h2>
                <BtnSm onClick={() => setOngDashTab("criar")}>+ Criar oportunidade</BtnSm>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
                <OportunidadesTable projetosOng={projetosOng} statusList={statusOportunidades} />
              </div>
            </div>
          )}

          {/* Voluntários */}
          {ongDashTab === "voluntarios" && (
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "1.5rem" }}>Gerenciamento de Voluntários</h2>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
                {inscricoes.length === 0 ? (
                  <p style={{ color: "#9ca3af", textAlign: "center", padding: "2rem" }}>Nenhuma inscrição recebida ainda.</p>
                ) : (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1.2fr", gap: "0.75rem", padding: "0.5rem 0.75rem", marginBottom: "0.5rem" }}>
                      {["Voluntário", "Oportunidade", "Inscrição", "Status", "Ação"].map(h => (
                        <span key={h} style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
                      ))}
                    </div>
                    {inscricoes.map((v, i) => {
                      const p = getProjeto(v.projeto);
                      const nomes = ["Marcos Lima", "Beatriz Costa", "Rafael Souza", "Carla Mendes", "João Pedro"];
                      const nome = nomes[i % nomes.length];
                      const sstyle = statusStyle[v.status];
                      return (
                        <div key={v.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1.2fr", gap: "0.75rem", padding: "0.75rem", borderBottom: "1px solid #f3f4f6", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>👤</div>
                            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{nome}</span>
                          </div>
                          <span style={{ fontSize: "0.82rem", color: "#374151" }}>{p.titulo}</span>
                          <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{v.data_inscricao}</span>
                          <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: 99, background: sstyle.bg, color: sstyle.color }}>
                            {statusLabel[v.status]}
                          </span>
                          <select value={v.status} onChange={e => onStatusChange(v.id, e.target.value as StatusVoluntariado)}
                            style={{ fontSize: "0.8rem", padding: "0.3rem 0.5rem", borderRadius: 7, border: "1px solid #e5e7eb", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
                            {(["pendente", "aprovado", "em_andamento", "recusado", "concluido"] as StatusVoluntariado[]).map(s => (
                              <option key={s} value={s}>{statusLabel[s]}</option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Criar oportunidade */}
          {ongDashTab === "criar" && <CriarOportunidadeForm onPublicar={() => setOngDashTab("oportunidades")} />}

          {/* Configurações */}
          {ongDashTab === "configuracoes" && (
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "1.5rem" }}>Configurações da ONG</h2>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e5e7eb" }}>
                <SectionDivider label="Dados da organização" />
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <FormGroup label="Nome da ONG">
                    <input defaultValue={ong.nome} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
                  </FormGroup>
                  <FormGroup label="CNPJ">
                    <input defaultValue={ong.CNPJ} disabled style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", background: "#f9fafb", color: "#9ca3af", fontFamily: "inherit" }} />
                  </FormGroup>
                  <FormGroup label="Cidade">
                    <input defaultValue={ong.cidade} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: "0.95rem", outline: "none", fontFamily: "inherit" }} />
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

function OportunidadesTable({ projetosOng, statusList }: { projetosOng: Projetos[]; statusList: string[] }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "0.75rem", padding: "0.5rem 0.75rem", marginBottom: "0.5rem" }}>
        {["Nome", "Local", "Vagas", "Vagas Prench.", "Status"].map(h => (
          <span key={h} style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
        ))}
      </div>
      {projetosOng.map((p, i) => {
        const s = statusOportunidade[statusList[i] || "ativa"];
        const preenchidas = Math.floor(p.vagas * (0.3 + Math.random() * 0.6));
        return (
          <div key={p.id_projeto} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "0.75rem", padding: "0.75rem", borderBottom: "1px solid #f3f4f6", alignItems: "center" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{p.titulo}</span>
            <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>{p.cidade.split(",")[0]}</span>
            <span style={{ fontSize: "0.88rem" }}>{p.vagas}</span>
            <span style={{ fontSize: "0.88rem", color: "#22c55e", fontWeight: 600 }}>{preenchidas}</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: 99, background: s.bg, color: s.color }}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function CriarOportunidadeForm({ onPublicar }: { onPublicar: () => void }) {
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
const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(<App />);

