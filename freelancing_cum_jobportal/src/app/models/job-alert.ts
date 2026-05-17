export interface JobAlert {
  id?: string;
  userId: string;
  keyword: string;
  skillFilter: string;
  locationFilter: string;
  salaryMin: number;
  salaryMax: number;
}


