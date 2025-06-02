import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoringService } from '../../services/scoring.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { FotoService } from '../../services/foto.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, WebcamModule],
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css'], // corregido styleUrls
})
export class ResultadoComponent implements OnInit {
  score = 0;
  riesgo = '';
  nombre = '';
  email = '';
  edad: number | null = null;
  ingreso: number | null = null;
  foto = '';

  // Variables para webcam y modal
  mostrarModal = false;
  webcamImage: WebcamImage | null = null;
  trigger: Subject<void> = new Subject<void>();

  constructor(
    private scoringService: ScoringService,
    private fotoService: FotoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre') ?? '';
    this.email = localStorage.getItem('email') ?? '';
    this.edad = Number(localStorage.getItem('edad')) || null;
    this.ingreso = Number(localStorage.getItem('ingreso')) || null;
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
  actualizar() {
    // Actualiza datos en localStorage y backend si quieres
    localStorage.setItem('edad', this.edad?.toString() ?? '');
    localStorage.setItem('ingreso', this.ingreso?.toString() ?? '');
    alert('Datos actualizados.');
  }

  eliminar() {
    if (confirm('¿Seguro que quieres eliminar los datos?')) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  // --- Métodos para modal y cámara ---

  abrirModalFoto() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.webcamImage = null;
  }

  triggerSnapshot() {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }

  subirFoto() {
    if (!this.webcamImage) return;

    const blob = this.dataURItoBlob(this.webcamImage.imageAsDataUrl);

    this.fotoService.subirFoto(blob).subscribe({
      next: (respuesta) => {
        this.foto = this.webcamImage!.imageAsDataUrl;
        localStorage.setItem('foto', this.foto);
        alert(respuesta);
        this.cerrarModal();
      },
      error: (err) => {
        console.error(err);
        alert('Error al subir la foto');
      },
    });
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }
}
