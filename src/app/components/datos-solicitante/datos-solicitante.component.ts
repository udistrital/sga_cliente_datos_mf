import { Component,OnInit } from '@angular/core';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';


@Component({
  selector: 'sga-datos-mf-datos-solicitante',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './datos-solicitante.component.html',
  styleUrl: './datos-solicitante.component.scss'
})
export class DatosSolicitanteComponent implements OnInit {

  // datosSolicitante: any;
  // _solicitante: Solicitante;
  // loading: boolean;

  // @Input()
  // set solicitante(solicitante: Solicitante) {
  //   this.loading = true;
  //   if (solicitante !== undefined || solicitante !== this._solicitante) {
  //     this._solicitante = solicitante;
  //     if (solicitante.Id !== undefined) {
  //       this._solicitante = solicitante;
  //       this.loading = false;
  //       this.cargado.emit(true);
  //     } else {
  //       this.loading = false;
  //       this.cargado.emit(false);
  //     }
  //   }
  //   this.loading = false;
  //   this.cargado.emit(true);
  // }

  // @Output()
  // cargado = new EventEmitter<boolean>();

  constructor(
    //private translate: TranslateService
    ) {
    // this.datosSolicitante = DATOS_SOLICITANTE;
    // this.construirForm()
    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   this.construirForm();
    // });
  }

  ngOnInit() {
    // this.loading = true;
    // this._solicitante = new Solicitante();
    // this._solicitante.Carrera = '';
    // this._solicitante.Codigo = '';
    // this._solicitante.CorreoInstitucional = '';
    // this._solicitante.CorreoPersonal = '';
    // this._solicitante.Nombre = '';
    // this._solicitante.Telefono = '';
  }

  // construirForm() {
  //   this.datosSolicitante.titulo = this.translate.instant('solicitudes.solicitante');
  //   this.datosSolicitante.campos.forEach(campo => {
  //     campo.label = this.translate.instant('solicitudes.' + campo.label_i18n);
  //   })
  // }

}

