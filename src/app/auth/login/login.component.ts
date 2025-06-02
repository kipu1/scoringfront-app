import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        const decoded: any = jwtDecode(res.token);

        localStorage.setItem('nombre', res.nombre); // Ahora tomamos 'nombre' directamente de la respuesta
        localStorage.setItem('email', decoded.sub);
        this.router.navigate(['/datos']);
      },
      error: () => alert('Credenciales inválidas'),
    });
  }
}
