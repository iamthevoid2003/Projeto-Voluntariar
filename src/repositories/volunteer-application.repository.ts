import { getSupabaseClient } from "../config/supabase";
import type { Database } from "../types/database";

export type ApplicationRecord =
  Database["public"]["Tables"]["volunteer_applications"]["Row"];
export type ApplicationStatus = ApplicationRecord["status"];

export async function createApplication(
  projectId: string,
  message: string,
): Promise<ApplicationRecord> {
  const supabase = getSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Could not verify the current user: ${userError.message}`);
  }

  if (!userData.user) {
    throw new Error("Sign in is required to apply for a project.");
  }

  const { data, error } = await supabase
    .from("volunteer_applications")
    .insert({
      user_id: userData.user.id,
      project_id: projectId,
      message,
      status: "pendente",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Could not submit the application: ${error.message}`);
  }

  return data;
}

export async function listMyApplications(): Promise<ApplicationRecord[]> {
  const supabase = getSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Could not verify the current user: ${userError.message}`);
  }

  if (!userData.user) {
    throw new Error("Sign in is required to view applications.");
  }

  const { data, error } = await supabase
    .from("volunteer_applications")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("applied_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load applications: ${error.message}`);
  }

  return data;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
): Promise<ApplicationRecord> {
  const { data, error } = await getSupabaseClient()
    .from("volunteer_applications")
    .update({ status })
    .eq("id", applicationId)
    .select()
    .single();

  if (error) {
    throw new Error(`Could not update the application: ${error.message}`);
  }

  return data;
}
