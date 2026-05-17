import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentMethod } from '../models/payment-method';

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
  private url = 'http://localhost:3000/paymentMethods';
  constructor(private http: HttpClient) { }

  findAll(): Observable<PaymentMethod[]> { return this.http.get<PaymentMethod[]>(this.url); }
  getById(id: string | number): Observable<PaymentMethod> { return this.http.get<PaymentMethod>(`${this.url}/${id}`); }
  save(m: PaymentMethod): Observable<PaymentMethod> { return this.http.post<PaymentMethod>(this.url, m); }
  update(id: string | number, m: PaymentMethod): Observable<PaymentMethod> { return this.http.put<PaymentMethod>(`${this.url}/${id}`, m); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string | number): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.url}?userId=${userId}`);
  }
  findByType(type: string): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.url}?type=${type}`);
  }
  findByUserIdAndType(userId: string, type: string): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.url}?userId=${userId}&type=${type}`);
  }
}