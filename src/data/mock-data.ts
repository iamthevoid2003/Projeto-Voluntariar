import type { Organization, Project, VolunteerApplication, VolunteerProfile, OrganizationMember } from "../types/models";

export const organizations: Organization[] = [
  { id: 1, cnpj: "31.730.278/0001-48", name: "ACACCI", city: "Vitória, ES", cause: "Saúde", description: "Referência capixaba no acolhimento de crianças e adolescentes em tratamento oncológico. Seu programa de voluntariado reúne ações de acolhimento, recreação, eventos e bazares.", website: "https://acacci.org.br/", icon: "🎗️", image: "https://acacci.org.br/wp-content/uploads/2026/05/cfb5eb4d215998801468c21580b64404d3e80630-scaled.png", memberCount: 48 },
  { id: 2, cnpj: "Não informado", name: "Instituto Ponte", city: "Vitória, ES", cause: "Educação", description: "Apoia estudantes talentosos de baixa renda com bolsas de estudo e mentoria. Voluntários podem atuar como professores de apoio, mentores profissionais ou no suporte institucional.", website: "https://institutoponte.org.br/", icon: "🎓", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85", memberCount: 32 },
  { id: 3, cnpj: "Não informado", name: "Instituto Social Esperança (ISE)", city: "Cariacica, ES", cause: "Assistência Social", description: "Atua em comunidades vulneráveis com atividades de contraturno escolar, informática, música e esportes para crianças, além de oficinas voltadas para mulheres.", website: "https://www.google.com/search?q=Instituto+Social+Esperan%C3%A7a+ES", icon: "🤝", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=85", memberCount: 56 },
  { id: 4, cnpj: "Não informado", name: "Instituto Maltrapilho", city: "Grande Vitória, ES", cause: "Educação", description: "Trabalha com mobilização popular, educação complementar e garantia de direitos básicos para comunidades da Grande Vitória.", website: "https://www.google.com/search?q=Instituto+Maltrapilho+ES", icon: "📚", image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=900&q=85", memberCount: 27 },
  { id: 5, cnpj: "Não informado", name: "Hospital Evangélico de Vila Velha", city: "Vila Velha, ES", cause: "Saúde", description: "Mantém ações humanizadas de apoio a pacientes e projetos internos, com oportunidades para voluntários maiores de 18 anos.", website: "https://www.google.com/search?q=Hospital+Evang%C3%A9lico+Vila+Velha+voluntariado", icon: "🏥", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=85", memberCount: 41 },
  { id: 6, cnpj: "Não informado", name: "APAE Espírito Santo", city: "Vila Velha, ES", cause: "Assistência Social", description: "Oferece o Programa Ajudar, com vagas formais de voluntariado e termo de adesão para áreas profissionais e de apoio geral.", website: "https://apaees.org.br/", icon: "💙", image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=900&q=85", memberCount: 74 },
  { id: 7, cnpj: "Não informado", name: "Instituto Últimos Refúgios", city: "Vitória, ES", cause: "Meio Ambiente", description: "Atua na conservação ambiental, sensibilização cultural e fotografia de natureza, com oportunidades em biologia, educação ambiental, audiovisual e administração.", website: "https://institutoultimosrefugios.org.br/", icon: "🌿", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85", memberCount: 38 },
  { id: 8, cnpj: "Não informado", name: "IEMA", city: "Cariacica, ES", cause: "Meio Ambiente", description: "O Instituto Estadual de Meio Ambiente coordena ações de educação ambiental e o Programa de Voluntariado em Unidades de Conservação, com atuação em parques estaduais como Itaúnas e Paulo César Vinha.", website: "https://iema.es.gov.br/", icon: "🌊", image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=85", memberCount: 82 },
];

export const projects: Project[] = [
  { id: 1, organizationId: 1, title: "Programa de Voluntariado ACACCI", description: "Acolhimento, recreação, apoio em eventos e organização de bazares para crianças, adolescentes e famílias em tratamento oncológico.", cause: "Saúde", city: "Vitória, ES", slots: 12, schedule: "Encontros e ações programadas" },
  { id: 2, organizationId: 2, title: "Mentoria e Apoio Educacional", description: "Apoio a estudantes bolsistas com reforço, orientação de estudos e mentoria profissional.", cause: "Educação", city: "Vitória, ES", slots: 10, schedule: "1 a 2 encontros por semana" },
  { id: 3, organizationId: 3, title: "Contraturno, Cultura e Esporte", description: "Atividades de informática, música e esportes para crianças, além de oficinas de autonomia para mulheres.", cause: "Assistência Social", city: "Cariacica, ES", slots: 18, schedule: "Tardes durante a semana" },
  { id: 4, organizationId: 4, title: "Educação Complementar e Direitos", description: "Ações de mobilização popular, educação complementar e orientação sobre direitos básicos.", cause: "Educação", city: "Grande Vitória, ES", slots: 8, schedule: "Sábados, 4h/semana" },
  { id: 5, organizationId: 5, title: "Apoio Humanizado a Pacientes", description: "Ações de acolhimento e apoio humanizado a pacientes e familiares em projetos internos do hospital.", cause: "Saúde", city: "Vila Velha, ES", slots: 10, schedule: "Escalas semanais, maiores de 18 anos" },
  { id: 6, organizationId: 6, title: "Programa Ajudar APAE", description: "Voluntariado formal em áreas profissionais, atendimento de apoio e atividades institucionais da APAE.", cause: "Assistência Social", city: "Vila Velha, ES", slots: 14, schedule: "Conforme termo de adesão" },
  { id: 7, organizationId: 7, title: "Conservação e Educação Ambiental", description: "Apoio em biologia, educação ambiental, audiovisual, fotografia de natureza e administração.", cause: "Meio Ambiente", city: "Vitória, ES", slots: 9, schedule: "Ações e processos recorrentes" },
  { id: 8, organizationId: 8, title: "Voluntariado em Unidades de Conservação", description: "Vivência temporária em parques estaduais, apoiando educação ambiental e conservação em áreas como Itaúnas e Paulo César Vinha.", cause: "Meio Ambiente", city: "Cariacica, ES", slots: 16, schedule: "Chamadas temporárias" },
];

export const currentUser: VolunteerProfile = {
  id: 1,
  name: "João SixSeven da Silva",
  email: "Mr.Farmador@gmail.com",
  cpf: "123.456.789-00",
  username: "João SixSeven da Silva",
  city: "Vitória, ES",
  bio: "Estudante de Serviço Social na UFES. Apaixonado por causas socioambientais.",
};

export const initialMembers: OrganizationMember[] = [
  { id: 1, userId: 1, organizationId: 3, isAdmin: false },
];

export const initialApplications: VolunteerApplication[] = [
  { id: 1, userId: 1, projectId: 5, status: "aprovado", appliedAt: "2026-08-10", message: "Tenho disponibilidade total aos sábados." },
  { id: 2, userId: 1, projectId: 7, status: "pendente", appliedAt: "2026-09-02", message: "Sou boa em matemática e adoraria ajudar." },
  { id: 3, userId: 1, projectId: 1, status: "em_andamento", appliedAt: "2026-07-15", message: "Tenho experiência como cuidadora voluntária." },
];
