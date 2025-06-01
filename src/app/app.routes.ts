import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DatosComponent } from './scoring/datos/datos.component';
import { ResultadoComponent } from './scoring/resultado/resultado.component';
import { CameraComponent } from './camera/camera.component';
import { AuthGuard } from './auth/auth.guard'; // Asegúrate que la ruta coincida

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'datos', component: DatosComponent, canActivate: [AuthGuard] },
  { path: 'score', component: ResultadoComponent, canActivate: [AuthGuard] },
  { path: 'foto', component: CameraComponent, canActivate: [AuthGuard] },
];
