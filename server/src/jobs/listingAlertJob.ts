import cron from "node-cron";
import { PrismaClient, Property, SavedSearch } from "@prisma/client";
import { sendEmail, sendSMS, sendInApp } from "../utils/alertService";

const prisma = new PrismaClient();

const matchesSearch = (property: Property, search: SavedSearch): boolean => {
  if (search.minPrice && property.pricePerMonth < search.minPrice) {
    return false;
  }
  if (search.maxPrice && property.pricePerMonth > search.maxPrice) {
    return false;
  }
  if (search.propertyType && property.propertyType !== search.propertyType) {
    return false;
  }
  return true;
};

export const startListingAlertJob = (): void => {
  cron.schedule("*/30 * * * *", async () => {
    const since = new Date(Date.now() - 30 * 60 * 1000);
    const properties = await prisma.property.findMany({
      where: { postedDate: { gte: since } },
    });

    if (properties.length === 0) return;

    const searches = await prisma.savedSearch.findMany();

    for (const property of properties) {
      for (const search of searches) {
        if (!matchesSearch(property, search)) continue;

        const existing = await prisma.alertLog.findFirst({
          where: {
            tenantCognitoId: search.tenantCognitoId,
            propertyId: property.id,
          },
        });
        if (existing) continue;

        const tenant = await prisma.tenant.findUnique({
          where: { cognitoId: search.tenantCognitoId },
        });
        if (!tenant) continue;

        const message = `New property match: ${property.name}`;
        await sendEmail(tenant.email, "New property match", message);
        await prisma.alertLog.create({
          data: {
            tenantCognitoId: tenant.cognitoId,
            propertyId: property.id,
            method: "email",
          },
        });

        await sendSMS(tenant.phoneNumber, message);
        await prisma.alertLog.create({
          data: {
            tenantCognitoId: tenant.cognitoId,
            propertyId: property.id,
            method: "sms",
          },
        });

        await sendInApp(tenant.cognitoId, message);
        await prisma.alertLog.create({
          data: {
            tenantCognitoId: tenant.cognitoId,
            propertyId: property.id,
            method: "inApp",
          },
        });
      }
    }
  });
};
