import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  /**
   * Realiza el login con email y contraseña
   */
  login(data: {
    email: string;
    password: string;
  }): Observable<{ token: string; nombre: string }> {
    return this.http.post<{ token: string; nombre: string }>(
      `${this.baseUrl}/login`,
      data
    );
  }

  /**
   * Registra un nuevo usuario
   */
  register(data: {
    nombre: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  /**
   * Guarda el token JWT en localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Obtiene el token JWT del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Elimina el token al cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('token');
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  editarUsuario(datos: { nombre: string; email: string }) {
    return this.http.put('http://localhost:8080/auth/editar-usuario', datos);
  }
}
