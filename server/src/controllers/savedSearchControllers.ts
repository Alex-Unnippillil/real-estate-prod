import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listSavedSearches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tenantCognitoId = req.user?.id as string;
    const searches = await prisma.savedSearch.findMany({
      where: { tenantCognitoId },
    });
    res.json(searches);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error retrieving saved searches: ${err.message}` });
  }
};

export const createSavedSearch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tenantCognitoId = req.user?.id as string;
    const { name, filterCriteria } = req.body;
    const savedSearch = await prisma.savedSearch.create({
      data: {
        name,
        filterCriteria,
        tenantCognitoId,
      },
    });
    res.status(201).json(savedSearch);
  } catch (err: any) {
    if (err.code === "P2002") {
      res
        .status(409)
        .json({ message: "Saved search name must be unique per user" });
    } else {
      res
        .status(500)
        .json({ message: `Error creating saved search: ${err.message}` });
    }
  }
};

export const updateSavedSearch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tenantCognitoId = req.user?.id as string;
    const { id } = req.params;
    const { name, filterCriteria } = req.body;

    const existing = await prisma.savedSearch.findFirst({
      where: { id: Number(id), tenantCognitoId },
    });

    if (!existing) {
      res.status(404).json({ message: "Saved search not found" });
      return;
    }

    const updated = await prisma.savedSearch.update({
      where: { id: Number(id) },
      data: { name, filterCriteria },
    });

    res.json(updated);
  } catch (err: any) {
    if (err.code === "P2002") {
      res
        .status(409)
        .json({ message: "Saved search name must be unique per user" });
    } else {
      res
        .status(500)
        .json({ message: `Error updating saved search: ${err.message}` });
    }
  }
};

export const deleteSavedSearch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tenantCognitoId = req.user?.id as string;
    const { id } = req.params;

    const existing = await prisma.savedSearch.findFirst({
      where: { id: Number(id), tenantCognitoId },
    });

    if (!existing) {
      res.status(404).json({ message: "Saved search not found" });
      return;
    }

    await prisma.savedSearch.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error deleting saved search: ${err.message}` });
  }
};

