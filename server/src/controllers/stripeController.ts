import { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaClient, PaymentStatus } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});
const prisma = new PrismaClient();

export const handleStripeWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const signature = req.headers["stripe-signature"] as string | undefined;
  if (!signature) {
    res.status(400).send("Missing stripe-signature header");
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Prevent duplicate processing
  const alreadyProcessed = await prisma.stripeEvent.findUnique({
    where: { id: event.id },
  });
  if (alreadyProcessed) {
    res.json({ received: true });
    return;
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const paymentId = paymentIntent.metadata?.paymentId;
        if (paymentId) {
          await prisma.payment.update({
            where: { id: Number(paymentId) },
            data: {
              paymentStatus: PaymentStatus.Paid,
              amountPaid: paymentIntent.amount_received / 100,
              paymentDate: new Date(),
            },
          });
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const paymentId = paymentIntent.metadata?.paymentId;
        if (paymentId) {
          await prisma.payment.update({
            where: { id: Number(paymentId) },
            data: {
              paymentStatus: PaymentStatus.Overdue,
            },
          });
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    await prisma.stripeEvent.create({ data: { id: event.id } });
    res.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler failed", error);
    res.status(500).send("Webhook handler failed");
  }
};
