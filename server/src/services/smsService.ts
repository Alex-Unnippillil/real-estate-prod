import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const snsClient = new SNSClient({ region: process.env.AWS_REGION });

interface SendSMSParams {
  cognitoId: string;
  userType: "tenant" | "manager";
  message: string;
}

export async function sendSMS({ cognitoId, userType, message }: SendSMSParams) {
  const user =
    userType === "tenant"
      ? await prisma.tenant.findUnique({ where: { cognitoId } })
      : await prisma.manager.findUnique({ where: { cognitoId } });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.smsOptIn) {
    await prisma.smsLog.create({
      data: {
        cognitoId,
        userType,
        message,
        status: "opt-out",
      },
    });
    return { status: "opt-out" };
  }

  try {
    const result = await snsClient.send(
      new PublishCommand({ Message: message, PhoneNumber: user.phoneNumber })
    );

    await prisma.smsLog.create({
      data: {
        cognitoId,
        userType,
        message,
        status: "sent",
        messageId: result.MessageId,
      },
    });

    return { status: "sent", messageId: result.MessageId };
  } catch (err: any) {
    await prisma.smsLog.create({
      data: {
        cognitoId,
        userType,
        message,
        status: "error",
        error: err.message,
      },
    });
    throw err;
  }
}
