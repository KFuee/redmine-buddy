import { IssueDetail } from "../models/issue.js";

const randomHours = (min: number, max: number): number => {
  min = Math.max(min, 0.5);
  const minQuarters = Math.ceil(min / 0.25);
  const maxQuarters = Math.floor(max / 0.25);
  const randomQuarters =
    Math.floor(Math.random() * (maxQuarters - minQuarters + 1)) + minQuarters;
  return randomQuarters * 0.25;
};

const imputeHoursToIssue = async (
  issueId: number,
  hours: number,
  totalImputed: { hours: number }
) => {
  console.log(`Imputed ${hours} hours to Issue ID: ${issueId}`);
  totalImputed.hours += hours;
};

export const distributeHours = (
  issuesWithDetails: IssueDetail[],
  hoursToDistribute: number
): number => {
  let totalImputed = { hours: 0 };

  // 1. Ordenar las tareas de mayor a menor según horas imputadas.
  issuesWithDetails.sort((a, b) => {
    const totalHoursA = a.timeEntries.reduce(
      (sum, entry) => sum + entry.hours,
      0
    );
    const totalHoursB = b.timeEntries.reduce(
      (sum, entry) => sum + entry.hours,
      0
    );
    return totalHoursB - totalHoursA;
  });

  // 2. Calcular la holgura de cada tarea respecto a la tarea con más horas.
  const maxHours = issuesWithDetails[0].timeEntries.reduce(
    (sum, entry) => sum + entry.hours,
    0
  );
  const slack: { [id: string]: number } = {};
  let totalSlack = 0;
  issuesWithDetails.forEach((issue) => {
    slack[issue.id] =
      maxHours - issue.timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
    totalSlack += slack[issue.id];
  });

  let remainingHours = hoursToDistribute;

  // 3. Distribuir las horas proporcionalmente basado en la holgura.
  for (let issue of issuesWithDetails) {
    if (remainingHours < 0.5) break;

    let proportion = slack[issue.id] / totalSlack;
    let hoursForTask = proportion * remainingHours;

    // Mientras la tarea pueda recibir al menos 0.5 horas, imputamos aleatoriamente.
    while (hoursForTask >= 0.5) {
      let hoursToImpute = randomHours(0.5, Math.min(hoursForTask, 8.5));
      imputeHoursToIssue(issue.id, hoursToImpute, totalImputed);

      remainingHours -= hoursToImpute;
      hoursForTask -= hoursToImpute;
    }

    totalSlack -= slack[issue.id];
  }

  // 4. Corrección: Garantizar que se imputen exactamente las horas esperadas.
  if (totalImputed.hours < hoursToDistribute) {
    let diff = hoursToDistribute - totalImputed.hours;
    const taskWithMostSlack = issuesWithDetails.reduce((a, b) =>
      slack[a.id] > slack[b.id] ? a : b
    );
    imputeHoursToIssue(taskWithMostSlack.id, diff, totalImputed);
  }

  return totalImputed.hours;
};
