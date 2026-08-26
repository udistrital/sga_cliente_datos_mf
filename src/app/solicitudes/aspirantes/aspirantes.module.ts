import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { PopUpManager } from '../../managers/popup_manager';
import { DynamicFormModule } from '../../dynamic-form/dynamic-form.module';
import { AspirantesRoutingModule } from './aspirantes-routing.module';
import { TercerosMidService } from 'src/data/services/terceros_mid.service';
import { UserService } from 'src/data/services/user.service';
import { AspirantesComponent } from './aspirantes.component';

@NgModule({
  declarations: [AspirantesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatButtonModule,
    DynamicFormModule,
    TranslateModule,
    AspirantesRoutingModule,
  ],
  providers: [PopUpManager, TercerosMidService, UserService],
})
export class AspirantesModule {}