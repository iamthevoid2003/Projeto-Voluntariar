import { getSupabaseClient } from "../config/supabase";
import type { Database } from "../types/database";
import type { Organization } from "../types/models";

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

export async function listOrganizationMembers(): Promise<Database["public"]["Tables"]["organization_members"]["Row"][]> {
  const { data, error } = await getSupabaseClient()
    .from("organization_members")
    .select("*");

  if (error) {
    throw new Error(`Could not load organization memberships: ${error.message}`);
  }

  return data;
}

export async function joinOrganization(organizationId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Could not verify the current user: ${userError.message}`);
  }
  if (!user) {
    throw new Error("Sign in is required to join an organization.");
  }

  const { error } = await supabase.from("organization_members").insert({
    user_id: user.id,
    organization_id: organizationId,
    is_admin: false,
  });

  if (error) {
    throw new Error(`Could not join the organization: ${error.message}`);
  }
}

export function organizationFromRecord(record: OrganizationRecord, memberCount?: number): Organization {
  return {
    id: record.id,
    cnpj: record.cnpj ?? "Não informado",
    name: record.name,
    city: record.city,
    cause: record.cause,
    description: record.description,
    website: record.website ?? undefined,
    icon: record.icon ?? "🤝",
    image: record.image ?? undefined,
    memberCount,
  };
}
