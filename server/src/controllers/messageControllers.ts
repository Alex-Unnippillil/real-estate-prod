import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getConversations = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
    });

    const conversations: Record<string, any> = {};

    messages.forEach((msg) => {
      const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversations[otherId]) {
        conversations[otherId] = {
          userId: otherId,
          lastMessage: msg,
          unreadCount: 0,
        };
      }
      if (!msg.read && msg.receiverId === userId) {
        conversations[otherId].unreadCount++;
      }
    });

    res.json(Object.values(conversations));
  } catch (err: any) {
    res.status(500).json({ message: `Error retrieving conversations: ${err.message}` });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, otherUserId } = req.params;
  try {
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        read: false,
      },
      data: { read: true },
    });

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ message: `Error retrieving messages: ${err.message}` });
  }
};

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { senderId, receiverId, content } = req.body;
  try {
    const message = await prisma.message.create({
      data: { senderId, receiverId, content },
    });
    res.status(201).json(message);
  } catch (err: any) {
    res.status(500).json({ message: `Error sending message: ${err.message}` });
  }
};
