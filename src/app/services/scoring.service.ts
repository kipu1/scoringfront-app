import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScoringService {
  private baseUrl = 'http://localhost:8080/scoring';

  constructor(private http: HttpClient) {}

  enviarDatos(dto: { edad: number; ingreso: number }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token ?? ''}`,
    });

    return this.http.post(`${this.baseUrl}/datos`, dto, { headers });
  }

  obtenerScore(): Observable<{ score: number }> {
    return this.http.get<{ score: number }>(this.baseUrl);
  }
  obtenerDatos(): Observable<{
    edad: number;
    ingreso: number;
    score?: number;
  }> {
    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ edad: number; ingreso: number; score?: number }>(
      this.baseUrl,
      { headers }
    );
  }
  editarDatos(dto: { edad: number; ingreso: number }): Observable<any> {
    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(`${this.baseUrl}/datos`, dto, { headers });
  }

  eliminarDatos(): Observable<any> {
    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(this.baseUrl, { headers });
  }
}
