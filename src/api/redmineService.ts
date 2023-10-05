import { Issue } from "../models/issue.js";
import { Project } from "../models/project.js";
import { TimeEntry } from "../models/timeEntry.js";
import getApiClient from "./apiClient.js";

// Función genérica para paginar automáticamente los resultados
// Tipos genéricos:
// T: Tipo de los objetos individuales que se devolverán (por ejemplo, Project, Issue, TimeEntry).
// P: Tipo de los parámetros que se enviarán en la solicitud.
async function paginateApiCall<T, P = {}>(
  endpoint: string,
  rootProperty: string, // Propiedad raíz que contiene la lista de resultados (e.g. 'projects', 'issues', 'time_entries').
  initialParams?: P
): Promise<T[]> {
  const apiClient = getApiClient();
  const limit = 100;
  let offset = 0;
  let allResults: T[] = [];
  let totalCount: number = 0;
  let shouldContinueFetching = true;

  while (shouldContinueFetching) {
    const response = await apiClient.get(endpoint, {
      params: { ...initialParams, offset, limit },
    });

    const { total_count } = response.data;
    const items: T[] = response.data[rootProperty];

    if (totalCount === 0) {
      totalCount = total_count;
    }

    allResults = [...allResults, ...items];
    offset += limit;

    if (allResults.length >= totalCount) {
      shouldContinueFetching = false;
    }
  }

  return allResults;
}

export const getCurrentUser = async (): Promise<any> => {
  const apiClient = getApiClient();
  const response = await apiClient.get("/users/current.json");

  return response.data.user;
};

export const getAllProjects = async (): Promise<Project[]> =>
  await paginateApiCall<Project>("projects.json", "projects");

export const getAllIssuesByProjectId = async (
  projectId: number
): Promise<Issue[]> =>
  await paginateApiCall<Issue>("issues.json", "issues", {
    project_id: projectId,
  });

export const getAllEntries = async (): Promise<TimeEntry[]> =>
  await paginateApiCall<TimeEntry>("time_entries.json", "time_entries");

export const createTimeEntry = async (
  issueId: number,
  hours: number,
  spentOn: string,
  comments?: string
): Promise<TimeEntry> => {
  const apiClient = getApiClient();
  const response = await apiClient.post("/time_entries.json", {
    time_entry: {
      issue_id: issueId,
      hours,
      spent_on: spentOn,
      comments,
    },
  });

  return response.data.time_entry;
};
