import { PropertyRepository } from '../propertyRepository';
import { PrismaClient } from '@prisma/client';

describe('PropertyRepository', () => {
  let prisma: any;
  let repository: PropertyRepository;

  beforeEach(() => {
    prisma = {
      property: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      $queryRaw: jest.fn(),
    } as unknown as PrismaClient;
    repository = new PropertyRepository(prisma as PrismaClient);
  });

  it('getPropertyById returns property with coordinates', async () => {
    const property = { id: 1, location: { id: 2 } } as any;
    const coordinatesResult = [{ coordinates: 'POINT(10 20)' }];
    (prisma.property.findUnique as jest.Mock).mockResolvedValue(property);
    (prisma.$queryRaw as jest.Mock).mockResolvedValue(coordinatesResult);

    const result = await repository.getPropertyById(1);

    expect(prisma.property.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { location: true },
    });
    expect(prisma.$queryRaw).toHaveBeenCalled();
    expect(result?.location.coordinates).toEqual({
      longitude: 10,
      latitude: 20,
    });
  });

  it('createProperty creates location and property', async () => {
    const data = {
      address: 'a',
      city: 'c',
      state: 's',
      country: 'co',
      postalCode: 'p',
      longitude: 1,
      latitude: 2,
      managerCognitoId: 'm',
      photoUrls: [],
      amenities: [],
      highlights: [],
      isPetsAllowed: true,
      isParkingIncluded: false,
      pricePerMonth: 1,
      securityDeposit: 2,
      applicationFee: 3,
      beds: 1,
      baths: 1,
      squareFeet: 1,
      propertyType: 'House',
    };
    (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ id: 5 }]);
    const created = { id: 10 };
    (prisma.property.create as jest.Mock).mockResolvedValue(created);

    const result = await repository.createProperty(data as any);

    expect(prisma.$queryRaw).toHaveBeenCalled();
    expect(prisma.property.create).toHaveBeenCalled();
    expect(result).toBe(created);
  });
});
