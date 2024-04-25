import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Solicitante } from 'src/data/models/solicitante';
import { DATOS_SOLICITANTE } from './form-datos-solicitante';

@Component({
  selector: 'ngx-datos-solicitante',
  templateUrl: './datos-solicitante.component.html',
  styleUrls: ['../solicitudes.component.scss'],
})
export class DatosSolicitanteComponent implements OnInit {

  datosSolicitante: any;
  _solicitante: Solicitante;

  @Input()
  set solicitante(solicitante: Solicitante) {
    if (solicitante !== undefined || solicitante !== this._solicitante) {
      this._solicitante = solicitante;
      if (solicitante.Id !== undefined) {
        this._solicitante = solicitante;
      }
    }
  }

  constructor(private translate: TranslateService) {
      this.datosSolicitante = DATOS_SOLICITANTE;
      this.construirForm()
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.construirForm();
      });
  }

  ngOnInit() {
    this._solicitante = new Solicitante();
    this._solicitante.Carrera = '';
    this._solicitante.Codigo = '';
    this._solicitante.CorreoInstitucional = '';
    this._solicitante.CorreoPersonal = '';
    this._solicitante.Nombre = '';
    this._solicitante.Telefono = '';
  }

  construirForm() {
    this.datosSolicitante.titulo = this.translate.instant('solicitudes.solicitante');
    this.datosSolicitante.campos.forEach(campo => {
      campo.label = this.translate.instant('solicitudes.' + campo.label_i18n);
    })
  }

}
