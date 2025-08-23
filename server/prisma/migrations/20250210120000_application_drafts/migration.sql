-- AlterTable
ALTER TABLE "Application" ADD COLUMN "documentUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "ApplicationDraft" (
  "id" SERIAL PRIMARY KEY,
  "propertyId" INTEGER NOT NULL,
  "tenantCognitoId" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "currentStep" INTEGER NOT NULL,
  "documentUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
