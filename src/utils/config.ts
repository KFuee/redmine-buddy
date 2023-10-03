import Conf from "conf";

const config = new Conf({ projectName: "redmine-cli" });

const getValue = (key: string): string | undefined => {
  return config.get(key) as string | undefined;
};

export const setValue = (key: string, value: string): void => {
  config.set(key, value);
};

const deleteValue = (key: string): void => {
  config.delete(key);
};

export const getConfiguredValues = (): {
  redmineUrl: string;
  fullName: string;
  apiKey: string;
} => {
  const storedRedmineUrl = getValue("redmineUrl");
  const storedFullName = getValue("fullName");
  const storedApiKey = getValue("apiKey");

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
  deleteValue("redmineUrl");
  deleteValue("fullName");
  deleteValue("apiKey");
};
