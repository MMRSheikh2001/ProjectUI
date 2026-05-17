import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderStatusHistory } from '../models/order-status-history';

@Injectable({ providedIn: 'root' })
export class OrderStatusHistoryService {
  private url = 'http://localhost:3000/orderStatusHistory';
  constructor(private http: HttpClient) { }

  findAll(): Observable<OrderStatusHistory[]> { return this.http.get<OrderStatusHistory[]>(this.url); }
  getById(id: string): Observable<OrderStatusHistory> { return this.http.get<OrderStatusHistory>(`${this.url}/${id}`); }
  save(h: OrderStatusHistory): Observable<OrderStatusHistory> { return this.http.post<OrderStatusHistory>(this.url, h); }
  update(id: string, h: OrderStatusHistory): Observable<OrderStatusHistory> { return this.http.put<OrderStatusHistory>(`${this.url}/${id}`, h); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByOrderId(orderId: string): Observable<OrderStatusHistory[]> {
    return this.http.get<OrderStatusHistory[]>(`${this.url}?orderId=${orderId}`);
  }
  findByStatus(status: string): Observable<OrderStatusHistory[]> {
    return this.http.get<OrderStatusHistory[]>(`${this.url}?status=${status}`);
  }
  findLatestByOrderId(orderId: string): Observable<OrderStatusHistory[]> {
    return this.http.get<OrderStatusHistory[]>(`${this.url}?orderId=${orderId}&_sort=changedAt&_order=desc`);
  }
}