import { Request, Response } from "express";
import { sendSMS } from "../services/smsService";

export const sendSms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId, userType, message } = req.body;
    const result = await sendSMS({ cognitoId, userType, message });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: `Failed to send SMS: ${err.message}` });
  }
};
