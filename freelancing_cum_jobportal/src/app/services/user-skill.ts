import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSkill } from '../models/user-skill';

@Injectable({ providedIn: 'root' })
export class UserSkillService {
  private url = 'http://localhost:3000/userSkills';
  constructor(private http: HttpClient) { }

  findAll(): Observable<UserSkill[]> { return this.http.get<UserSkill[]>(this.url); }
  getById(id: string): Observable<UserSkill> { return this.http.get<UserSkill>(`${this.url}/${id}`); }
  save(skill: UserSkill): Observable<UserSkill> { return this.http.post<UserSkill>(this.url, skill); }
  update(id: string, skill: UserSkill): Observable<UserSkill> { return this.http.put<UserSkill>(`${this.url}/${id}`, skill); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByUserId(userId: string): Observable<UserSkill[]> {
    return this.http.get<UserSkill[]>(`${this.url}?userId=${userId}`);
  }
  findBySkillName(skillName: string): Observable<UserSkill[]> {
    return this.http.get<UserSkill[]>(`${this.url}?skillName_like=${skillName}`);
  }
}