import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gig } from '../models/gig';

@Injectable({ providedIn: 'root' })
export class GigService {
  private url = 'http://localhost:3000/gigs';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Gig[]> { return this.http.get<Gig[]>(this.url); }
  getById(id: string | number): Observable<Gig> { return this.http.get<Gig>(`${this.url}/${id}`); }
  save(gig: Gig): Observable<Gig> { return this.http.post<Gig>(this.url, gig); }
  update(id: string | number, gig: Gig): Observable<Gig> { return this.http.put<Gig>(`${this.url}/${id}`, gig); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByFreelancerId(freelancerId: string | number): Observable<Gig[]> {
    return this.http.get<Gig[]>(`${this.url}?freelancerId=${freelancerId}&isDeleted=false`);
  }
  findByCategoryId(categoryId: string): Observable<Gig[]> {
    return this.http.get<Gig[]>(`${this.url}?categoryId=${categoryId}&isDeleted=false`);
  }
  findByStatus(status: string): Observable<Gig[]> {
    return this.http.get<Gig[]>(`${this.url}?status=${status}&isDeleted=false`);
  }
  findActiveGigs(): Observable<Gig[]> {
    return this.http.get<Gig[]>(`${this.url}?status=active&isDeleted=false`);
  }
  searchByTitle(keyword: string): Observable<Gig[]> {
    return this.http.get<Gig[]>(`${this.url}?title_like=${keyword}&isDeleted=false`);
  }
  findTopRated(): Observable<Gig[]> {
    return this.http.get<Gig[]>(`${this.url}?_sort=rating&_order=desc&isDeleted=false`);
  }
  findByCategoryAndStatus(categoryId: string, status: string): Observable<Gig[]> {
    return this.http.get<Gig[]>(`${this.url}?categoryId=${categoryId}&status=${status}`);
  }
}