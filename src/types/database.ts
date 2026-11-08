type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<{
        id: string;
        full_name: string;
        username: string;
        cpf: string | null;
        city: string | null;
        bio: string | null;
        created_at: string;
        updated_at: string;
      }>;
      organizations: Table<{
        id: string;
        created_by: string;
        cnpj: string | null;
        name: string;
        city: string;
        cause: string;
        description: string;
        website: string | null;
        icon: string | null;
        image: string | null;
        created_at: string;
        updated_at: string;
      }>;
      organization_members: Table<{
        id: string;
        user_id: string;
        organization_id: string;
        is_admin: boolean;
        created_at: string;
      }>;
      projects: Table<{
        id: string;
        organization_id: string;
        title: string;
        description: string;
        cause: string;
        city: string;
        slots: number;
        schedule: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
      }>;
      volunteer_applications: Table<{
        id: string;
        user_id: string;
        project_id: string;
        status: "pendente" | "aprovado" | "recusado" | "em_andamento" | "concluido";
        applied_at: string;
        message: string;
        created_at: string;
        updated_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: {
      is_organization_admin: {
        Args: { organization_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
