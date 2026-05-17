import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobSkill } from '../models/job-skill';

@Injectable({ providedIn: 'root' })
export class JobSkillService {
  private url = 'http://localhost:3000/jobSkills';
  constructor(private http: HttpClient) { }

  findAll(): Observable<JobSkill[]> { return this.http.get<JobSkill[]>(this.url); }
  getById(id: string): Observable<JobSkill> { return this.http.get<JobSkill>(`${this.url}/${id}`); }
  save(skill: JobSkill): Observable<JobSkill> { return this.http.post<JobSkill>(this.url, skill); }
  update(id: string, skill: JobSkill): Observable<JobSkill> { return this.http.put<JobSkill>(`${this.url}/${id}`, skill); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByJobId(jobId: string): Observable<JobSkill[]> {
    return this.http.get<JobSkill[]>(`${this.url}?jobId=${jobId}`);
  }
  findBySkillName(skillName: string): Observable<JobSkill[]> {
    return this.http.get<JobSkill[]>(`${this.url}?skillName_like=${skillName}`);
  }
}