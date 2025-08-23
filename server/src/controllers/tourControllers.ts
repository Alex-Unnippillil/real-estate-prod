import { Request, Response } from "express";
import { PrismaClient, TourStatus } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

function formatDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function generateICS(tour: any): string {
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//RealEstateApp//EN\nBEGIN:VEVENT\nUID:${tour.id}@realestateapp\nDTSTAMP:${formatDate(new Date())}\nDTSTART:${formatDate(tour.start)}\nDTEND:${formatDate(tour.end)}\nSUMMARY:Property Tour\nDESCRIPTION:Tour for property ${tour.propertyId}\nEND:VEVENT\nEND:VCALENDAR`;
}

async function sendConfirmationEmail(tour: any) {
  if (!process.env.SMTP_HOST) return;
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const icsContent = generateICS(tour);

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "no-reply@realestateapp.com",
      to: tour.email,
      subject: `Tour Confirmation for property ${tour.propertyId}`,
      text: `Your tour is scheduled from ${tour.start.toISOString()} to ${tour.end.toISOString()}`,
      icalEvent: {
        filename: "tour.ics",
        method: "REQUEST",
        content: icsContent,
      },
    });
  } catch (err) {
    console.error("Error sending confirmation email", err);
  }
}

export const scheduleTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId, name, email, phoneNumber, start, end } = req.body;
    const startDate = new Date(start);
    const endDate = new Date(end);

    const conflict = await prisma.tour.findFirst({
      where: {
        propertyId,
        status: TourStatus.Scheduled,
        start: { lt: endDate },
        end: { gt: startDate },
      },
    });

    if (conflict) {
      res.status(409).json({ message: "Time slot unavailable" });
      return;
    }

    const tour = await prisma.tour.create({
      data: {
        propertyId,
        name,
        email,
        phoneNumber,
        start: startDate,
        end: endDate,
      },
    });

    await sendConfirmationEmail(tour);

    res.status(201).json(tour);
  } catch (error: any) {
    res.status(500).json({ message: `Error scheduling tour: ${error.message}` });
  }
};

export const cancelTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tour = await prisma.tour.update({
      where: { id: Number(id) },
      data: { status: TourStatus.Cancelled },
    });
    res.json(tour);
  } catch (error: any) {
    res.status(500).json({ message: `Error cancelling tour: ${error.message}` });
  }
};

export const rescheduleTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { start, end } = req.body;
    const startDate = new Date(start);
    const endDate = new Date(end);

    const tour = await prisma.tour.findUnique({ where: { id: Number(id) } });
    if (!tour) {
      res.status(404).json({ message: "Tour not found" });
      return;
    }

    const conflict = await prisma.tour.findFirst({
      where: {
        id: { not: tour.id },
        propertyId: tour.propertyId,
        status: TourStatus.Scheduled,
        start: { lt: endDate },
        end: { gt: startDate },
      },
    });

    if (conflict) {
      res.status(409).json({ message: "Time slot unavailable" });
      return;
    }

    const updated = await prisma.tour.update({
      where: { id: tour.id },
      data: { start: startDate, end: endDate },
    });

    await sendConfirmationEmail(updated);

    res.json(updated);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error rescheduling tour: ${error.message}` });
  }
};
