import { TimeEntry } from "../models/timeEntry.js";
import { getAllEntries } from "../api/redmineService.js";

const filterEntries = (
  entries: TimeEntry[],
  startDate?: string | null,
  endDate?: string | null,
  userId?: number | null,
  projectId?: number | null
) => {
  return entries.filter(
    (entry) =>
      (!startDate || entry.spent_on >= startDate) &&
      (!endDate || entry.spent_on <= endDate) &&
      (!userId || entry.user.id === userId) &&
      (!projectId || entry.project.id === projectId)
  );
};

export const getFilteredEntries = async (
  startDate?: string | null,
  endDate?: string | null,
  userId?: number | null,
  projectId?: number | null
) => {
  const allEntries = await getAllEntries();
  return filterEntries(allEntries, startDate, endDate, userId, projectId);
};

export const calculateTotalHours = (
  entries: TimeEntry[],
  userId: number,
  startDate: string,
  endDate: string
) => {
  const filteredEntries = filterEntries(entries, startDate, endDate, userId);
  return filteredEntries.reduce((acc, entry) => acc + entry.hours, 0);
};
