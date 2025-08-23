import { PrismaClient, Prisma, Location } from '@prisma/client';
import { wktToGeoJSON } from '@terraformer/wkt';

export class PropertyRepository {
  constructor(private prisma: PrismaClient) {}

  async getProperties(query: any) {
    const {
      favoriteIds,
      priceMin,
      priceMax,
      beds,
      baths,
      propertyType,
      squareFeetMin,
      squareFeetMax,
      amenities,
      availableFrom,
      latitude,
      longitude,
    } = query;

    let whereConditions: Prisma.Sql[] = [];

    if (favoriteIds) {
      const favoriteIdsArray = (favoriteIds as string).split(',').map(Number);
      whereConditions.push(Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArray)})`);
    }

    if (priceMin) {
      whereConditions.push(Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`);
    }

    if (priceMax) {
      whereConditions.push(Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`);
    }

    if (beds && beds !== 'any') {
      whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`);
    }

    if (baths && baths !== 'any') {
      whereConditions.push(Prisma.sql`p.baths >= ${Number(baths)}`);
    }

    if (squareFeetMin) {
      whereConditions.push(Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`);
    }

    if (squareFeetMax) {
      whereConditions.push(Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`);
    }

    if (propertyType && propertyType !== 'any') {
      whereConditions.push(
        Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`
      );
    }

    if (amenities && amenities !== 'any') {
      const amenitiesArray = (amenities as string).split(',');
      whereConditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`);
    }

    if (availableFrom && availableFrom !== 'any') {
      const availableFromDate = typeof availableFrom === 'string' ? availableFrom : null;
      if (availableFromDate) {
        const date = new Date(availableFromDate);
        if (!isNaN(date.getTime())) {
          whereConditions.push(
            Prisma.sql`EXISTS (SELECT 1 FROM "Lease" l WHERE l."propertyId" = p.id AND l."startDate" <= ${date.toISOString()})`
          );
        }
      }
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const radiusInKilometers = 1000;
      const degrees = radiusInKilometers / 111;

      whereConditions.push(
        Prisma.sql`ST_DWithin(l.coordinates::geometry, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326), ${degrees})`
      );
    }

    const completeQuery = Prisma.sql`
      SELECT p.*, json_build_object(
        'id', l.id,
        'address', l.address,
        'city', l.city,
        'state', l.state,
        'country', l.country,
        'postalCode', l."postalCode",
        'coordinates', json_build_object(
          'longitude', ST_X(l."coordinates"::geometry),
          'latitude', ST_Y(l."coordinates"::geometry)
        )
      ) as location
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      ${whereConditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(whereConditions, ' AND ')}` : Prisma.empty}
    `;

    return this.prisma.$queryRaw(completeQuery);
  }

  async getPropertyById(id: number) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: { location: true },
    });

    if (!property) return null;

    const coordinates: { coordinates: string }[] = await this.prisma.$queryRaw`
      SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

    const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || '');
    const longitude = geoJSON.coordinates[0];
    const latitude = geoJSON.coordinates[1];

    return {
      ...property,
      location: {
        ...property.location,
        coordinates: { longitude, latitude },
      },
    };
  }

  async createProperty(data: any) {
    const {
      address,
      city,
      state,
      country,
      postalCode,
      longitude,
      latitude,
      managerCognitoId,
      photoUrls,
      amenities,
      highlights,
      isPetsAllowed,
      isParkingIncluded,
      pricePerMonth,
      securityDeposit,
      applicationFee,
      beds,
      baths,
      squareFeet,
      propertyType,
      ...rest
    } = data;

    const [location] = await this.prisma.$queryRaw<Location[]>`
      INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
      VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
      RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
    `;

    return this.prisma.property.create({
      data: {
        propertyType: propertyType as any,
        photoUrls,
        locationId: location.id,
        managerCognitoId,
        amenities: amenities as any,
        highlights: highlights as any,
        isPetsAllowed,
        isParkingIncluded,
        pricePerMonth,
        securityDeposit,
        applicationFee,
        beds,
        baths,
        squareFeet,
        ...rest,
      },
      include: {
        location: true,
        manager: true,
      },
    });
  }
}
