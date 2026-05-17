import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobAlert } from '../models/job-alert';

@Injectable({ providedIn: 'root' })
export class JobAlertService {
  private url = 'http://localhost:3000/jobAlerts';
  constructor(private http: HttpClient) { }

  findAll(): Observable<JobAlert[]> { return this.http.get<JobAlert[]>(this.url); }
  getById(id: string): Observable<JobAlert> { return this.http.get<JobAlert>(`${this.url}/${id}`); }
  save(alert: JobAlert): Observable<JobAlert> { return this.http.post<JobAlert>(this.url, alert); }
  update(id: string, alert: JobAlert): Observable<JobAlert> { return this.http.put<JobAlert>(`${this.url}/${id}`, alert); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string): Observable<JobAlert[]> {
    return this.http.get<JobAlert[]>(`${this.url}?userId=${userId}`);
  }
  findByKeyword(keyword: string): Observable<JobAlert[]> {
    return this.http.get<JobAlert[]>(`${this.url}?keyword_like=${keyword}`);
  }
  findByLocation(location: string): Observable<JobAlert[]> {
    return this.http.get<JobAlert[]>(`${this.url}?locationFilter=${location}`);
  }
}