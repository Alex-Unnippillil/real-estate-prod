import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middleware/authMiddleware";
import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
/* ROUTE IMPORT */
import tenantRoutes from "./routes/tenantRoutes";
import managerRoutes from "./routes/managerRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import leaseRoutes from "./routes/leaseRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

app.use("/applications", applicationRoutes);
app.use("/properties", propertyRoutes);
app.use("/leases", leaseRoutes);
app.use("/tenants", authMiddleware(["tenant"]), tenantRoutes);
app.use("/managers", authMiddleware(["manager"]), managerRoutes);
app.use("/invoices", invoiceRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 3002;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

/* CRON JOB FOR RECURRING INVOICES */
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

cron.schedule("0 0 1 * *", async () => {
  const leases = await prisma.lease.findMany({ include: { tenant: true } });
  const today = new Date();
  const dueDate = new Date(today.getFullYear(), today.getMonth(), 1);

  for (const lease of leases) {
    const existing = await prisma.invoice.findFirst({
      where: { leaseId: lease.id, dueDate },
    });

    if (!existing) {
      const invoice = await prisma.invoice.create({
        data: {
          leaseId: lease.id,
          amountDue: lease.rent,
          amountPaid: 0,
          dueDate,
          status: "Pending",
        },
      });

      if (lease.tenant.stripeCustomerId) {
        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(lease.rent * 100),
            currency: "usd",
            customer: lease.tenant.stripeCustomerId,
            automatic_payment_methods: { enabled: true },
          });

          await prisma.invoice.update({
            where: { id: invoice.id },
            data: {
              status: "Paid",
              amountPaid: lease.rent,
              paymentDate: new Date(),
              stripePaymentIntentId: paymentIntent.id,
            },
          });
        } catch (err) {
          console.error("Stripe billing failed", err);
        }
      }
    }
  }
});
