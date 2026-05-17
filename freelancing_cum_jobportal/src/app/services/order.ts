import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private url = 'http://localhost:3000/orders';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Order[]> { return this.http.get<Order[]>(this.url); }
  getById(id: string | number): Observable<Order> { return this.http.get<Order>(`${this.url}/${id}`); }
  save(order: Order): Observable<Order> { return this.http.post<Order>(this.url, order); }
  update(id: string | number, order: Order): Observable<Order> { return this.http.put<Order>(`${this.url}/${id}`, order); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByClientId(clientId: string | number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}?clientId=${clientId}&isDeleted=false`);
  }
  findByFreelancerId(freelancerId: string | number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}?freelancerId=${freelancerId}&isDeleted=false`);
  }
  findByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}?status=${status}&isDeleted=false`);
  }
  findByGigId(gigId: string | number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}?gigId=${gigId}&isDeleted=false`);
  }
  findByClientIdAndStatus(clientId: string | number, status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}?clientId=${clientId}&status=${status}`);
  }
  findByFreelancerIdAndStatus(freelancerId: string | number, status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}?freelancerId=${freelancerId}&status=${status}`);
  }
  findActiveOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}?status=active&isDeleted=false`);
  }
  findLatest(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}?_sort=createdAt&_order=desc`);
  }
}