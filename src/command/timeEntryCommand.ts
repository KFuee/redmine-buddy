import { input } from "@inquirer/prompts";
import { getCurrentUser } from "../api/redmineService.js";
import { createSpinner } from "../utils/spinner.js";
import {
  calculateTotalHours,
  getFilteredEntries,
} from "../core/timeEntryLogic.js";
import chalk from "chalk";

const requestValues = async (): Promise<{
  startDate: string;
  endDate: string;
}> => {
  const startDate = await input({
    message: "Introduce la fecha de inicio",
    validate: (value) =>
      value.length > 0 || "Por favor, introduce una fecha de inicio",
  });

  const endDate = await input({
    message: "Introduce la fecha de fin",
    validate: (value) =>
      value.length > 0 || "Por favor, introduce una fecha de fin",
  });

  return { startDate, endDate };
};

export const listTimeEntriesCommand = async () => {
  const { startDate, endDate } = await requestValues();
  const currentUserId = (await getCurrentUser()).id;

  const stopSpinner = createSpinner(
    "Obteniendo imputaciones, por favor espere..."
  );
  const timeEntries = await getFilteredEntries(
    startDate,
    endDate,
    currentUserId
  );

  stopSpinner();
  console.log(chalk.green(JSON.stringify(timeEntries, null, 2)));
};

export const getTimeEntriesHoursCommand = async () => {
  const { startDate, endDate } = await requestValues();
  const currentUserId = (await getCurrentUser()).id;

  const stopSpinner = createSpinner("Calculando horas, por favor espere...");
  const allEntries = await getFilteredEntries(
    startDate,
    endDate,
    currentUserId
  );

  stopSpinner();
  console.log(
    chalk.green(
      `Total de horas imputadas entre (${startDate} y ${endDate}): ${calculateTotalHours(
        allEntries,
        currentUserId,
        startDate,
        endDate
      )}`
    )
  );
};
