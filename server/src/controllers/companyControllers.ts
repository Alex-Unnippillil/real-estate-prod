import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, address, preferences, managerCognitoId } = req.body;
    const company = await prisma.company.create({
      data: {
        name,
        address,
        preferences,
        manager: { connect: { cognitoId: managerCognitoId } },
      },
    });
    res.status(201).json(company);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating company: ${error.message}` });
  }
};
