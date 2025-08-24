import { PrismaClient, Amenity, Highlight, PropertyType, ApplicationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in reverse order of dependencies
  await prisma.payment.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.application.deleteMany();
  await prisma.property.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.manager.deleteMany();
  await prisma.$executeRaw`DELETE FROM "Location";`;

  // Managers (user role: manager)
  const managerAlice = await prisma.manager.create({
    data: {
      cognitoId: "manager1",
      name: "Alice Manager",
      email: "alice.manager@example.com",
      phoneNumber: "555-1111",
    },
  });

  const managerBob = await prisma.manager.create({
    data: {
      cognitoId: "manager2",
      name: "Bob Manager",
      email: "bob.manager@example.com",
      phoneNumber: "555-2222",
    },
  });

  // Tenants (user role: tenant)
  const tenantTom = await prisma.tenant.create({
    data: {
      cognitoId: "tenant1",
      name: "Tom Tenant",
      email: "tom.tenant@example.com",
      phoneNumber: "555-3333",
    },
  });

  const tenantLisa = await prisma.tenant.create({
    data: {
      cognitoId: "tenant2",
      name: "Lisa Tenant",
      email: "lisa.tenant@example.com",
      phoneNumber: "555-4444",
    },
  });

  // Locations with geolocation (longitude latitude)
  await prisma.$executeRaw`
    INSERT INTO "Location" ("id","address","city","state","country","postalCode","coordinates") VALUES
    (1,'123 Main St','New York','NY','USA','10001', ST_GeomFromText('POINT(-74.00597 40.7128)',4326)),
    (2,'456 Market St','San Francisco','CA','USA','94105', ST_GeomFromText('POINT(-122.4014 37.7936)',4326));
  `;

  // Properties referencing locations and managers
  const property1 = await prisma.property.create({
    data: {
      name: "Downtown Loft",
      description: "Modern loft in the heart of the city",
      pricePerMonth: 2500,
      securityDeposit: 1000,
      applicationFee: 50,
      photoUrls: ["https://example.com/loft.jpg"],
      amenities: [Amenity.WasherDryer, Amenity.AirConditioning],
      highlights: [Highlight.HighSpeedInternetAccess, Highlight.GreatView],
      isPetsAllowed: true,
      isParkingIncluded: false,
      beds: 1,
      baths: 1,
      squareFeet: 750,
      propertyType: PropertyType.Apartment,
      locationId: 1,
      managerCognitoId: managerAlice.cognitoId,
    },
  });

  const property2 = await prisma.property.create({
    data: {
      name: "Bay View House",
      description: "Beautiful house with bay views",
      pricePerMonth: 4000,
      securityDeposit: 1500,
      applicationFee: 75,
      photoUrls: ["https://example.com/house.jpg"],
      amenities: [Amenity.Parking, Amenity.WiFi],
      highlights: [Highlight.GreatView, Highlight.QuietNeighborhood],
      isPetsAllowed: false,
      isParkingIncluded: true,
      beds: 3,
      baths: 2,
      squareFeet: 1800,
      propertyType: PropertyType.Villa,
      locationId: 2,
      managerCognitoId: managerBob.cognitoId,
    },
  });

  // Applications linking tenants to properties
  await prisma.application.create({
    data: {
      applicationDate: new Date(),
      status: ApplicationStatus.Pending,
      propertyId: property1.id,
      tenantCognitoId: tenantTom.cognitoId,
      name: tenantTom.name,
      email: tenantTom.email,
      phoneNumber: tenantTom.phoneNumber,
      message: "Looking forward to renting this loft!",
    },
  });

  await prisma.application.create({
    data: {
      applicationDate: new Date(),
      status: ApplicationStatus.Pending,
      propertyId: property2.id,
      tenantCognitoId: tenantLisa.cognitoId,
      name: tenantLisa.name,
      email: tenantLisa.email,
      phoneNumber: tenantLisa.phoneNumber,
      message: "Is the bay view pet friendly?",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
