import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SolicitudesComponent } from "./solicitudes.component";
import { ListSolicitudesEstudianteComponent } from "./list-solicitudes-estudiante/list-solicitudes-estudiante.component";
import { AuthGuard } from "../_guards/auth.guard";

const routes: Routes = [{
    path: '',
    component: SolicitudesComponent,
    children: [
        {
            path: 'list-solicitudes-estudiante',
            component: ListSolicitudesEstudianteComponent,
//            canActivate: [AuthGuard],
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
    ListSolicitudesEstudianteComponent
]