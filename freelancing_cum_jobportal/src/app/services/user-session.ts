import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSession } from '../models/user-session';
import { switchMap, forkJoin, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserSessionService {
  private url = 'http://localhost:3000/userSessions';
  constructor(private http: HttpClient) { }

  findAll(): Observable<UserSession[]> { return this.http.get<UserSession[]>(this.url); }
  getById(id: string | number): Observable<UserSession> { return this.http.get<UserSession>(`${this.url}/${id}`); }
  save(session: UserSession): Observable<UserSession> { return this.http.post<UserSession>(this.url, session); }
  update(id: string | number, session: UserSession): Observable<UserSession> { return this.http.put<UserSession>(`${this.url}/${id}`, session); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string | number): Observable<UserSession[]> {
    return this.http.get<UserSession[]>(`${this.url}?userId=${userId}`);
  }
  findByToken(token: string): Observable<UserSession[]> {
    return this.http.get<UserSession[]>(`${this.url}?jwtToken=${token}`);
  }
  deleteAllByUserId(userId: string): Observable<void[]> {
    return this.findByUserId(userId).pipe(
      switchMap(sessions => {
        if (!sessions.length) return of([] as void[]);
        return forkJoin(sessions.map(s => this.delete(s.id!)));
      })
    );
  }
  findActiveByUserId(userId: string | number): Observable<UserSession[]> {
    const now = new Date().toISOString();
    // JSON Server supports _gte filters for dates:
    return this.http.get<UserSession[]>(
      `${this.url}?userId=${userId}&expiresAt_gte=${now}`
    );
  }
}