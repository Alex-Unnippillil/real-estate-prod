import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().min(1),
  NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID: z.string().min(1),
  NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID: z.string().min(1),
  AWS_REGION: z.string().min(1),
  S3_BUCKET_NAME: z.string().min(1),
  PORT: z.coerce.number().int().default(3002),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
