import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

export const createApplicationSchema = z.object({
  applicationDate: z.string().or(z.date()),
  status: z.nativeEnum(ApplicationStatus),
  propertyId: z.coerce.number(),
  tenantCognitoId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  message: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
});

export type CreateApplicationDto = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusDto = z.infer<
  typeof updateApplicationStatusSchema
>;
