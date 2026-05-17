import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobseekerDashboardStats, FreelancerDashboardStats, EmployerDashboardStats } from '../models/dashboard-stats';

@Injectable({ providedIn: 'root' })
export class DashboardStatsService {
  private jsUrl = 'http://localhost:3000/jobseekerDashboardStats';
  private empUrl = 'http://localhost:3000/employerDashboardStats';

  constructor(private http: HttpClient) { }

  getJobseekerStats(userId: string | number): Observable<JobseekerDashboardStats[]> {
    return this.http.get<JobseekerDashboardStats[]>(`${this.jsUrl}?userId=${userId}`);
  }

  getEmployerStats(userId: string | number): Observable<EmployerDashboardStats[]> {
    return this.http.get<EmployerDashboardStats[]>(`${this.empUrl}?userId=${userId}`);
  }

  calculateResumeScore(completedFields: string[]): number {
    const weights: Record<string, number> = {
      'headline': 10, 'careerObjective': 10, 'education': 15,
      'experience': 20, 'skills': 15, 'projects': 10,
      'certifications': 10, 'photo': 5, 'social': 5,
    };
    return completedFields.reduce((sum, f) => sum + (weights[f] || 0), 0);
  }
}