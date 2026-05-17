import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterviewRound } from '../models/interview-round';

@Injectable({ providedIn: 'root' })
export class InterviewRoundService {
  private url = 'http://localhost:3000/interviewRounds';
  constructor(private http: HttpClient) { }

  findAll(): Observable<InterviewRound[]> { return this.http.get<InterviewRound[]>(this.url); }
  getById(id: string | number): Observable<InterviewRound> { return this.http.get<InterviewRound>(`${this.url}/${id}`); }
  save(r: InterviewRound): Observable<InterviewRound> { return this.http.post<InterviewRound>(this.url, r); }
  update(id: string | number, r: InterviewRound): Observable<InterviewRound> { return this.http.put<InterviewRound>(`${this.url}/${id}`, r); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByJobId(jobId: string | number): Observable<InterviewRound[]> {
    return this.http.get<InterviewRound[]>(`${this.url}?jobId=${jobId}`);
  }
  findByApplicantId(applicantId: string | number): Observable<InterviewRound[]> {
    return this.http.get<InterviewRound[]>(`${this.url}?applicantId=${applicantId}`);
  }
  findByJobIdAndApplicantId(jobId: string | number, applicantId: string | number): Observable<InterviewRound[]> {
    return this.http.get<InterviewRound[]>(`${this.url}?jobId=${jobId}&applicantId=${applicantId}`);
  }
  findByStatus(status: string): Observable<InterviewRound[]> {
    return this.http.get<InterviewRound[]>(`${this.url}?status=${status}`);
  }
  findByType(type: string): Observable<InterviewRound[]> {
    return this.http.get<InterviewRound[]>(`${this.url}?type=${type}`);
  }
  findScheduled(): Observable<InterviewRound[]> {
    return this.http.get<InterviewRound[]>(`${this.url}?status=scheduled&_sort=scheduledAt&_order=asc`);
  }
}