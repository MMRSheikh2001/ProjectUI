import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobApplication } from '../models/job-application';

@Injectable({ providedIn: 'root' })
export class JobApplicationService {
  private url = 'http://localhost:3000/jobApplications';
  constructor(private http: HttpClient) { }

  findAll(): Observable<JobApplication[]> { return this.http.get<JobApplication[]>(this.url); }
  getById(id: string | number): Observable<JobApplication> { return this.http.get<JobApplication>(`${this.url}/${id}`); }
  save(app: JobApplication): Observable<JobApplication> { return this.http.post<JobApplication>(this.url, app); }
  update(id: string | number, app: JobApplication): Observable<JobApplication> { return this.http.put<JobApplication>(`${this.url}/${id}`, app); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByJobId(jobId: string | number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.url}?jobId=${jobId}`);
  }
  findByApplicantId(applicantId: string | number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.url}?applicantId=${applicantId}&_expand=job`);
  }
  findByStatus(status: string): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.url}?status=${status}`);
  }
  findByJobIdAndStatus(jobId: string | number, status: string): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.url}?jobId=${jobId}&status=${status}`);
  }
  findByApplicantIdAndJobId(applicantId: string | number, jobId: string | number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.url}?applicantId=${applicantId}&jobId=${jobId}`);
  }
}