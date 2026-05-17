import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Withdrawal } from '../models/withdrawal';

@Injectable({ providedIn: 'root' })
export class WithdrawalService {
  private url = 'http://localhost:3000/withdrawals';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Withdrawal[]> { return this.http.get<Withdrawal[]>(this.url); }
  getById(id: string | number): Observable<Withdrawal> { return this.http.get<Withdrawal>(`${this.url}/${id}`); }
  save(w: Withdrawal): Observable<Withdrawal> { return this.http.post<Withdrawal>(this.url, w); }
  update(id: string | number, w: Withdrawal): Observable<Withdrawal> { return this.http.put<Withdrawal>(`${this.url}/${id}`, w); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string | number): Observable<Withdrawal[]> {
    return this.http.get<Withdrawal[]>(`${this.url}?userId=${userId}`);
  }
  findByStatus(status: string): Observable<Withdrawal[]> {
    return this.http.get<Withdrawal[]>(`${this.url}?status=${status}`);
  }
  findByUserIdAndStatus(userId: string | number, status: string): Observable<Withdrawal[]> {
    return this.http.get<Withdrawal[]>(`${this.url}?userId=${userId}&status=${status}`);
  }
  findByMethod(method: string): Observable<Withdrawal[]> {
    return this.http.get<Withdrawal[]>(`${this.url}?method=${method}`);
  }
  findPending(): Observable<Withdrawal[]> {
    return this.http.get<Withdrawal[]>(`${this.url}?status=pending`);
  }
}