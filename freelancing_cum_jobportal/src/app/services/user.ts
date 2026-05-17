import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = 'http://localhost:3000/users';
  constructor(private http: HttpClient) { }

  findAll(): Observable<User[]> { return this.http.get<User[]>(this.url); }
  getById(id: string | number): Observable<User> { return this.http.get<User>(`${this.url}/${id}`); }
  save(user: User): Observable<User> { return this.http.post<User>(this.url, user); }
  update(id: string | number, user: User): Observable<User> { return this.http.put<User>(`${this.url}/${id}`, user); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }


  findByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?email=${email}`);
  }
  findByStatus(status: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?status=${status}`);
  }
  findVerified(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?isVerified=true`);
  }
  findUnverified(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?isVerified=false`);
  }
  findActive(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?isDeleted=false&status=active`);
  }
  searchByName(name: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?name_like=${name}`);


  }


  findByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?role=${role}`);
  }

  findAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?role=admin`);
  }
}