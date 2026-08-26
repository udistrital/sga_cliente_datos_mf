import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AspirantesComponent } from './aspirantes.component';

const routes: Routes = [{ path: '', component: AspirantesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AspirantesRoutingModule {}

export const routedComponents = [AspirantesComponent];
