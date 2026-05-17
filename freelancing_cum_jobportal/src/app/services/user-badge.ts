import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserBadge } from '../models/user-badge';

@Injectable({ providedIn: 'root' })
export class UserBadgeService {
  private url = 'http://localhost:3000/userBadges';
  constructor(private http: HttpClient) { }

  findAll(): Observable<UserBadge[]> { return this.http.get<UserBadge[]>(this.url); }
  getById(id: string): Observable<UserBadge> { return this.http.get<UserBadge>(`${this.url}/${id}`); }
  save(ub: UserBadge): Observable<UserBadge> { return this.http.post<UserBadge>(this.url, ub); }
  update(id: string, ub: UserBadge): Observable<UserBadge> { return this.http.put<UserBadge>(`${this.url}/${id}`, ub); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string): Observable<UserBadge[]> {
    return this.http.get<UserBadge[]>(`${this.url}?userId=${userId}`);
  }
  findByBadgeId(badgeId: string): Observable<UserBadge[]> {
    return this.http.get<UserBadge[]>(`${this.url}?badgeId=${badgeId}`);
  }
  findByUserIdAndBadgeId(userId: string, badgeId: string): Observable<UserBadge[]> {
    return this.http.get<UserBadge[]>(`${this.url}?userId=${userId}&badgeId=${badgeId}`);
  }
}