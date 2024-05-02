import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SolicitudesComponent } from "./solicitudes.component";
import { ListSolicitudesEstudianteComponent } from "./list-solicitudes-estudiante/list-solicitudes-estudiante.component";
import { AuthGuard } from "../_guards/auth.guard";
import { ActualizacionDatosComponent } from "./actualizacion-datos/actualizacion-datos.component";
import { DatosSolicitanteComponent } from "./datos-solicitante/datos-solicitante.component";
import { ViewSolicitudesComponent } from "./view-solicitudes/view-solicitudes.component";
import { ActualizacionNombresComponent } from "./actualizacion-nombres/actualizacion-nombres.component";

const routes: Routes = [{
    path: '',
    component: SolicitudesComponent,
    children: [
        {
            path: 'list-solicitudes-estudiante',
            component: ListSolicitudesEstudianteComponent,
        },
        {
            path: 'ver-solicitudes',
            component: ViewSolicitudesComponent,
        }
    ],
}];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ],
})
export class SolicitudesRoutingComponent { }

export const routedComponents = [
    SolicitudesComponent,
    ListSolicitudesEstudianteComponent,
    ActualizacionDatosComponent,
    DatosSolicitanteComponent,
    ViewSolicitudesComponent,
    ActualizacionNombresComponent
]