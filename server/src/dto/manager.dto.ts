import { z } from "zod";

export const createManagerSchema = z.object({
  cognitoId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
});

export const updateManagerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
});

export type CreateManagerDto = z.infer<typeof createManagerSchema>;
export type UpdateManagerDto = z.infer<typeof updateManagerSchema>;
