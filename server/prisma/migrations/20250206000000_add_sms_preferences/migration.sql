ALTER TABLE "Manager" ADD COLUMN "smsOptIn" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Tenant" ADD COLUMN "smsOptIn" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "SmsLog" (
    "id" SERIAL PRIMARY KEY,
    "cognitoId" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "messageId" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
