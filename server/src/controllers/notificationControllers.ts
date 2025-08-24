import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const notifications = await prisma.notification.findMany({
      where: { recipientId: cognitoId },
      orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving notifications: ${error.message}` });
  }
};

export const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipientId, message } = req.body;
    const notification = await prisma.notification.create({
      data: { recipientId, message },
    });
    res.status(201).json(notification);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating notification: ${error.message}` });
  }
};

export const updateNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { message, isRead } = req.body;
    const notification = await prisma.notification.update({
      where: { id: Number(id) },
      data: { message, isRead },
    });
    res.json(notification);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating notification: ${error.message}` });
  }
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.notification.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting notification: ${error.message}` });
  }
};

export const markNotificationsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    await prisma.notification.updateMany({
      where: { recipientId: cognitoId, isRead: false },
      data: { isRead: true },
    });
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error: any) {
    res.status(500).json({ message: `Error marking notifications as read: ${error.message}` });
  }
};
