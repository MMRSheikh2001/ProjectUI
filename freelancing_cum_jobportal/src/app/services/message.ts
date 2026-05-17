import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private url = 'http://localhost:3000/messages';
  constructor(private http: HttpClient) { }

  findAll(): Observable<Message[]> { return this.http.get<Message[]>(this.url); }
  getById(id: string | number): Observable<Message> { return this.http.get<Message>(`${this.url}/${id}`); }
  save(msg: Message): Observable<Message> { return this.http.post<Message>(this.url, msg); }
  update(id: string | number, msg: Message): Observable<Message> { return this.http.put<Message>(`${this.url}/${id}`, msg); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByChatId(chatId: string | number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.url}?chatId=${chatId}&_sort=createdAt&_order=asc`);
  }
  findBySenderId(senderId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.url}?senderId=${senderId}`);
  }
  findByChatIdAndSenderId(chatId: string, senderId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.url}?chatId=${chatId}&senderId=${senderId}`);
  }
  findByStatus(status: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.url}?status=${status}`);
  }
  findUnreadByChatId(chatId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.url}?chatId=${chatId}&status=delivered`);
  }
}