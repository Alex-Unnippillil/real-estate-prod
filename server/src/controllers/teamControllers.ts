import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeamMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const members = await prisma.teamMember.findMany({
      where: { managerCognitoId: cognitoId },
    });
    res.json(members);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving team members: ${error.message}` });
  }
};

export const inviteTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { email, role } = req.body;
    const member = await prisma.teamMember.create({
      data: {
        managerCognitoId: cognitoId,
        email,
        role,
      },
    });

    // Placeholder for sending invite email
    console.log(`Invite sent to ${email} for team ${cognitoId}`);

    res.status(201).json(member);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error inviting team member: ${error.message}` });
  }
};

export const updateTeamMemberRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { memberId } = req.params;
    const { role } = req.body;
    const updated = await prisma.teamMember.update({
      where: { id: Number(memberId) },
      data: { role },
    });
    res.json(updated);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating team member role: ${error.message}` });
  }
};

export const removeTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { memberId } = req.params;
    await prisma.teamMember.delete({ where: { id: Number(memberId) } });
    res.status(204).send();
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error removing team member: ${error.message}` });
  }
};

