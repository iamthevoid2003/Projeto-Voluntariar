import { getSupabaseClient } from "../config/supabase";
import type { Database } from "../types/database";

export type ProjectRecord = Database["public"]["Tables"]["projects"]["Row"];

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
