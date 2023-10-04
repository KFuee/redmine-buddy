import axios from "axios";
import { getConfiguredValues } from "../utils/config.js";
import chalk from "chalk";

const getApiClient = () => {
  try {
    const config = getConfiguredValues();

    return axios.create({
      baseURL: config.redmineUrl,
      headers: {
        "X-Redmine-API-Key": config.apiKey,
      },
    });
  } catch (error) {
    console.log(chalk.red((error as Error).message));
    process.exit(1);
  }
};

export default getApiClient;
