export type VolunteerStatus = "pendente" | "aprovado" | "recusado" | "em_andamento" | "concluido";
export type Page = "home" | "ongs" | "projetos" | "ong-detalhe" | "login" | "dashboard" | "cadastro-ong" | "doar"
         | "login-escolha" | "login-voluntario" | "cadastro-voluntario" | "login-ong" | "cadastro-ong-full"
         | "dashboard-ong";

export interface VolunteerProfile {
  id: number;
  name: string;
  email: string;
  cpf: string;
  username: string;
  city: string;
  bio: string;
}

export interface Organization {
  id: number;
  cnpj: string;
  name: string;
  city: string;
  cause: string;
  description: string;
  website?: string;
  icon: string;
  image?: string;
  memberCount: number;
}

export interface OrganizationMember {
  id: number;
  userId: number;   // FK → VolunteerProfile
  organizationId: number;       // FK → Organization
  isAdmin: boolean;
}

export interface Project {
  id: number;
  organizationId: number;       // FK → Organization
  title: string;
  description: string;
  cause: string;
  city: string;
  slots: number;
  schedule: string;
}

export interface VolunteerApplication {
  id: number;
  userId: number;   // FK → VolunteerProfile
  projectId: number;   // FK → Project
  status: VolunteerStatus;
  appliedAt: string;
  message: string;
}

export type PageNavigation = (page: Page, organization?: Organization, project?: Project) => void;
export type VolunteerDashboardTab = "overview" | "applications" | "organizationMembers";
export type OrganizationDashboardTab = "dashboard" | "opportunities" | "volunteers" | "create" | "settings";
