import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmptyRouteComponent } from "./empty-route/empty-route.component";

export const routes: Routes = [
  {
    path: 'empty-route',
    component: EmptyRouteComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'aspirantes',
  },
  {
    path: 'actualizacion-datos',
    pathMatch: 'full',
    redirectTo: 'aspirantes',
  },
  {
    path: '',
    loadChildren: () => import('./solicitudes/solicitudes.module').then(m => m.SolicitudesModule),
  },
  {
    path: 'aspirantes',
    loadChildren: () => import ('./solicitudes/aspirantes/aspirantes.module').then(m => m.AspirantesModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: "/solicitudes/" }],
})
export class AppRoutingModule {}
