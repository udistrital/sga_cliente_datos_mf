import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudesComponent } from './solicitudes.component';
import { ListSolicitudesEstudianteComponent } from './list-solicitudes-estudiante/list-solicitudes-estudiante.component';
import { ActualizacionDatosComponent } from './actualizacion-datos/actualizacion-datos.component';
import { DatosSolicitanteComponent } from './datos-solicitante/datos-solicitante.component';
import { ViewSolicitudesComponent } from './view-solicitudes/view-solicitudes.component';
import { ActualizacionNombresComponent } from './actualizacion-nombres/actualizacion-nombres.component';

const routes: Routes = [
  {
    path: 'datos-basicos',
    component: ListSolicitudesEstudianteComponent,
  },
  {
    path: 'actualizacion-datos',
    component: ViewSolicitudesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesRoutingComponent {}

export const routedComponents = [
  SolicitudesComponent,
  ListSolicitudesEstudianteComponent,
  ActualizacionDatosComponent,
  DatosSolicitanteComponent,
  ViewSolicitudesComponent,
  ActualizacionNombresComponent,
];
