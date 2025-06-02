import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  nombre = '';
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    const usuario = {
      nombre: this.nombre,
      email: this.email,
      password: this.password,
    };

    this.auth.register(usuario).subscribe({
      next: (res: any) => {
        alert(res.mensaje); // ✅ muestra "Usuario registrado con éxito"
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 400 && typeof err.error === 'string') {
          alert(err.error); // ejemplo: "El correo ya está siendo utilizado"
        } else {
          alert('Error inesperado: ' + err.message);
        }
      },
    });
  }
}
