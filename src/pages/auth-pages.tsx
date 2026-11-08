import { useState } from "react";
import type { PageNavigation } from "../types/models";
import { BtnPrimary, FormGroup, FormInput, SectionDivider } from "../components/ui";

export function LoginPage({ nav, authTab, setAuthTab, onLogin, onRegister }: {
  nav: PageNavigation; authTab: "login" | "register"; setAuthTab: (t: "login" | "register") => void;
  onLogin: () => void; onRegister: () => void;
}) {
  const [registrationAccountType, setTipoReg] = useState<"voluntario" | "ong">("voluntario");

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
                    style={{ flex: 1, padding: "0.75rem", borderRadius: 10, border: `2px solid ${registrationAccountType === t ? "#22c55e" : "#e5e7eb"}`, background: registrationAccountType === t ? "#dcfce7" : "#fff", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem", color: registrationAccountType === t ? "#166534" : "#374151" }}>
                    {t === "voluntario" ? "👤 Voluntário" : "🏢 ONG"}
                  </button>
                ))}
              </div>
            </FormGroup>
            <FormGroup label="Nome completo"><FormInput placeholder="Seu nome" /></FormGroup>
            {registrationAccountType === "voluntario" ? (
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

export function AccountTypePage({ nav }: { nav: PageNavigation }) {
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

export function VolunteerLoginPage({ nav, onLogin }: { nav: PageNavigation; onLogin: () => void }) {
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

export function VolunteerRegistrationPage({ nav, onSuccess }: { nav: PageNavigation; onSuccess: () => void }) {
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

export function OrganizationLoginPage({ nav, onLogin }: { nav: PageNavigation; onLogin: (id: number) => void }) {
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

export function OrganizationRegistrationPage({ nav, onSuccess }: { nav: PageNavigation; onSuccess: () => void }) {
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
