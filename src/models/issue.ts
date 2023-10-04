import { TimeEntry } from "./timeEntry.js";

export interface Issue {
  id: number;
  project: {
    id: number;
    name: string;
  };
  tracker: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
  priority: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  subject: string;
  description: string;
  start_date?: string;
  due_date?: string;
  done_ratio: number;
  estimated_hours?: number;
  created_on: string;
  updated_on: string;
  closed_on?: string;
}

export interface IssueDetail extends Issue {
  timeEntries: TimeEntry[];
}
