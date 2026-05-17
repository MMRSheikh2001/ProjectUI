import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionLog } from '../models/transaction-log';

@Injectable({ providedIn: 'root' })
export class TransactionLogService {
  private url = 'http://localhost:3000/transactionLogs';
  constructor(private http: HttpClient) { }

  findAll(): Observable<TransactionLog[]> { return this.http.get<TransactionLog[]>(this.url); }
  getById(id: string): Observable<TransactionLog> { return this.http.get<TransactionLog>(`${this.url}/${id}`); }
  save(log: TransactionLog): Observable<TransactionLog> { return this.http.post<TransactionLog>(this.url, log); }
  update(id: string, log: TransactionLog): Observable<TransactionLog> { return this.http.put<TransactionLog>(`${this.url}/${id}`, log); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string): Observable<TransactionLog[]> {
    return this.http.get<TransactionLog[]>(`${this.url}?userId=${userId}`);
  }
  findByAction(action: string): Observable<TransactionLog[]> {
    return this.http.get<TransactionLog[]>(`${this.url}?action=${action}`);
  }
  findByIpAddress(ipAddress: string): Observable<TransactionLog[]> {
    return this.http.get<TransactionLog[]>(`${this.url}?ipAddress=${ipAddress}`);
  }
}