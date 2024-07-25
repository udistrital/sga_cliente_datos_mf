import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudesComponent } from './solicitudes.component';
import { PageAdministrativoComponent } from './page-administrativo/page-administrativo.component';
import { ActualizacionDatosComponent } from './actualizacion-identificacion/actualizacion-datos.component';
import { DatosSolicitanteComponent } from './datos-solicitante/datos-solicitante.component';
import { PageEstudiantesComponent } from './page-estudiantes/page-estudiantes.component';
import { ActualizacionNombresComponent } from './actualizacion-nombres/actualizacion-nombres.component';
import { AuthGuard } from '../../_guards/auth.guard';

const routes: Routes = [
  {
    path: 'datos-basicos',
    canActivate: [AuthGuard],
    component: PageAdministrativoComponent,
  },
  {
    path: 'actualizacion-datos',
    canActivate: [AuthGuard],
    component: PageEstudiantesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesRoutingComponent { }

export const routedComponents = [
  SolicitudesComponent,
  PageAdministrativoComponent,
  ActualizacionDatosComponent,
  DatosSolicitanteComponent,
  PageEstudiantesComponent,
  ActualizacionNombresComponent,
];
