import { z } from "zod";

export const createTenantSchema = z.object({
  cognitoId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
});

export const updateTenantSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
});

export type CreateTenantDto = z.infer<typeof createTenantSchema>;
export type UpdateTenantDto = z.infer<typeof updateTenantSchema>;
