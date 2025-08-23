import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getLeases = async (req: Request, res: Response): Promise<void> => {
  try {
    const leases = await prisma.lease.findMany({
      include: {
        tenant: true,
        property: true,
      },
    });
    res.json(leases);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving leases: ${error.message}` });
  }
};

export const getLeaseInvoices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const invoices = await prisma.invoice.findMany({
      where: { leaseId: Number(id) },
    });
    res.json(invoices);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving lease invoices: ${error.message}` });
  }
};
