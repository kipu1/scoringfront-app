import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoringService } from '../../services/scoring.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { FotoService } from '../../services/foto.service';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

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

  edad: number | null = null;
  ingreso: number | null = null;
  foto = '';
  nombre: string = '';
  email: string = '';
  nuevoNombre: string = '';
  nuevoEmail: string = '';
  // Variables para webcam y modal
  mostrarModal = false;
  webcamImage: WebcamImage | null = null;
  trigger: Subject<void> = new Subject<void>();

  constructor(
    private scoringService: ScoringService,
    private fotoService: FotoService,
    private authService: AuthService,

    private router: Router
  ) {}

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre') ?? '';
    this.email = localStorage.getItem('email') ?? '';
    this.nuevoNombre = this.nombre; // <-- agregar esta línea
    this.nuevoEmail = this.email; // <-- agregar esta línea

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
    if (this.edad === null || this.ingreso === null) {
      alert('Edad e ingreso no pueden ser nulos');
      return;
    }

    this.scoringService
      .editarDatos({
        edad: this.edad,
        ingreso: this.ingreso,
      })
      .subscribe({
        next: () => {
          // Guardar en localStorage si deseas persistir en frontend
          localStorage.setItem('edad', this.edad?.toString() ?? '');
          localStorage.setItem('ingreso', this.ingreso?.toString() ?? '');

          // Vuelve a obtener el nuevo score actualizado
          this.scoringService.obtenerScore().subscribe({
            next: (res) => {
              this.score = res.score;
              this.riesgo = this.evaluarRiesgo(this.score);
              alert('Datos actualizados correctamente.');
            },
            error: () => alert('Error al obtener el nuevo score'),
          });
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar los datos en el backend');
        },
      });
  }
  actualizarTodo() {
    if (this.edad === null || this.ingreso === null) {
      alert('Edad e ingreso no pueden ser nulos');
      return;
    }
    if (!this.nuevoNombre || !this.nuevoEmail) {
      alert('Nombre y email no pueden estar vacíos');
      return;
    }

    // Actualizar datos personales primero
    this.scoringService
      .editarDatos({ edad: this.edad, ingreso: this.ingreso })
      .subscribe({
        next: () => {
          // Actualizar nombre y email después
          this.authService
            .editarUsuario({ nombre: this.nuevoNombre, email: this.nuevoEmail })
            .subscribe({
              next: () => {
                // Actualizamos localStorage con todos los datos
                localStorage.setItem('edad', this.edad?.toString() ?? '');
                localStorage.setItem('ingreso', this.ingreso?.toString() ?? '');
                this.nombre = this.nuevoNombre;
                this.email = this.nuevoEmail;
                localStorage.setItem('nombre', this.nombre);
                localStorage.setItem('email', this.email);

                // Obtener nuevo score actualizado
                this.scoringService.obtenerScore().subscribe({
                  next: (res) => {
                    this.score = res.score;
                    this.riesgo = this.evaluarRiesgo(this.score);
                    alert('Datos y usuario actualizados correctamente.');
                  },
                  error: () => alert('Error al obtener el nuevo score'),
                });
              },
              error: () => alert('Error al actualizar usuario'),
            });
        },
        error: () => alert('Error al actualizar los datos en el backend'),
      });
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
