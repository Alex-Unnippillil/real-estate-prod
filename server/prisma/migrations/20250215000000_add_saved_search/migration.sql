-- CreateTable
CREATE TABLE "SavedSearch" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "filterCriteria" JSONB NOT NULL,
  "tenantCognitoId" TEXT NOT NULL,
  CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedSearch_tenantCognitoId_name_key" ON "SavedSearch"("tenantCognitoId", "name");

-- AddForeignKey
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_tenantCognitoId_fkey" FOREIGN KEY ("tenantCognitoId") REFERENCES "Tenant"("cognitoId") ON DELETE RESTRICT ON UPDATE CASCADE;
