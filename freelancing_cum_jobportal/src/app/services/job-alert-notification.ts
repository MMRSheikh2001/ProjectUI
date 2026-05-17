import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobAlertNotification } from '../models/job-alert-notification';

@Injectable({ providedIn: 'root' })
export class JobAlertNotificationService {
  private url = 'http://localhost:3000/jobAlertNotifications';
  constructor(private http: HttpClient) { }

  findAll(): Observable<JobAlertNotification[]> { return this.http.get<JobAlertNotification[]>(this.url); }
  getById(id: string): Observable<JobAlertNotification> { return this.http.get<JobAlertNotification>(`${this.url}/${id}`); }
  save(n: JobAlertNotification): Observable<JobAlertNotification> { return this.http.post<JobAlertNotification>(this.url, n); }
  update(id: string, n: JobAlertNotification): Observable<JobAlertNotification> { return this.http.put<JobAlertNotification>(`${this.url}/${id}`, n); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string): Observable<JobAlertNotification[]> {
    return this.http.get<JobAlertNotification[]>(`${this.url}?userId=${userId}`);
  }
  findUnreadByUserId(userId: string): Observable<JobAlertNotification[]> {
    return this.http.get<JobAlertNotification[]>(`${this.url}?userId=${userId}&isRead=false`);
  }
  findByAlertId(alertId: string): Observable<JobAlertNotification[]> {
    return this.http.get<JobAlertNotification[]>(`${this.url}?alertId=${alertId}`);
  }
  findByJobId(jobId: string): Observable<JobAlertNotification[]> {
    return this.http.get<JobAlertNotification[]>(`${this.url}?jobId=${jobId}`);
  }
}