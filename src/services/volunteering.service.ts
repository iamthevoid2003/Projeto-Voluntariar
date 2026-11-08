import { createApplication } from "../repositories/volunteer-application.repository";

const MAX_APPLICATION_MESSAGE_LENGTH = 2000;

export async function applyToProject(
  projectId: string,
  message: string,
): Promise<void> {
  if (!projectId.trim()) {
    throw new Error("A project must be selected before applying.");
  }

  if (message.length > MAX_APPLICATION_MESSAGE_LENGTH) {
    throw new Error(
      `The application message cannot exceed ${MAX_APPLICATION_MESSAGE_LENGTH} characters.`,
    );
  }

  await createApplication(projectId, message.trim());
}
