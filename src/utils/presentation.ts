import type { EntityId, Organization, Project, VolunteerStatus } from "../types/models";
import { organizations, projects } from "../data/mock-data";

export const statusLabel: Record<VolunteerStatus, string> = {
  pendente: "Aguardando análise",
  aprovado: "Aprovado",
  recusado: "Recusado",
  em_andamento: "Em andamento",
  concluido: "Concluído",
};

export const statusStyle: Record<VolunteerStatus, { bg: string; color: string }> = {
  pendente:     { bg: "#fef3c7", color: "#92400e" },
  aprovado:     { bg: "#dcfce7", color: "#166534" },
  recusado:     { bg: "#fee2e2", color: "#991b1b" },
  em_andamento: { bg: "#dbeafe", color: "#1e40af" },
  concluido:    { bg: "#f3f4f6", color: "#374151" },
};

export const areaBadgeStyle: Record<string, { bg: string; color: string }> = {
  "Saúde":            { bg: "#fce7f3", color: "#9d174d" },
  "Assistência Social":{ bg: "#fef3c7", color: "#92400e" },
  "Meio Ambiente":    { bg: "#dcfce7", color: "#166534" },
  "Educação":         { bg: "#dbeafe", color: "#1e40af" },
};

export function getOrganization(id: EntityId, source: Organization[] = organizations) {
  const organization = source.find(item => String(item.id) === String(id));
  if (!organization) {
    throw new Error(`Organization ${id} was not found.`);
  }
  return organization;
}

export function getProject(id: EntityId, source: Project[] = projects) {
  const project = source.find(item => String(item.id) === String(id));
  if (!project) {
    throw new Error(`Project ${id} was not found.`);
  }
  return project;
}
