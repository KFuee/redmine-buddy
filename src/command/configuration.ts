import Conf from "conf";
import { input, password } from "@inquirer/prompts";

const config = new Conf({ projectName: "redmine-cli" });

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

export const getConfiguredValues = (): {
  redmineUrl: string;
  fullName: string;
  apiKey: string;
} => {
  const storedRedmineUrl = config.get("redmineUrl") as string;
  const storedFullName = config.get("fullName") as string;
  const storedApiKey = config.get("apiKey") as string;

  if (!storedRedmineUrl || !storedFullName || !storedApiKey) {
    throw new Error("Ejecuta el comando configure antes de continuar");
  }

  return {
    redmineUrl: storedRedmineUrl,
    fullName: storedFullName,
    apiKey: storedApiKey,
  };
};

export const deleteConfiguredValues = (): void => {
  config.delete("redmineUrl");
  config.delete("fullName");
  config.delete("apiKey");
};

export const configureCommand = async () => {
  const { redmineUrl, fullName, apiKey } = await requestValues();

  config.set("redmineUrl", redmineUrl);
  config.set("fullName", fullName);
  config.set("apiKey", apiKey);
};
