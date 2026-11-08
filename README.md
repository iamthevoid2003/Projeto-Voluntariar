# Voluntariar

Plataforma demonstrativa que conecta voluntários a organizações e projetos
sociais no Espírito Santo. A interface atual permite explorar organizações,
consultar oportunidades, simular candidaturas e visualizar painéis de
voluntário e de ONG.

## Arquitetura

- `src/App.tsx`: navegação e estado da aplicação.
- `src/pages/`: páginas de descoberta, autenticação demonstrativa e painéis.
- `src/components/`: componentes reutilizáveis de interface e cartões.
- `src/data/mock-data.ts`: dados usados pelo protótipo.
- `src/types/`: modelos do domínio e tipos do banco Supabase.
- `src/config/`: criação do cliente Supabase com variáveis de ambiente.
- `src/repositories/`: consultas e comandos de persistência.
- `src/services/`: validações e casos de uso.
- `src/utils/`: utilitários e estilos compartilhados.
- `database/schema.sql`: tabelas, índices, políticas RLS e funções do Supabase.

## Desenvolvimento

Requer Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

Para validar e gerar a versão de produção:

```bash
npm run typecheck
npm run build
npm run preview
```

## Conexão com Supabase

1. Crie um projeto no [Supabase](https://supabase.com/).
2. No SQL Editor do projeto, execute [`database/schema.sql`](./database/schema.sql).
3. Copie `.env.example` para `.env` e preencha as credenciais do projeto:

   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon
   ```

   No Vite, o prefixo `VITE_` é necessário para disponibilizar essas variáveis
   no navegador. A chave `anon`/publishable pode ser usada no cliente porque o
   acesso é limitado pelas políticas RLS. Nunca use nem exponha a chave
   `service_role` no frontend.

4. Reinicie o servidor de desenvolvimento após alterar `.env`.
5. Use o cliente tipado nos serviços/repositórios:

   ```ts
   import { getSupabaseClient } from "./src/config/supabase";

   const supabase = getSupabaseClient();
   const { data, error } = await supabase
     .from("organizations")
     .select("*")
     .order("name");

   if (error) throw error;
   console.log(data);
   ```

   Para uma candidatura, o caso de uso já valida os dados e grava a inscrição
   do usuário autenticado:

   ```ts
   import { applyToProject } from "./src/services/volunteering.service";

   await applyToProject(projectId, "Posso ajudar aos sábados.");
   ```

   Antes de criar relações, cadastre o perfil com o mesmo UUID retornado pelo
   Supabase Auth. As políticas protegem perfis e inscrições por usuário e
   permitem gerenciamento de organização apenas a administradores.

## Estado da integração

A interface permanece em modo demonstrativo e usa `src/data/mock-data.ts`;
login, cadastro, candidatura e vínculo exibidos na tela ainda não chamam o
Supabase. O cliente tipado, repositórios e caso de uso de candidatura fornecem
a base para essa integração. Para produção, conecte os formulários ao Supabase
Auth e substitua os dados simulados pelos repositórios antes de publicar.

## Próximos passos

- Integrar autenticação, recuperação de senha e cadastro de perfis com Supabase
  Auth.
- Conectar as páginas às consultas e comandos dos repositórios.
- Adicionar testes para regras de negócio, políticas RLS e fluxos de interface.
- Configurar CI, variáveis de ambiente e implantação contínua.
