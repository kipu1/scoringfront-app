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
  edad!: number | null;
  ingreso!: number | null;

  constructor(private scoring: ScoringService, private router: Router) {}

  ngOnInit(): void {
    // Llamamos al backend para obtener datos guardados si existen
    this.scoring.obtenerDatos().subscribe({
      next: (data) => {
        this.edad = data.edad ?? null;
        this.ingreso = data.ingreso ?? null;
        // Opcionalmente, guardar en localStorage para sincronizar
        if (this.edad !== null)
          localStorage.setItem('edad', this.edad.toString());
        if (this.ingreso !== null)
          localStorage.setItem('ingreso', this.ingreso.toString());
      },
      error: (err) => {
        console.warn(
          'No se pudo obtener datos desde backend, puede que sea nuevo usuario o error',
          err
        );
        this.edad = null;
        this.ingreso = null;
      },
    });
  }

  enviar() {
    if (!this.edad || this.edad <= 0 || !this.ingreso || this.ingreso <= 0) {
      alert('Edad e ingreso deben ser mayores a 0');
      return;
    }

    this.scoring
      .enviarDatos({ edad: this.edad, ingreso: this.ingreso })
      .subscribe({
        next: () => {
          localStorage.setItem('edad', this.edad!.toString());
          localStorage.setItem('ingreso', this.ingreso!.toString());
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
