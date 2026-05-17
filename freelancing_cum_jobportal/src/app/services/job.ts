import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job';

@Injectable({ providedIn: 'root' })
export class JobService {
  private url = 'http://localhost:3000/jobs';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Job[]> { return this.http.get<Job[]>(this.url); }
  getById(id: string | number): Observable<Job> { return this.http.get<Job>(`${this.url}/${id}`); }
  save(job: Job): Observable<Job> { return this.http.post<Job>(this.url, job); }
  update(id: string | number, job: Job): Observable<Job> { return this.http.put<Job>(`${this.url}/${id}`, job); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByEmployerId(employerId: string | number): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.url}?employerId=${employerId}`);
  }
  findByStatus(status: string): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.url}?status=${status}`);
  }
  findByCity(city: string): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.url}?city=${city}&isDeleted=false`);
  }
  findByJobType(jobType: string): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.url}?jobType=${jobType}&isDeleted=false`);
  }
  searchByTitle(keyword: string): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.url}?title_like=${keyword}&isDeleted=false`);
  }
  findOpenJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.url}?status=open&isDeleted=false`);
  }
  findBySalaryRange(min: number, max: number): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.url}?salaryMin_gte=${min}&salaryMax_lte=${max}`);
  }
  findLatest(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.url}?_sort=createdAt&_order=desc&status=open`);
  }
}