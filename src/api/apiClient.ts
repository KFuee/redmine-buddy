import axios from "axios";
import { getConfiguredValues } from "../utils/config.js";

const config = getConfiguredValues();

const apiClient = axios.create({
  baseURL: config.redmineUrl,
  headers: {
    "X-Redmine-API-Key": config.apiKey,
  },
});

export default apiClient;
