import axios from "axios";
import { getConfiguredValues } from "../utils/config.js";

const getApiClient = () => {
  const config = getConfiguredValues();

  return axios.create({
    baseURL: config.redmineUrl,
    headers: {
      "X-Redmine-API-Key": config.apiKey,
    },
  });
};

export default getApiClient;
