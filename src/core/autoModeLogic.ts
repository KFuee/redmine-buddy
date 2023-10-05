import { IssueDetail } from "../models/issue.js";

const randomHours = (min: number, max: number): number => {
  min = Math.max(min, 0.5); // Garantizar que el mínimo sea 0.5
  const minQuarters = Math.ceil(min / 0.25);
  const maxQuarters = Math.floor(max / 0.25);
  const randomQuarters =
    Math.floor(Math.random() * (maxQuarters - minQuarters + 1)) + minQuarters;
  return randomQuarters * 0.25;
};

const imputeHoursToIssue = async (
  issueId: number,
  hours: number,
  totalImputed: { hours: number },
  previousImputations: Map<number, number>
) => {
  const previousHours = previousImputations.get(issueId) || 0;
  previousImputations.set(issueId, previousHours + hours);

  totalImputed.hours += hours;
};

const getDistributionPercentage = (issue: IssueDetail) => {
  const totalHours = issue.timeEntries.reduce(
    (sum, entry) => sum + entry.hours,
    0
  );
  const estimatedHours = issue.estimated_hours || 0;
  return totalHours + estimatedHours * 0.5; // Pondera las horas estimadas al 50%.
};

export const distributeHours = (
  issuesWithDetails: IssueDetail[],
  hoursToDistribute: number
): { totalImputed: number; previousImputations: Map<number, number> } => {
  let totalImputed = { hours: 0 };
  let imputedIssues: IssueDetail[] = [];
  const previousImputations = new Map<number, number>();

  // Ordenar las tareas de mayor a menor según horas imputadas + horas estimadas.
  issuesWithDetails.sort(
    (a, b) => getDistributionPercentage(b) - getDistributionPercentage(a)
  );

  while (hoursToDistribute >= 0.5) {
    const index = Math.floor(Math.random() * issuesWithDetails.length);
    const issue = issuesWithDetails[index];

    let maxHoursForIssue = Math.min(2.5, hoursToDistribute);
    let hoursToImpute = randomHours(0.5, maxHoursForIssue);

    imputeHoursToIssue(
      issue.id,
      hoursToImpute,
      totalImputed,
      previousImputations
    );

    hoursToDistribute -= hoursToImpute;
    imputedIssues.push(issue);
  }

  // Corrección: Si hay horas restantes
  if (hoursToDistribute <= 0)
    return { totalImputed: totalImputed.hours, previousImputations };

  const suitableTasks = imputedIssues.filter((issue) => {
    const totalHours = issue.timeEntries.reduce(
      (sum, entry) => sum + entry.hours,
      0
    );
    return (totalHours + hoursToDistribute) % 0.5 === 0;
  });

  if (suitableTasks.length > 0) {
    const randomIssue =
      suitableTasks[Math.floor(Math.random() * suitableTasks.length)];
    imputeHoursToIssue(
      randomIssue.id,
      hoursToDistribute,
      totalImputed,
      previousImputations
    );
  } else {
    const randomIssue =
      imputedIssues[Math.floor(Math.random() * imputedIssues.length)];
    imputeHoursToIssue(
      randomIssue.id,
      hoursToDistribute,
      totalImputed,
      previousImputations
    );
  }

  return {
    totalImputed: totalImputed.hours,
    previousImputations,
  };
};
