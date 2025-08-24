import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import {
  templates,
  TemplateName,
  TemplateData,
} from "../emails";

const ses = new SESClient({ region: process.env.AWS_REGION });

export async function sendEmail<T extends TemplateName>(
  template: T,
  data: TemplateData<T> & { to: string }
): Promise<void> {
  const { to, ...templateData } = data as { to: string } & TemplateData<T>;
  const { subject, html } = templates[template](
    templateData as TemplateData<T>
  );

  const command = new SendEmailCommand({
    Source: process.env.SES_SOURCE_EMAIL as string,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: html } },
    },
  });

  await ses.send(command);
}

