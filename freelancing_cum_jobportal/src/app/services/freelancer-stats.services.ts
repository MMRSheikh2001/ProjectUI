import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FreelancerStats } from '../models/freelancer-stats';

@Injectable({ providedIn: 'root' })
export class FreelancerStatsService {
  private url = 'http://localhost:3000/freelancerStats';
  constructor(private http: HttpClient) { }

  findAll(): Observable<FreelancerStats[]> { return this.http.get<FreelancerStats[]>(this.url); }
  getById(id: string | number): Observable<FreelancerStats> { return this.http.get<FreelancerStats>(`${this.url}/${id}`); }
  save(s: FreelancerStats): Observable<FreelancerStats> { return this.http.post<FreelancerStats>(this.url, s); }
  update(id: string | number, s: FreelancerStats): Observable<FreelancerStats> { return this.http.put<FreelancerStats>(`${this.url}/${id}`, s); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  findByUserId(userId: string | number): Observable<FreelancerStats[]> { return this.http.get<FreelancerStats[]>(`${this.url}?userId=${userId}`); }
}