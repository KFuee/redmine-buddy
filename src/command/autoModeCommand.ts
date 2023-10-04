import { input, select } from "@inquirer/prompts";
import {
  getAllIssuesByProjectId,
  getAllProjects,
} from "../api/redmineService.js";
import { getFilteredEntries } from "../core/timeEntryLogic.js";
import { IssueDetail } from "../models/issue.js";
import { distributeHours } from "../core/autoModeLogic.js";
import { createSpinner } from "../utils/spinner.js";

const requestValues = async (
  choices: { name: string; value: number }[]
): Promise<{
  date: string;
  hoursToRegister: string;
  project: number;
}> => {
  // Fecha formato YYYY-MM-DD
  const date = await input({
    message: "Introduce la fecha",
    validate: (value) => value.length > 0 || "Por favor, introduce una fecha",
    default: new Date().toISOString().split("T")[0],
  });

  const hoursToRegister = await input({
    message: "Introduce las horas a registrar",
    validate: (value) =>
      value.length > 0 || "Por favor, introduce las horas a registrar",
  });

  const project = await select({
    message: "Selecciona el proyecto",
    choices,
  });

  return { date, hoursToRegister, project };
};

export const autoModeCommand = async () => {
  const choices = (await getAllProjects()).map((project) => {
    return { name: project.name, value: project.id };
  });

  const { date, hoursToRegister, project } = await requestValues(choices);

  const stopSpinner = createSpinner(
    "Realizando la imputación automática, por favor, espere..."
  );

  const timeEntries = await getFilteredEntries(null, null, null, project);

  const issues = await getAllIssuesByProjectId(project);
  const issuesWithDetails: IssueDetail[] = issues.map((issue) => {
    return {
      ...issue,
      timeEntries: timeEntries.filter(
        (timeEntry) => timeEntry.issue.id === issue.id
      ),
    };
  });

  stopSpinner();

  console.log(distributeHours(issuesWithDetails, Number(hoursToRegister)));
};
