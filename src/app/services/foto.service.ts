import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FotoService {
  private baseUrl = 'http://localhost:8080/foto';

  constructor(private http: HttpClient) {}
  subirFoto(foto: Blob) {
    const formData = new FormData();
    formData.append('archivo', foto, 'foto.jpg');

    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.baseUrl, formData, {
      headers,
      responseType: 'text', // <-- Solución aquí
    });
  }
}
