import { Request, Response } from 'express';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import axios from 'axios';
import { PropertyRepository } from '../repositories/propertyRepository';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

export const createPropertyController = (
  propertyRepository: PropertyRepository
) => {
  const getProperties = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const properties = await propertyRepository.getProperties(req.query);
      res.json(properties);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error retrieving properties: ${error.message}` });
    }
  };

  const getProperty = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const property = await propertyRepository.getPropertyById(
        Number(req.params.id)
      );
      if (property) {
        res.json(property);
      } else {
        res.status(404).json({ message: 'Property not found' });
      }
    } catch (err: any) {
      res
        .status(500)
        .json({ message: `Error retrieving property: ${err.message}` });
    }
  };

  const createProperty = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      const {
        address,
        city,
        state,
        country,
        postalCode,
        managerCognitoId,
        ...propertyData
      } = req.body;

      const photoUrls = await Promise.all(
        files.map(async (file) => {
          const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `properties/${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
          };

          const uploadResult = await new Upload({
            client: s3Client,
            params: uploadParams,
          }).done();

          return uploadResult.Location as string;
        })
      );

      const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
        {
          street: address,
          city,
          country,
          postalcode: postalCode,
          format: 'json',
          limit: '1',
        }
      ).toString()}`;
      const geocodingResponse = await axios.get(geocodingUrl, {
        headers: {
          'User-Agent': 'RealEstateApp (justsomedummyemail@gmail.com',
        },
      });
      const [longitude, latitude] =
        geocodingResponse.data[0]?.lon && geocodingResponse.data[0]?.lat
          ? [
              parseFloat(geocodingResponse.data[0]?.lon),
              parseFloat(geocodingResponse.data[0]?.lat),
            ]
          : [0, 0];

      const newProperty = await propertyRepository.createProperty({
        address,
        city,
        state,
        country,
        postalCode,
        longitude,
        latitude,
        managerCognitoId,
        photoUrls,
        amenities:
          typeof propertyData.amenities === 'string'
            ? propertyData.amenities.split(',')
            : [],
        highlights:
          typeof propertyData.highlights === 'string'
            ? propertyData.highlights.split(',')
            : [],
        isPetsAllowed: propertyData.isPetsAllowed === 'true',
        isParkingIncluded: propertyData.isParkingIncluded === 'true',
        pricePerMonth: parseFloat(propertyData.pricePerMonth),
        securityDeposit: parseFloat(propertyData.securityDeposit),
        applicationFee: parseFloat(propertyData.applicationFee),
        beds: parseInt(propertyData.beds),
        baths: parseFloat(propertyData.baths),
        squareFeet: parseInt(propertyData.squareFeet),
        propertyType: propertyData.propertyType,
      });

      res.status(201).json(newProperty);
    } catch (err: any) {
      res
        .status(500)
        .json({ message: `Error creating property: ${err.message}` });
    }
  };

  return { getProperties, getProperty, createProperty };
};
