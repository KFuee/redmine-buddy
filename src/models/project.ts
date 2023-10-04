export interface Project {
  id: number;
  name: string;
  identifier: string;
  description: string;
  status: number;
  is_public: boolean;
  custom_fields: Customfield[];
  created_on: string;
  updated_on: string;
}

interface Customfield {
  id: number;
  name: string;
  value: string;
}
