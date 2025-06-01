import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoringService } from '../../services/scoring.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css'], // corregido styleUrls
})
export class DatosComponent {
  edad: number = 0;
  ingreso: number = 0;

  constructor(private scoring: ScoringService, private router: Router) {}

  enviar() {
    if (this.edad <= 0 || this.ingreso <= 0) {
      alert('Edad e ingreso deben ser mayores a 0');
      return;
    }

    this.scoring
      .enviarDatos({ edad: this.edad, ingreso: this.ingreso })
      .subscribe({
        next: () => {
          localStorage.setItem('edad', this.edad.toString());
          localStorage.setItem('ingreso', this.ingreso.toString());
          alert('Datos enviados');
          this.router.navigate(['/foto']);
        },
        error: (err) => {
          console.error('Error al enviar datos:', err);
          alert('Error al enviar datos');
        },
      });
  }
}
