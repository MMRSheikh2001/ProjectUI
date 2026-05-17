import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GigPackage } from '../models/gig-package';

@Injectable({ providedIn: 'root' })
export class GigPackageService {
  private url = 'http://localhost:3000/gigPackages';
  constructor(private http: HttpClient) { }

  findAll(): Observable<GigPackage[]> { return this.http.get<GigPackage[]>(this.url); }
  getById(id: string | number): Observable<GigPackage> { return this.http.get<GigPackage>(`${this.url}/${id}`); }
  save(pkg: GigPackage): Observable<GigPackage> { return this.http.post<GigPackage>(this.url, pkg); }
  update(id: string | number, pkg: GigPackage): Observable<GigPackage> { return this.http.put<GigPackage>(`${this.url}/${id}`, pkg); }
  delete(id: string | number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }

  findByGigId(gigId: string | number): Observable<GigPackage[]> {
    return this.http.get<GigPackage[]>(`${this.url}?gigId=${gigId}`);
  }
  findByName(name: string): Observable<GigPackage[]> {
    return this.http.get<GigPackage[]>(`${this.url}?name=${name}`);
  }
  findByGigIdAndName(gigId: string, name: string): Observable<GigPackage[]> {
    return this.http.get<GigPackage[]>(`${this.url}?gigId=${gigId}&name=${name}`);
  }
  findByMaxPrice(maxPrice: number): Observable<GigPackage[]> {
    return this.http.get<GigPackage[]>(`${this.url}?price_lte=${maxPrice}`);
  }
}