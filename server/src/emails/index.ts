import { welcomeTemplate, WelcomeTemplate } from "./welcome";

export type TemplateDataMap = {
  welcome: WelcomeTemplate;
};

export const templates: {
  [K in keyof TemplateDataMap]: (data: TemplateDataMap[K]) => {
    subject: string;
    html: string;
  };
} = {
  welcome: welcomeTemplate,
};

export type TemplateName = keyof TemplateDataMap;
export type TemplateData<T extends TemplateName> = TemplateDataMap[T];

