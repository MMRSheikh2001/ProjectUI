import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobShortlist } from '../models/job-shortlist';

@Injectable({ providedIn: 'root' })
export class JobShortlistService {
  private url = 'http://localhost:3000/jobShortlists';
  constructor(private http: HttpClient) { }

  findAll(): Observable<JobShortlist[]> { return this.http.get<JobShortlist[]>(this.url); }
  getById(id: string): Observable<JobShortlist> { return this.http.get<JobShortlist>(`${this.url}/${id}`); }
  save(s: JobShortlist): Observable<JobShortlist> { return this.http.post<JobShortlist>(this.url, s); }
  update(id: string, s: JobShortlist): Observable<JobShortlist> { return this.http.put<JobShortlist>(`${this.url}/${id}`, s); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByJobId(jobId: string): Observable<JobShortlist[]> {
    return this.http.get<JobShortlist[]>(`${this.url}?jobId=${jobId}`);
  }
  findByApplicantId(applicantId: string): Observable<JobShortlist[]> {
    return this.http.get<JobShortlist[]>(`${this.url}?applicantId=${applicantId}`);
  }
  findByJobIdAndApplicantId(jobId: string, applicantId: string): Observable<JobShortlist[]> {
    return this.http.get<JobShortlist[]>(`${this.url}?jobId=${jobId}&applicantId=${applicantId}`);
  }
}