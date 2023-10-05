import { input, select } from "@inquirer/prompts";
import {
  createTimeEntry,
  getAllIssuesByProjectId,
  getAllProjects,
} from "../api/redmineService.js";
import { getFilteredEntries } from "../core/timeEntryLogic.js";
import { IssueDetail } from "../models/issue.js";
import { distributeHours } from "../core/autoModeLogic.js";
import { createSpinner } from "../utils/spinner.js";
import chalk from "chalk";

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
    "Realizando la repartición automática, por favor, espere..."
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

  const { totalImputed, previousImputations } = distributeHours(
    issuesWithDetails,
    Number(hoursToRegister)
  );

  const combinationOfIssuesAndTotalHours = Array.from(
    previousImputations.entries()
  ).map(([issueId, hours]) => {
    const issue = issues.find((issue) => issue.id === issueId);
    return { issue, hours };
  });

  for (const { issue, hours } of combinationOfIssuesAndTotalHours) {
    if (!issue) continue;

    try {
      await createTimeEntry(issue.id, hours, date);
      console.log(
        chalk.yellow(
          `Se han imputado ${hours.toFixed(2)} horas en la tarea ${
            issue.id
          } - ${issue.subject}`
        )
      );
    } catch (error) {
      console.log(
        chalk.red(
          `No se han podido imputar ${hours.toFixed(2)} horas en la tarea ${
            issue.id
          } - ${issue.subject}`
        )
      );
    }
  }

  console.log(
    chalk.bgGreen.black(
      `Se han imputado un total de ${totalImputed.toFixed(
        2
      )} horas en el proyecto ${choices.find((c) => c.value === project)?.name}`
    )
  );
};
