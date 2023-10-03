import { TimeEntry } from "../models/timeEntry.js";
import apiClient from "./apiClient.js";

export const getAllEntries = async (): Promise<TimeEntry[]> => {
  const limit = 100;
  let offset = 0;
  let allEntries: any[] = [];
  let totalCount: number = 0;
  let shouldContinueFetching = true;

  while (shouldContinueFetching) {
    const response = await apiClient.get("/time_entries.json", {
      params: { offset, limit },
    });

    const { total_count, time_entries } = response.data;

    // Si es la primera vez que obtenemos la respuesta, configuramos el totalCount
    if (totalCount === 0) {
      totalCount = total_count;
    }

    allEntries = [...allEntries, ...time_entries];
    offset += limit;

    if (allEntries.length >= totalCount) {
      shouldContinueFetching = false;
    }
  }

  return allEntries;
};
