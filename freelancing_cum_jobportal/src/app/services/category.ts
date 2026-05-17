import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private url = 'http://localhost:3000/categories';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Category[]> { return this.http.get<Category[]>(this.url); }
  getById(id: string | number): Observable<Category> { return this.http.get<Category>(`${this.url}/${id}`); }
  save(c: Category): Observable<Category> { return this.http.post<Category>(this.url, c); }
  update(id: string | number, c: Category): Observable<Category> { return this.http.put<Category>(`${this.url}/${id}`, c); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByName(name: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.url}?name_like=${name}`);
  }
}