import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PopUpManager } from '../../managers/popup_manager';
import { TercerosMidService } from 'src/data/services/terceros_mid.service';
import { TercerosService } from 'src/data/services/terceros.service';
import { UserService } from 'src/data/services/user.service';
import {
  FORM_ASPIRANTE_ADICIONALES,
  FORM_ASPIRANTE_BASICOS,
  FORM_ASPIRANTE_IDENTIFICACION,
} from './form-aspirante';

type Grupo = 'basicos' | 'identificacion' | 'adicionales';

@Component({
  selector: 'view-aspirantes',
  templateUrl: './aspirantes.component.html',
  styleUrls: ['./aspirantes.component.scss'],
})
export class AspirantesComponent implements OnInit {
  formBasicos: any;
  formIdentificacion: any;
  formAdicionales: any;

  info_info_persona: any;
  info_persona_id: number | null = null;
  loading = true;
  tiposDocumento: any[] = [];

  editing: Record<Grupo, boolean> = {
    basicos: false,
    identificacion: false,
    adicionales: false,
  };

  constructor(
    private tercerosMidService: TercerosMidService,
    private tercerosService: TercerosService,
    private userService: UserService,
    private popUpManager: PopUpManager,
    private translate: TranslateService,
  ) {}

  async ngOnInit() {
    const tipos = await this.tercerosService.get('tipo_documento?&limit=0').toPromise();
    this.tiposDocumento = Array.isArray(tipos) ? tipos : [];

    this.formBasicos = JSON.parse(JSON.stringify(FORM_ASPIRANTE_BASICOS));
    this.formIdentificacion = JSON.parse(
      JSON.stringify(FORM_ASPIRANTE_IDENTIFICACION),
    );
    this.formAdicionales = JSON.parse(
      JSON.stringify(FORM_ASPIRANTE_ADICIONALES),
    );
    this.construirForm(this.formBasicos, 'aspirantes.titulo_basicos');
    this.construirForm(
      this.formIdentificacion,
      'aspirantes.titulo_identificacion',
    );
    this.construirForm(this.formAdicionales, 'aspirantes.titulo_adicionales');

    const campoTipoIdentificacion = this.formIdentificacion.campos.find(
      (c: any) => c.nombre === 'TipoIdentificacion',
    );
    if (campoTipoIdentificacion) {
      campoTipoIdentificacion.opciones = this.tiposDocumento;
    }

    this.info_persona_id = await this.userService.getPersonaId();
    await this.loadInfoPersona();
  }

  construirForm(form: any, tituloKey: string) {
    for (let i = 0; i < form.campos.length; i++) {
      form.campos[i].label = this.translate.instant(
        'aspirantes.' + form.campos[i].label_i18n,
      );
      form.campos[i].placeholder = this.translate.instant(
        'aspirantes.' + form.campos[i].placeholder_i18n,
      );
    }
    form.titulo = this.translate.instant(tituloKey);
    form.btn = '';
  }

  getForm(grupo: Grupo): any {
    if (grupo === 'basicos') return this.formBasicos;
    if (grupo === 'identificacion') return this.formIdentificacion;
    return this.formAdicionales;
  }

  modificar(grupo: Grupo) {
    this.editing[grupo] = true;
    this.setEditing(grupo, true);
  }

  guardar(grupo: Grupo) {
    const form = this.getForm(grupo);
    const data: any = {};
    form.campos.forEach((c: any) => (data[c.nombre] = c.valor));
    console.log(`Guardar cambios [${grupo}]:`, data);
    this.editing[grupo] = false;
    this.setEditing(grupo, false);
    if (grupo == 'basicos') {
      this.actualizarBasicos(data);
    } else if (grupo == 'identificacion') {
      this.actualizarIdentificacion(data);
    } else if (grupo == 'adicionales') {
      this.actualizarAdicionales(data);
    } else {
      console.log("No se ha seleccionado un grupo correcto para actualizar");
    }
  }

  async actualizarBasicos (data) {
    if (this.info_persona_id === null || this.info_persona_id === undefined) {
      this.loading = false;
      this.popUpManager.showAlert(
        '',
        this.translate.instant('aspirantes.no_persona'),
      );
      return;
    }

    this.tercerosService.get('tercero/' + this.info_persona_id).subscribe({
      next: (res: any) => {
        
        let basic_data = res;
        basic_data.PrimerNombre = data.PrimerNombre;
        basic_data.SegundoNombre = data.SegundoNombre;
        basic_data.PrimerApellido = data.PrimerApellido;
        basic_data.SegundoApellido = data.SegundoApellido;
        basic_data.FechaNacimiento = data.FechaNacimiento;

        console.log(basic_data);
        this.tercerosService.put('tercero/', basic_data).subscribe({
          next: (response: any) => {
            // console.log('Tercero actualizado:', response);
            this.popUpManager.showSuccessAlert(this.translate.instant('aspirantes.exito'));
          },
          error: (error: any) => {
            console.error('Error actualizando tercero:', error);
            this.popUpManager.showErrorToast(this.translate.instant('aspirantes.error'));
          }
        });
      },
      error: (error: any) => {
        console.error('Error consultando tercero:', error);
        this.popUpManager.showErrorToast(this.translate.instant('aspirantes.error'));
      }
    });
    
  }

  async actualizarIdentificacion (data) {
    if (this.info_persona_id === null || this.info_persona_id === undefined) {
      this.loading = false;
      this.popUpManager.showAlert(
        '',
        this.translate.instant('aspirantes.no_persona'),
      );
      return;
    }

    this.tercerosService.get('datos_identificacion?query=Activo:True,Numero:'+ data.NumeroIdentificacion +',TerceroId__Id:' + this.info_persona_id).subscribe({
      next: (res: any) => {
        let data_id = res[0];
        const nuevoTipoDocumento = {
          Id: data.TipoIdentificacion.Id
        }
        
        data_id.FechaExpedicion = data.FechaExpedicion;
        data_id.NumeroIdentificacion = data.NumeroIdentificacion;
        data_id.TipoDocumentoId = nuevoTipoDocumento;

        this.tercerosService.put('datos_identificacion/', data_id).subscribe({
            next: (response: any) => {
              console.log('Identificación actualizada:', response);
              this.popUpManager.showSuccessAlert(this.translate.instant('aspirantes.exito'));
            },
            error: (error: any) => {
              console.error('Error actualizando identificación:', error);
              this.popUpManager.showErrorToast(this.translate.instant('aspirantes.error'));
            }
        });
      },
      error: (error: any) => {
        console.error('Error consultando identificación:', error);
        this.popUpManager.showErrorToast(this.translate.instant('aspirantes.error'));
      }
    });
  }

  async actualizarAdicionales (data) {
    if (this.info_persona_id === null || this.info_persona_id === undefined) {
      this.loading = false;
      this.popUpManager.showAlert(
        '',
        this.translate.instant('aspirantes.no_persona'),
      );
      return;
    }
    this.tercerosService.get(
      'info_complementaria_tercero?query=Activo:True,InfoComplementariaId.CodigoAbreviacion:TELEFONO,TerceroId__Id:' + this.info_persona_id + '&sortby=Id&order=desc'
    ).subscribe({
      next: (res: any) => {
        if (!res || res.length === 0) {
            console.warn("No se encontraron datos de teléfono para actualizar.");
            console.error('Error consultando datos telefonicos:', res);
            this.popUpManager.showErrorToast(this.translate.instant('aspirantes.error'));
            this.loading = false; 
            return;
        }
        const telefono = res[0];
        console.log("Datos originales");
        
        console.log(telefono)
        const nuevo_telefono_tercero = {Id: telefono.TerceroId.Id};
        const nuevo_info_complementario = {Id: telefono.InfoComplementariaId.Id };
        let telefono_payload = JSON.parse(JSON.stringify(res[0]));

        try {
          telefono_payload.TerceroId = nuevo_telefono_tercero;
          telefono_payload.InfoComplementariaId = nuevo_info_complementario;

          let datos_objeto: any = JSON.parse(telefono.Dato);
          datos_objeto.principal = data.Telefono;
          let nuevos_datos_objeto: any = JSON.stringify(datos_objeto);
          telefono_payload.Dato = nuevos_datos_objeto;

          console.log("Datos nuevos a ser almacenados");
          console.log(telefono_payload);
        } catch (error) {
          console.error('Error modificando datos adicionales:', error);
          this.popUpManager.showErrorToast(this.translate.instant('aspirantes.error'));
        }

        this.tercerosService.put('info_complementaria_tercero', telefono_payload).subscribe({
          next: (res:any) => {
            // asdf
          },
          error: () => {}
        })
        
      },
      error: (error: any) => {
        console.error('Error consultando datos:', error);
        this.popUpManager.showErrorToast(this.translate.instant('aspirantes.error'));
      }
    });
  }

  private setEditing(grupo: Grupo, enabled: boolean) {
    const form = this.getForm(grupo);
    form.campos.forEach((c: any) => (c.deshabilitar = !enabled));
  }

  public async loadInfoPersona() {
    if (this.info_persona_id === null || this.info_persona_id === undefined) {
      this.loading = false;
      this.popUpManager.showAlert(
        '',
        this.translate.instant('aspirantes.no_persona'),
      );
      return;
    }

    this.tercerosMidService.get('personas/' + this.info_persona_id).subscribe({
      next: (res: any) => {
        const d = res?.Data;
        if (!d) {
          this.loading = false;
          this.popUpManager.showAlert(
            '',
            this.translate.instant('aspirantes.no_data'),
          );
          return;
        }

        this.info_info_persona = {
          PrimerNombre: d.PrimerNombre ?? '',
          SegundoNombre: d.SegundoNombre ?? '',
          PrimerApellido: d.PrimerApellido ?? '',
          SegundoApellido: d.SegundoApellido ?? '',
          TipoIdentificacion: d.TipoIdentificacion ?? null,
          NumeroIdentificacion: d.NumeroIdentificacion ?? '',
          FechaExpedicion: d.FechaExpedicion ?? '',
          FechaNacimiento: d.FechaNacimiento ?? '',
          Genero: d.Genero?.Nombre ?? '',
          CorreoElectronico: d.UsuarioWSO2 ?? '',
          Telefono: d.Telefono ?? '',
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.popUpManager.showErrorToast('Error consultando terceros_mid');
      },
    });
  }
}
