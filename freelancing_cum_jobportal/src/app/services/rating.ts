import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating } from '../models/rating';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private url = 'http://localhost:3000/ratings';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Rating[]> { return this.http.get<Rating[]>(this.url); }
  getById(id: string): Observable<Rating> { return this.http.get<Rating>(`${this.url}/${id}`); }
  save(r: Rating): Observable<Rating> { return this.http.post<Rating>(this.url, r); }
  update(id: string, r: Rating): Observable<Rating> { return this.http.put<Rating>(`${this.url}/${id}`, r); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByReviewedUserId(userId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.url}?reviewedUserId=${userId}`);
  }
  findByReviewerId(reviewerId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.url}?reviewerId=${reviewerId}`);
  }
  findByOrderId(orderId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.url}?orderId=${orderId}`);
  }
  findTopRatings(): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.url}?rating=5`);
  }
  findByMinRating(minRating: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.url}?rating_gte=${minRating}`);
  }
}