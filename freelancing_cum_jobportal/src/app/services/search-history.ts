import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchHistory } from '../models/search-history';

@Injectable({ providedIn: 'root' })
export class SearchHistoryService {
  private url = 'http://localhost:3000/searchHistory';
  constructor(private http: HttpClient) { }

  findAll(): Observable<SearchHistory[]> { return this.http.get<SearchHistory[]>(this.url); }
  getById(id: string): Observable<SearchHistory> { return this.http.get<SearchHistory>(`${this.url}/${id}`); }
  save(h: SearchHistory): Observable<SearchHistory> { return this.http.post<SearchHistory>(this.url, h); }
  update(id: string, h: SearchHistory): Observable<SearchHistory> { return this.http.put<SearchHistory>(`${this.url}/${id}`, h); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string): Observable<SearchHistory[]> {
    return this.http.get<SearchHistory[]>(`${this.url}?userId=${userId}&_sort=createdAt&_order=desc`);
  }
  findByKeyword(keyword: string): Observable<SearchHistory[]> {
    return this.http.get<SearchHistory[]>(`${this.url}?keyword_like=${keyword}`);
  }
  findRecentByUserId(userId: string): Observable<SearchHistory[]> {
    return this.http.get<SearchHistory[]>(`${this.url}?userId=${userId}&_sort=createdAt&_order=desc&_limit=10`);
  }
}