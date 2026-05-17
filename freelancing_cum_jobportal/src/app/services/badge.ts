import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Badge } from '../models/badge';

@Injectable({ providedIn: 'root' })
export class BadgeService {
  private url = 'http://localhost:3000/badges';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Badge[]> { return this.http.get<Badge[]>(this.url); }
  getById(id: string): Observable<Badge> { return this.http.get<Badge>(`${this.url}/${id}`); }
  save(b: Badge): Observable<Badge> { return this.http.post<Badge>(this.url, b); }
  update(id: string, b: Badge): Observable<Badge> { return this.http.put<Badge>(`${this.url}/${id}`, b); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByName(name: string): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.url}?name_like=${name}`);
  }
}