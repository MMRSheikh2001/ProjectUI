import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLevel } from '../models/user-level';

@Injectable({ providedIn: 'root' })
export class UserLevelService {
  private url = 'http://localhost:3000/userLevels';
  constructor(private http: HttpClient) { }

  findAll(): Observable<UserLevel[]> { return this.http.get<UserLevel[]>(this.url); }
  getById(id: string | number): Observable<UserLevel> { return this.http.get<UserLevel>(`${this.url}/${id}`); }
  save(l: UserLevel): Observable<UserLevel> { return this.http.post<UserLevel>(this.url, l); }
  update(id: string | number, l: UserLevel): Observable<UserLevel> { return this.http.put<UserLevel>(`${this.url}/${id}`, l); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string | number): Observable<UserLevel[]> {
    return this.http.get<UserLevel[]>(`${this.url}?userId=${userId}`);
  }
  findByFreelancerLevel(level: string): Observable<UserLevel[]> {
    return this.http.get<UserLevel[]>(`${this.url}?freelancerLevel=${level}`);
  }
  findByEmployerLevel(level: string): Observable<UserLevel[]> {
    return this.http.get<UserLevel[]>(`${this.url}?employerLevel=${level}`);
  }
  findTopSellers(): Observable<UserLevel[]> {
    return this.http.get<UserLevel[]>(`${this.url}?freelancerLevel=topseller`);
  }
}