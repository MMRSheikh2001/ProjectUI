import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderRevision } from '../models/order-revision';

@Injectable({ providedIn: 'root' })
export class OrderRevisionService {
  private url = 'http://localhost:3000/orderRevisions';
  constructor(private http: HttpClient) { }

  findAll(): Observable<OrderRevision[]> { return this.http.get<OrderRevision[]>(this.url); }
  getById(id: string | number): Observable<OrderRevision> { return this.http.get<OrderRevision>(`${this.url}/${id}`); }
  save(r: OrderRevision): Observable<OrderRevision> { return this.http.post<OrderRevision>(this.url, r); }
  update(id: string | number, r: OrderRevision): Observable<OrderRevision> { return this.http.put<OrderRevision>(`${this.url}/${id}`, r); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByOrderId(orderId: string | number): Observable<OrderRevision[]> {
    return this.http.get<OrderRevision[]>(`${this.url}?orderId=${orderId}`);
  }
  findByRequestedBy(userId: string | number): Observable<OrderRevision[]> {
    return this.http.get<OrderRevision[]>(`${this.url}?requestedBy=${userId}`);
  }
  findLatestByOrderId(orderId: string | number): Observable<OrderRevision[]> {
    return this.http.get<OrderRevision[]>(`${this.url}?orderId=${orderId}&_sort=createdAt&_order=desc`);
  }
}