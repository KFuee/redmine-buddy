import { input, password } from "@inquirer/prompts";
import { setValue } from "../utils/config.js";

const requestValues = async (): Promise<{
  fullName: string;
  apiKey: string;
  redmineUrl: string;
}> => {
  const redmineUrl = await input({
    message: "Introduce la URL de tu instancia de Redmine",
    validate: (value) => value.length > 0 || "Por favor, introduce una URL",
  });

  const fullName = await input({
    message: "Introduce tu nombre completo",
    validate: (value) => value.length > 0 || "Por favor, introduce tu nombre",
  });

  const apiKey = await password({
    message: "Introduce tu API Key de Redmine",
    mask: "*",
    validate: (value) =>
      value.length > 0 || "Por favor, introduce tu API Key de Redmine",
  });

  return { fullName, apiKey, redmineUrl };
};

export const configureCommand = async () => {
  const { redmineUrl, fullName, apiKey } = await requestValues();

  setValue("redmineUrl", redmineUrl);
  setValue("fullName", fullName);
  setValue("apiKey", apiKey);
};
