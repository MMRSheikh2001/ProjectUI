import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wallet } from '../models/wallet';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private url = 'http://localhost:3000/wallets';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Wallet[]> { return this.http.get<Wallet[]>(this.url); }
  getById(id: string | number): Observable<Wallet> { return this.http.get<Wallet>(`${this.url}/${id}`); }
  save(wallet: Wallet): Observable<Wallet> { return this.http.post<Wallet>(this.url, wallet); }
  update(id: string | number, wallet: Wallet): Observable<Wallet> { return this.http.put<Wallet>(`${this.url}/${id}`, wallet); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string | number): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.url}?userId=${userId}`);
  }
  findByMinBalance(minBalance: number): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.url}?balance_gte=${minBalance}`);
  }
}