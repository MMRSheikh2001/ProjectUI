import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dispute } from '../models/dispute';

@Injectable({ providedIn: 'root' })
export class DisputeService {
  private url = 'http://localhost:3000/disputes';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Dispute[]> { return this.http.get<Dispute[]>(this.url); }
  getById(id: string | number): Observable<Dispute> { return this.http.get<Dispute>(`${this.url}/${id}`); }
  save(d: Dispute): Observable<Dispute> { return this.http.post<Dispute>(this.url, d); }
  update(id: string | number, d: Dispute): Observable<Dispute> { return this.http.put<Dispute>(`${this.url}/${id}`, d); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByOrderId(orderId: string | number): Observable<Dispute[]> {
    return this.http.get<Dispute[]>(`${this.url}?orderId=${orderId}`);
  }
  findByRaisedBy(userId: string | number): Observable<Dispute[]> {
    return this.http.get<Dispute[]>(`${this.url}?raisedBy=${userId}`);
  }
  findByStatus(status: string): Observable<Dispute[]> {
    return this.http.get<Dispute[]>(`${this.url}?status=${status}`);
  }
  findOpenDisputes(): Observable<Dispute[]> {
    return this.http.get<Dispute[]>(`${this.url}?status=open`);
  }
  findUnderReview(): Observable<Dispute[]> {
    return this.http.get<Dispute[]>(`${this.url}?status=under-review`);
  }
}