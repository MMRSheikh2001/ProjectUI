import { FreelancerStats } from './freelancer-stats';
import { EmployerStats } from './employer-stats';

export interface User {
  id?: string | number;

  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  area: string;

  profileImage?: string;

  isVerified?: boolean;

  status?: 'active' | 'suspended' | 'banned';

  isDeleted?: boolean;

  createdAt: string;

  role: 'user' | 'company' | 'admin';

  isSuperAdmin?: boolean;

  coverImage?: string;
  tagline?: string;
  bio?: string;

  portfolioImages?: string[];

  freelancerStats?: FreelancerStats;
  employerStats?: EmployerStats;
}




