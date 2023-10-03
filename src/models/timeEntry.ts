export interface TimeEntry {
  id: number;
  user: {
    id: number;
    name: string;
  };
  hours: number;
  spent_on: string;
}
