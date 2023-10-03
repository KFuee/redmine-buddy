import { TimeEntry } from "../models/timeEntry.js";
import { getAllEntries } from "../api/redmineService.js";

const filterEntries = (
  entries: TimeEntry[],
  userId: number,
  startDate: string,
  endDate: string
) => {
  return entries.filter(
    (entry) =>
      entry.user.id === userId &&
      startDate <= entry.spent_on &&
      entry.spent_on <= endDate
  );
};

export const getFilteredEntries = async (
  userId: number,
  startDate: string,
  endDate: string
) => {
  const allEntries = await getAllEntries();
  return filterEntries(allEntries, userId, startDate, endDate);
};

export const calculateTotalHours = (
  entries: TimeEntry[],
  userId: number,
  startDate: string,
  endDate: string
) => {
  const filteredEntries = filterEntries(entries, userId, startDate, endDate);
  return (
    Math.round(
      filteredEntries.reduce((acc, entry) => acc + entry.hours, 0) * 100
    ) / 100
  );
};
