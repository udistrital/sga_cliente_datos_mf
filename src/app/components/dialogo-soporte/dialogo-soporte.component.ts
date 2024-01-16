import { Component,OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef} from '@angular/material/dialog'
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'sga-datos-mf-dialogo-soporte',
  standalone: true,
  imports: [MatCardModule,TranslatePipe],
  templateUrl: './dialogo-soporte.component.html',
  styleUrl: './dialogo-soporte.component.scss'
})
export class DialogoSoporteComponent implements OnInit {

  archivo: any;

  constructor(
    public dialogRef: MatDialogRef<DialogoSoporteComponent>,
  ) {
    this.dialogRef.backdropClick().subscribe(() => this.dialogRef.close());
  }

  ngOnInit() {

  }

  abrirArchivo() {

  }

  guardarArchivo() {
    this.dialogRef.close(this.archivo)

  }

  seleccionarArchivo(event:any) {

  }

}
