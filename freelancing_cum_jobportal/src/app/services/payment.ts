import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private url = 'http://localhost:3000/payments';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Payment[]> { return this.http.get<Payment[]>(this.url); }
  getById(id: string): Observable<Payment> { return this.http.get<Payment>(`${this.url}/${id}`); }
  save(p: Payment): Observable<Payment> { return this.http.post<Payment>(this.url, p); }
  update(id: string, p: Payment): Observable<Payment> { return this.http.put<Payment>(`${this.url}/${id}`, p); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.url}?userId=${userId}`);
  }
  findByOrderId(orderId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.url}?orderId=${orderId}`);
  }
  findByStatus(status: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.url}?status=${status}`);
  }
  findByMethod(method: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.url}?method=${method}`);
  }
  findByUserIdAndStatus(userId: string, status: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.url}?userId=${userId}&status=${status}`);
  }
}