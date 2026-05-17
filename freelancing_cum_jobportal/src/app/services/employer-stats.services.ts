import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployerStats } from '../models/employer-stats';

@Injectable({ providedIn: 'root' })
export class EmployerStatsService {
  private url = 'http://localhost:3000/employerStats';
  constructor(private http: HttpClient) { }

  findAll(): Observable<EmployerStats[]> { return this.http.get<EmployerStats[]>(this.url); }
  getById(id: string): Observable<EmployerStats> { return this.http.get<EmployerStats>(`${this.url}/${id}`); }
  save(s: EmployerStats): Observable<EmployerStats> { return this.http.post<EmployerStats>(this.url, s); }
  update(id: string, s: EmployerStats): Observable<EmployerStats> { return this.http.put<EmployerStats>(`${this.url}/${id}`, s); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  findByUserId(userId: string): Observable<EmployerStats[]> { return this.http.get<EmployerStats[]>(`${this.url}?userId=${userId}`); }
}