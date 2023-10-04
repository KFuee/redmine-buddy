export interface TimeEntry {
  id: number;
  project: Project;
  issue: Issue;
  user: Project;
  activity: Project;
  hours: number;
  comments: string;
  spent_on: string;
  created_on: string;
  updated_on: string;
  custom_fields: Customfield[];
}

interface Customfield {
  id: number;
  name: string;
  value: string;
}

interface Issue {
  id: number;
}

interface Project {
  id: number;
  name: string;
}
