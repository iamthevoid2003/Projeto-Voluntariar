import { getSupabaseClient } from "../config/supabase";
import type { Database } from "../types/database";
import type { Project } from "../types/models";

export type ProjectRecord = Database["public"]["Tables"]["projects"]["Row"];
export type NewProject = Pick<Project, "title" | "description" | "cause" | "city" | "slots" | "schedule">;

export async function listActiveProjects(): Promise<ProjectRecord[]> {
  const { data, error } = await getSupabaseClient()
    .from("projects")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load projects: ${error.message}`);
  }

  return data;
}

export async function createProject(organizationId: string, project: NewProject): Promise<Project> {
  const { data, error } = await getSupabaseClient()
    .from("projects")
    .insert({
      organization_id: organizationId,
      title: project.title,
      description: project.description,
      cause: project.cause,
      city: project.city,
      slots: project.slots,
      schedule: project.schedule,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Could not create project: ${error.message}`);
  }

  return projectFromRecord(data);
}

export function projectFromRecord(record: ProjectRecord): Project {
  return {
    id: record.id,
    organizationId: record.organization_id,
    title: record.title,
    description: record.description,
    cause: record.cause,
    city: record.city,
    slots: record.slots,
    schedule: record.schedule,
  };
}
