import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadedFile } from '../models/file';

@Injectable({ providedIn: 'root' })
export class FileService {
  private url = 'http://localhost:3000/files';
  constructor(private http: HttpClient) { }

  findAll(): Observable<UploadedFile[]> { return this.http.get<UploadedFile[]>(this.url); }
  getById(id: string): Observable<UploadedFile> { return this.http.get<UploadedFile>(`${this.url}/${id}`); }
  save(file: UploadedFile): Observable<UploadedFile> { return this.http.post<UploadedFile>(this.url, file); }
  update(id: string, file: UploadedFile): Observable<UploadedFile> { return this.http.put<UploadedFile>(`${this.url}/${id}`, file); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByMessageId(messageId: string): Observable<UploadedFile[]> {
    return this.http.get<UploadedFile[]>(`${this.url}?messageId=${messageId}`);
  }
  findByFileType(fileType: string): Observable<UploadedFile[]> {
    return this.http.get<UploadedFile[]>(`${this.url}?fileType=${fileType}`);
  }
  findByMessageIdAndFileType(messageId: string, fileType: string): Observable<UploadedFile[]> {
    return this.http.get<UploadedFile[]>(`${this.url}?messageId=${messageId}&fileType=${fileType}`);
  }
}