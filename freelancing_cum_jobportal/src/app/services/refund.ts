import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Refund } from '../models/refund';

@Injectable({ providedIn: 'root' })
export class RefundService {
  private url = 'http://localhost:3000/refunds';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Refund[]> { return this.http.get<Refund[]>(this.url); }
  getById(id: string): Observable<Refund> { return this.http.get<Refund>(`${this.url}/${id}`); }
  save(r: Refund): Observable<Refund> { return this.http.post<Refund>(this.url, r); }
  update(id: string, r: Refund): Observable<Refund> { return this.http.put<Refund>(`${this.url}/${id}`, r); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByOrderId(orderId: string): Observable<Refund[]> {
    return this.http.get<Refund[]>(`${this.url}?orderId=${orderId}`);
  }
  findByStatus(status: string): Observable<Refund[]> {
    return this.http.get<Refund[]>(`${this.url}?status=${status}`);
  }
  findPending(): Observable<Refund[]> {
    return this.http.get<Refund[]>(`${this.url}?status=pending`);
  }
}