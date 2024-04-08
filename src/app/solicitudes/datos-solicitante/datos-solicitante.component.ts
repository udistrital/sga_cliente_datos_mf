import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Solicitante } from 'src/data/models/solicitante';

@Component({
  selector: 'ngx-datos-solicitante',
  templateUrl: './datos-solicitante.component.html',
  styleUrls: ['../solicitudes.component.scss'],
})
export class DatosSolicitanteComponent implements OnInit {

  datosSolicitante: FormGroup;
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

  constructor(private translate: TranslateService,
    private formBuilder: FormBuilder) {
    this.datosSolicitante = this.formBuilder.group({
      nombre: new FormControl(this._solicitante?.Nombre, [Validators.required]),
      codigo: new FormControl(this._solicitante?.Codigo, [Validators.required]),
      carrera: new FormControl(this._solicitante?.Carrera, [Validators.required]),
      telefono: new FormControl(this._solicitante?.Telefono, [Validators.required]),
      correo_inst: new FormControl(this._solicitante?.CorreoInstitucional, [Validators.required]),
      correo_personal: new FormControl(this._solicitante?.CorreoPersonal, [Validators.required])
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

}
