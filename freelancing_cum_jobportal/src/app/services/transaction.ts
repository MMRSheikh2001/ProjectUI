import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private url = 'http://localhost:3000/transactions';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Transaction[]> { return this.http.get<Transaction[]>(this.url); }
  getById(id: string | number): Observable<Transaction> { return this.http.get<Transaction>(`${this.url}/${id}`); }
  save(t: Transaction): Observable<Transaction> { return this.http.post<Transaction>(this.url, t); }
  update(id: string | number, t: Transaction): Observable<Transaction> { return this.http.put<Transaction>(`${this.url}/${id}`, t); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string | number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.url}?userId=${userId}&_sort=createdAt&_order=desc`);
  }
  findByOrderId(orderId: string | number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.url}?orderId=${orderId}`);
  }
  findByType(type: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.url}?type=${type}`);
  }
  findCreditsByUserId(userId: string | number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.url}?userId=${userId}&type=credit`);
  }
  findDebitsByUserId(userId: string | number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.url}?userId=${userId}&type=debit`);
  }
  findLatestByUserId(userId: string | number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.url}?userId=${userId}&_sort=createdAt&_order=desc&_limit=10`);
  }
}