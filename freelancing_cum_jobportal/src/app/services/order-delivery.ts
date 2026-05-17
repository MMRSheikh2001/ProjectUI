import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDelivery } from '../models/order-delivery';

@Injectable({ providedIn: 'root' })
export class OrderDeliveryService {
  private url = 'http://localhost:3000/orderDeliveries';
  constructor(private http: HttpClient) { }

  findAll(): Observable<OrderDelivery[]> { return this.http.get<OrderDelivery[]>(this.url); }
  getById(id: string | number): Observable<OrderDelivery> { return this.http.get<OrderDelivery>(`${this.url}/${id}`); }
  save(d: OrderDelivery): Observable<OrderDelivery> { return this.http.post<OrderDelivery>(this.url, d); }
  update(id: string | number, d: OrderDelivery): Observable<OrderDelivery> { return this.http.put<OrderDelivery>(`${this.url}/${id}`, d); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByOrderId(orderId: string | number): Observable<OrderDelivery[]> {
    return this.http.get<OrderDelivery[]>(`${this.url}?orderId=${orderId}`);
  }
  findLatestByOrderId(orderId: string | number): Observable<OrderDelivery[]> {
    return this.http.get<OrderDelivery[]>(`${this.url}?orderId=${orderId}&_sort=deliveredAt&_order=desc`);
  }
}