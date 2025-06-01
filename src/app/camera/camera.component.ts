import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamModule, WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';
import { FotoService } from '../services/foto.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, WebcamModule, RouterModule],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css',
})
export class CameraComponent {
  webcamImage: WebcamImage | null = null;
  trigger: Subject<void> = new Subject<void>();

  constructor(private fotoService: FotoService, private router: Router) {}

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
        localStorage.setItem('foto', this.webcamImage!.imageAsDataUrl);
        alert(respuesta);
        this.router.navigate(['/score']);
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
