import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "../config/supabase";
import { organizationFromRecord } from "../repositories/organization.repository";
import type { Organization, VolunteerProfile } from "../types/models";

export type AccountType = "voluntario" | "ong";

export interface RegistrationDetails {
  email: string;
  password: string;
  fullName: string;
  username: string;
  cpf?: string;
  city?: string;
  accountType: AccountType;
  organization?: {
    name: string;
    cnpj: string;
    city: string;
    cause: string;
    description: string;
    website: string;
  };
}

function metadataString(user: User, key: string): string {
  const value = user.user_metadata[key];
  return typeof value === "string" ? value : "";
}

export async function registerAccount(details: RegistrationDetails): Promise<boolean> {
  const { data, error } = await getSupabaseClient().auth.signUp({
    email: details.email,
    password: details.password,
    options: {
      data: {
        account_type: details.accountType,
        full_name: details.fullName,
        username: details.username,
        cpf: details.cpf || null,
        city: details.city || null,
        organization: details.organization ?? null,
      },
    },
  });

  if (error) {
    throw new Error(`Não foi possível criar a conta: ${error.message}`);
  }

  if (data.session && data.user) {
    await ensureProfile(data.user);
    if (details.accountType === "ong" && details.organization) {
      await ensureOrganization(data.user, details.organization);
    }
    return true;
  }

  return false;
}

export async function signIn(email: string, password: string, expectedType: AccountType): Promise<{
  profile: VolunteerProfile;
  organization: Organization | null;
}> {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(`Não foi possível entrar: ${error.message}`);
  }

  const accountType = metadataString(data.user, "account_type");
  if (accountType && accountType !== expectedType) {
    await getSupabaseClient().auth.signOut();
    throw new Error(expectedType === "ong"
      ? "Esta conta não está cadastrada como ONG."
      : "Esta conta não está cadastrada como voluntário.");
  }

  const profile = await ensureProfile(data.user);
  const organization = expectedType === "ong" ? await ensureOrganizationFromMetadata(data.user) : null;
  return { profile, organization };
}

export async function restoreSession(): Promise<{
  profile: VolunteerProfile;
  accountType: AccountType;
  organization: Organization | null;
} | null> {
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) {
    throw new Error(`Não foi possível restaurar a sessão: ${error.message}`);
  }
  if (!data.session) return null;

  const user = data.session.user;
  const accountType = metadataString(user, "account_type") === "ong" ? "ong" : "voluntario";
  const profile = await ensureProfile(user);
  const organization = accountType === "ong" ? await ensureOrganizationFromMetadata(user) : null;
  return { profile, accountType, organization };
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) {
    throw new Error(`Não foi possível sair da conta: ${error.message}`);
  }
}

export async function loadMyApplications() {
  const { data: userData, error: userError } = await getSupabaseClient().auth.getUser();
  if (userError) throw new Error(`Não foi possível verificar a sessão: ${userError.message}`);
  if (!userData.user) return [];

  const { data, error } = await getSupabaseClient()
    .from("volunteer_applications")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("applied_at", { ascending: false });
  if (error) throw new Error(`Não foi possível carregar candidaturas: ${error.message}`);

  return data.map(record => ({
    id: record.id,
    userId: record.user_id,
    projectId: record.project_id,
    status: record.status,
    appliedAt: record.applied_at,
    message: record.message,
  }));
}

export async function loadOrganizationApplications() {
  const { data, error } = await getSupabaseClient()
    .from("volunteer_applications")
    .select("*")
    .order("applied_at", { ascending: false });
  if (error) throw new Error(`Não foi possível carregar candidaturas recebidas: ${error.message}`);

  return data.map(record => ({
    id: record.id,
    userId: record.user_id,
    projectId: record.project_id,
    status: record.status,
    appliedAt: record.applied_at,
    message: record.message,
  }));
}

async function ensureProfile(user: User): Promise<VolunteerProfile> {
  const supabase = getSupabaseClient();
  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) {
    throw new Error(`Não foi possível carregar o perfil: ${selectError.message}`);
  }

  let record = existing;
  if (!record) {
    const fullName = metadataString(user, "full_name") || user.email || "Usuário";
    const username = metadataString(user, "username") || (user.email?.split("@")[0] ?? "usuario");
    const uniqueUsername = `${username.replace(/[^A-Za-z0-9_.-]/g, "_").slice(0, 22)}_${user.id.slice(0, 7)}`;
    const { data, error } = await supabase.from("profiles").insert({
      id: user.id,
      full_name: fullName,
      username: uniqueUsername.length >= 3 ? uniqueUsername : `user_${user.id.slice(0, 8)}`,
      cpf: metadataString(user, "cpf").replace(/\D/g, "") || null,
      city: metadataString(user, "city") || null,
    }).select().single();

    if (error) {
      throw new Error(`Não foi possível criar o perfil: ${error.message}`);
    }
    record = data;
  }

  return {
    id: record.id,
    name: record.full_name,
    email: user.email ?? "",
    cpf: record.cpf ?? "",
    username: record.username,
    city: record.city ?? "",
    bio: record.bio ?? "",
  };
}

async function ensureOrganizationFromMetadata(user: User): Promise<Organization> {
  const value = user.user_metadata.organization;
  const details = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const organization = {
    name: typeof details.name === "string" ? details.name : "",
    cnpj: typeof details.cnpj === "string" ? details.cnpj.replace(/\D/g, "") : "",
    city: typeof details.city === "string" ? details.city : "",
    cause: typeof details.cause === "string" ? details.cause : "",
    description: typeof details.description === "string" ? details.description : "",
    website: typeof details.website === "string" ? details.website : "",
  };
  if (!organization.name) {
    throw new Error("Os dados da ONG não foram encontrados. Cadastre a organização novamente.");
  }
  return ensureOrganization(user, organization);
}

async function ensureOrganization(
  user: User,
  details: NonNullable<RegistrationDetails["organization"]>,
): Promise<Organization> {
  const supabase = getSupabaseClient();
  const { data: existing, error: selectError } = await supabase
    .from("organizations")
    .select("*")
    .eq("created_by", user.id)
    .maybeSingle();
  if (selectError) {
    throw new Error(`Não foi possível carregar a organização: ${selectError.message}`);
  }
  if (existing) {
    const { data: membership, error: membershipError } = await supabase
      .from("organization_members")
      .select("id")
      .eq("user_id", user.id)
      .eq("organization_id", existing.id)
      .maybeSingle();
    if (membershipError) {
      throw new Error(`Não foi possível verificar o acesso administrativo: ${membershipError.message}`);
    }
    if (!membership) {
      const { error: memberError } = await supabase.from("organization_members").insert({
        user_id: user.id,
        organization_id: existing.id,
        is_admin: true,
      });
      if (memberError) {
      throw new Error(`Não foi possível configurar seu acesso administrativo: ${memberError.message}`);
      }
    }
    return organizationFromRecord(existing);
  }

  const { data: organization, error } = await supabase.from("organizations").insert({
    created_by: user.id,
    cnpj: details.cnpj.replace(/\D/g, "") || null,
    name: details.name,
    city: details.city,
    cause: details.cause,
    description: details.description,
    website: details.website || null,
  }).select().single();
  if (error) {
    throw new Error(`Não foi possível cadastrar a organização: ${error.message}`);
  }

  const { error: memberError } = await supabase.from("organization_members").insert({
    user_id: user.id,
    organization_id: organization.id,
    is_admin: true,
  });
  if (memberError) {
    throw new Error(`ONG criada, mas não foi possível configurar seu acesso administrativo: ${memberError.message}`);
  }

  return organizationFromRecord(organization);
}
