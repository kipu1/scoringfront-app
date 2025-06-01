import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoringService } from '../../services/scoring.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css'], // corregido styleUrls
})
export class ResultadoComponent implements OnInit {
  score: number = 0;
  riesgo: string = '';
  nombre = '';
  email = '';
  edad = '';
  ingreso = '';
  foto = '';

  constructor(private scoringService: ScoringService, private router: Router) {}

  ngOnInit(): void {
    this.score = 0;
    this.nombre = localStorage.getItem('nombre') ?? '';
    this.email = localStorage.getItem('email') ?? '';
    this.edad = localStorage.getItem('edad') ?? '';
    this.ingreso = localStorage.getItem('ingreso') ?? '';
    this.foto = localStorage.getItem('foto') ?? '';

    this.scoringService.obtenerScore().subscribe({
      next: (res) => {
        this.score = res.score;
        this.riesgo = this.evaluarRiesgo(this.score);
      },
      error: () => alert('Error al obtener score'),
    });
  }

  evaluarRiesgo(score: number): string {
    if (score >= 80) return 'Muy Bajo';
    if (score >= 60) return 'Bajo';
    if (score >= 40) return 'Medio';
    if (score >= 20) return 'Alto';
    return 'Muy Alto';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
