import { Routes } from '@angular/router';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { ListSolicitudesEstudianteComponent } from './components/list-solicitudes-estudiante/list-solicitudes-estudiante.component';
import { ViewSolicitudesComponent } from './components/view-solicitudes/view-solicitudes.component';

export const routes: Routes = [
  //{ path: '**', component: EmptyRouteComponent },
  // { path: 'datos',children:[
  //   {
  //     path: 'list-solicitudes-estudiante',
  //     component: ListSolicitudesEstudianteComponent,
  //   },
  //   {
  //     path: 'ver-solicitudes',
  //     component: ViewSolicitudesComponent,
  //   },
  // ]}
  {
    path: 'list-solicitudes-estudiante',
    component: ListSolicitudesEstudianteComponent,
  },
  {
    path: 'ver-solicitudes',
    component: ViewSolicitudesComponent,
  },
 
];
