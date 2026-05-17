import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Report } from '../models/report';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private url = 'http://localhost:3000/reports';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Report[]> { return this.http.get<Report[]>(this.url); }
  getById(id: string | number): Observable<Report> { return this.http.get<Report>(`${this.url}/${id}`); }
  save(r: Report): Observable<Report> { return this.http.post<Report>(this.url, r); }
  update(id: string | number, r: Report): Observable<Report> { return this.http.put<Report>(`${this.url}/${id}`, r); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByReportedUserId(userId: string | number): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.url}?reportedUserId=${userId}`);
  }
  findByReportedBy(userId: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.url}?reportedBy=${userId}`);
  }
  findByStatus(status: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.url}?status=${status}`);
  }
  findPending(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.url}?status=pending`);
  }
}