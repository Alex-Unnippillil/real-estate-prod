import nodemailer from "nodemailer";
import { Twilio } from "twilio";

// Simple mail transport that prints the message to the console.
const transporter = nodemailer.createTransport({
  jsonTransport: true,
});

const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? new Twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      )
    : null;

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<void> => {
  await transporter.sendMail({
    from: process.env.ALERT_FROM_EMAIL || "no-reply@example.com",
    to,
    subject,
    text,
  });
  console.log(`Email sent to ${to}: ${subject}`);
};

export const sendSMS = async (to: string, body: string): Promise<void> => {
  if (!twilioClient) {
    console.log(`SMS to ${to}: ${body}`);
    return;
  }
  await twilioClient.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER || "", // placeholder
    to,
    body,
  });
};

export const sendInApp = async (
  tenantId: string,
  message: string
): Promise<void> => {
  // Placeholder for real in-app notifications
  console.log(`In-app notification to ${tenantId}: ${message}`);
};
