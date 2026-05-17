import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppNotification } from '../models/notification';


@Injectable({ providedIn: 'root' })
export class NotificationService {
  private url = 'http://localhost:3000/notifications';
  constructor(private http: HttpClient) { }

  findAll(): Observable<AppNotification[]> { return this.http.get<AppNotification[]>(this.url); }
  getById(id: string | number): Observable<AppNotification> { return this.http.get<AppNotification>(`${this.url}/${id}`); }
  save(n: AppNotification): Observable<AppNotification> { return this.http.post<AppNotification>(this.url, n); }
  update(id: string | number, n: AppNotification): Observable<AppNotification> { return this.http.put<AppNotification>(`${this.url}/${id}`, n); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string | number): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.url}?userId=${userId}&_sort=id&_order=desc`);
  }
  findUnreadByUserId(userId: string): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.url}?userId=${userId}&isRead=false`);
  }
  findByType(type: string): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.url}?type=${type}`);
  }
  findByUserIdAndType(userId: string, type: string): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.url}?userId=${userId}&type=${type}`);
  }
  findReadByUserId(userId: string): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.url}?userId=${userId}&isRead=true`);
  }
  findByReferenceId(referenceId: string): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.url}?referenceId=${referenceId}`);
  }
}