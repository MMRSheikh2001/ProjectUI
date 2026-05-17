import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PasswordReset } from '../models/password-reset';

@Injectable({ providedIn: 'root' })
export class PasswordResetService {
  private url = 'http://localhost:3000/passwordResets';
  constructor(private http: HttpClient) { }

  findAll(): Observable<PasswordReset[]> { return this.http.get<PasswordReset[]>(this.url); }
  getById(id: string): Observable<PasswordReset> { return this.http.get<PasswordReset>(`${this.url}/${id}`); }
  save(r: PasswordReset): Observable<PasswordReset> { return this.http.post<PasswordReset>(this.url, r); }
  update(id: string, r: PasswordReset): Observable<PasswordReset> { return this.http.put<PasswordReset>(`${this.url}/${id}`, r); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string): Observable<PasswordReset[]> {
    return this.http.get<PasswordReset[]>(`${this.url}?userId=${userId}`);
  }
  findByToken(token: string): Observable<PasswordReset[]> {
    return this.http.get<PasswordReset[]>(`${this.url}?resetToken=${token}`);
  }
  findUnusedByUserId(userId: string): Observable<PasswordReset[]> {
    return this.http.get<PasswordReset[]>(`${this.url}?userId=${userId}&used=false`);
  }
}