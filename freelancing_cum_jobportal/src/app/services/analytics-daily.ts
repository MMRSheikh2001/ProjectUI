import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalyticsDaily } from '../models/analytics-daily';

@Injectable({ providedIn: 'root' })
export class AnalyticsDailyService {
  private url = 'http://localhost:3000/analyticsDaily';
  constructor(private http: HttpClient) { }

  findAll(): Observable<AnalyticsDaily[]> { return this.http.get<AnalyticsDaily[]>(this.url); }
  getById(id: string | number): Observable<AnalyticsDaily> { return this.http.get<AnalyticsDaily>(`${this.url}/${id}`); }
  save(a: AnalyticsDaily): Observable<AnalyticsDaily> { return this.http.post<AnalyticsDaily>(this.url, a); }
  update(id: string | number, a: AnalyticsDaily): Observable<AnalyticsDaily> { return this.http.put<AnalyticsDaily>(`${this.url}/${id}`, a); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByDate(date: string): Observable<AnalyticsDaily[]> {
    return this.http.get<AnalyticsDaily[]>(`${this.url}?date=${date}`);
  }
  findLatest(): Observable<AnalyticsDaily[]> {
    return this.http.get<AnalyticsDaily[]>(`${this.url}?_sort=date&_order=desc&_limit=1`);
  }
  findLastSevenDays(): Observable<AnalyticsDaily[]> {
    return this.http.get<AnalyticsDaily[]>(`${this.url}?_sort=date&_order=desc&_limit=7`);
  }
  findLastThirtyDays(): Observable<AnalyticsDaily[]> {
    return this.http.get<AnalyticsDaily[]>(`${this.url}?_sort=date&_order=desc&_limit=30`);
  }
  findTopRevenueDay(): Observable<AnalyticsDaily[]> {
    return this.http.get<AnalyticsDaily[]>(`${this.url}?_sort=revenue&_order=desc&_limit=1`);
  }
}