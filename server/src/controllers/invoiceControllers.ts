import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const listInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { lease: { tenantCognitoId: req.user?.id } },
    });
    res.json(invoices);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving invoices: ${error.message}` });
  }
};

export const payInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({
      where: { id: Number(id) },
      include: { lease: { include: { tenant: true } } },
    });

    if (!invoice) {
      res.status(404).json({ message: "Invoice not found" });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(invoice.amountDue * 100),
            product_data: { name: `Rent Invoice #${invoice.id}` },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/tenants/invoices`,
      cancel_url: `${process.env.CLIENT_URL}/tenants/invoices`,
      customer: invoice.lease.tenant.stripeCustomerId || undefined,
    });

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: "Paid",
        amountPaid: invoice.amountDue,
        paymentDate: new Date(),
        stripePaymentIntentId: session.payment_intent as string,
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ message: `Error paying invoice: ${error.message}` });
  }
};

export const listPropertyInvoices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const invoices = await prisma.invoice.findMany({
      where: { lease: { propertyId: Number(id) } },
    });
    res.json(invoices);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving invoices: ${error.message}` });
  }
};
