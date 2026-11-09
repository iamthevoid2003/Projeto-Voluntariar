export type VolunteerStatus = "pendente" | "aprovado" | "recusado" | "em_andamento" | "concluido";
export type EntityId = number | string;
export type Page = "home" | "ongs" | "projetos" | "ong-detalhe" | "login" | "dashboard" | "cadastro-ong" | "doar"
         | "login-escolha" | "login-voluntario" | "cadastro-voluntario" | "login-ong" | "cadastro-ong-full"
         | "dashboard-ong";

export interface VolunteerProfile {
  id: EntityId;
  name: string;
  email: string;
  cpf: string;
  username: string;
  city: string;
  bio: string;
}

export interface Organization {
  id: EntityId;
  cnpj: string;
  name: string;
  city: string;
  cause: string;
  description: string;
  website?: string;
  icon: string;
  image?: string;
  memberCount?: number;
}

export interface OrganizationMember {
  id: EntityId;
  userId: EntityId;
  organizationId: EntityId;
  isAdmin: boolean;
}

export interface Project {
  id: EntityId;
  organizationId: EntityId;
  title: string;
  description: string;
  cause: string;
  city: string;
  slots: number;
  schedule: string;
}

export interface VolunteerApplication {
  id: EntityId;
  userId: EntityId;
  projectId: EntityId;
  status: VolunteerStatus;
  appliedAt: string;
  message: string;
}

export type PageNavigation = (page: Page, organization?: Organization, project?: Project) => void;
export type VolunteerDashboardTab = "overview" | "applications" | "organizationMembers";
export type OrganizationDashboardTab = "dashboard" | "opportunities" | "volunteers" | "create" | "settings";
