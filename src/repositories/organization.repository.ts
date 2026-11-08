import { getSupabaseClient } from "../config/supabase";
import type { Database } from "../types/database";

export type OrganizationRecord = Database["public"]["Tables"]["organizations"]["Row"];

export async function listOrganizations(): Promise<OrganizationRecord[]> {
  const { data, error } = await getSupabaseClient()
    .from("organizations")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(`Could not load organizations: ${error.message}`);
  }

  return data;
}
