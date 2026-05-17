import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlatformEarning } from '../models/platform-earning';

@Injectable({ providedIn: 'root' })
export class PlatformEarningService {
  private url = 'http://localhost:3000/platformEarnings';
  constructor(private http: HttpClient) { }

  findAll(): Observable<PlatformEarning[]> { return this.http.get<PlatformEarning[]>(this.url); }
  getById(id: string): Observable<PlatformEarning> { return this.http.get<PlatformEarning>(`${this.url}/${id}`); }
  save(e: PlatformEarning): Observable<PlatformEarning> { return this.http.post<PlatformEarning>(this.url, e); }
  update(id: string, e: PlatformEarning): Observable<PlatformEarning> { return this.http.put<PlatformEarning>(`${this.url}/${id}`, e); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByOrderId(orderId: string): Observable<PlatformEarning[]> {
    return this.http.get<PlatformEarning[]>(`${this.url}?orderId=${orderId}`);
  }
  findTopEarnings(): Observable<PlatformEarning[]> {
    return this.http.get<PlatformEarning[]>(`${this.url}?_sort=commissionAmount&_order=desc`);
  }
}