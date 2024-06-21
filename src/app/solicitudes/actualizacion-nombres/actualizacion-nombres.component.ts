import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ACTUALIZAR_NOMBRE } from './form-actualizacion-nombres';
import { ESTADOSMAP, RESPUESTA_SOLICITUD } from '../actualizacion-identificacion/form-respuesta-solicitud';
import { HttpErrorResponse } from '@angular/common/http';
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2';
import * as momentTimezone from 'moment-timezone';
import * as moment from 'moment';
import { RespuestaSolicitud } from 'src/data/models/respuesta-solicitud';
import { Solicitante } from 'src/data/models/solicitante';
import { ActualizacionNombre } from 'src/data/models/actualizacion-nombre';
import { PopUpManager } from 'src/app/managers/popup_manager';
import { NewNuxeoService } from 'src/data/services/new_nuxeo.service';
import { MatDialog } from '@angular/material/dialog';
import { decrypt } from 'src/app/utils/util-encrypt';
import { SgaMidActualizacionDatosService } from 'src/data/services/sga_mid_actualizacion_datos.service';
import { TercerosMidService } from 'src/data/services/terceros_mid.service';
import { TercerosService } from 'src/data/services/terceros.service';
import { UserService } from 'src/data/services/user.service';
import { ApiMidResponse } from 'src/app/models/api-mid-response.interface';
import { PutSolicitudNombre } from '../models/solicitud';

@Component({
  selector: 'actualizacion-nombres',
  templateUrl: './actualizacion-nombres.component.html',
  styleUrls: ['../solicitudes.component.scss'],
})
export class ActualizacionNombresComponent implements OnInit {
  @Input()
  set nuevaSolicitud(nuevaSolicitud: boolean) {
    if (nuevaSolicitud) {
      console.log('nuevaSolicitud', nuevaSolicitud);
      this.procesarDataSolicitud(undefined);
      this.procesarNuevaSolicitud(nuevaSolicitud);
      this.cargarDatosNuevaSolicitud();
    }
  }

  @Input()
  set dataSolicitud(dataSolicitud: any) {
    if (dataSolicitud) {
      console.log('dataSolicitud', dataSolicitud);
      this.solicitudOriginal = dataSolicitud;
      this.inicializarRespuestaSolicitud();
      this.procesarDataSolicitud(dataSolicitud);
      this.getSolicitud();
    }
  }

  @Output() solicitudEnviada: EventEmitter<boolean> = new EventEmitter();

  solicitante: Solicitante;
  solicitudForm: any;
  respuestaSolicitudForm: any = RESPUESTA_SOLICITUD;
  solicitudDatos: ActualizacionNombre;
  solicitudRespuesta: RespuestaSolicitud;
  filesUp: any;
  SoporteDocumento: any;
  solicitudNueva: Boolean;
  modificado: boolean = false;
  Admin: boolean = false;
  loading: boolean = false;
  solicitudOriginal = null;
  estadosMap=ESTADOSMAP; 

  constructor(
    private translate: TranslateService,
    private popUpManager: PopUpManager,
    private sgaMidActualizacionDatosService: SgaMidActualizacionDatosService,
    private tercerosMidService: TercerosMidService,
    private tercerosService: TercerosService,
    private newNuxeoService: NewNuxeoService,
    private userService: UserService
  ) {
    this.solicitudForm = ACTUALIZAR_NOMBRE;
    this.respuestaSolicitudForm = RESPUESTA_SOLICITUD;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.construirForm();
    });
  }

  async ngOnInit() {
    this.loading = true;
    await this.construirForm();
    this.getSolicitante();
  }

  getSolicitante() {
    console.log('getSolicitante');
    this.loading = true;
    const IdTercero = sessionStorage.getItem('TerceroSolitud');
    if (IdTercero !== undefined) {
      this.tercerosMidService
        .get('personas/' + IdTercero + '/info-solicitante')
        .subscribe((response: any) => {
          if (response.Status === 200) {
            this.solicitante = response.Data;
          } else if (response.Status === 400) {
            this.popUpManager.showErrorToast(
              this.translate.instant('ERROR.general')
            );
            this.solicitante = new Solicitante();
            this.loading = false;
          } else {
            this.solicitante = new Solicitante();
            this.solicitante.Carrera = 'Ingenieria de Sistemas';
            this.solicitante.Codigo = '20111020005';
            this.solicitante.CorreoInstitucional = 'correo@udistrital.edu.co';
            this.solicitante.CorreoPersonal = 'correo@gmail.com';
            this.solicitante.Nombre = 'Nombre de prueba';
            this.solicitante.Telefono = '+57 000-000-0000';
            this.solicitante.Id = '0';
            this.loading = false;
          }
        });
    }
  }

  getSolicitud() {
    console.log('getSolicitud');
    this.getSolicitante();
    const IdSolicitud = sessionStorage.getItem('Solicitud');
    if (IdSolicitud !== undefined) {
      this.sgaMidActualizacionDatosService
        .get('solicitudes/' + IdSolicitud)
        .subscribe(
          (response: any) => {
            if (response.Status === 200 && response.Data !== null) {
              this.solicitudForm.btn = '';
              const date = moment(
                response.Data.FechaExpedicionNuevo,
                'DD/MM/YYYY'
              ).toDate();
              this.solicitudForm.campos[
                this.getIndexForm('FechaSolicitud')
              ].valor = momentTimezone
                .tz(response.Data.FechaSolicitud, 'America/Bogota')
                .format('DD/MM/YYYY');
              this.solicitudForm.campos[
                this.getIndexForm('NombreActual')
              ].valor = response.Data.NombreActual;
              this.solicitudForm.campos[
                this.getIndexForm('NombreActual')
              ].deshabilitar = true;
              this.solicitudForm.campos[
                this.getIndexForm('ApellidoActual')
              ].valor = response.Data.ApellidoActual;
              this.solicitudForm.campos[
                this.getIndexForm('ApellidoActual')
              ].deshabilitar = true;
              this.solicitudForm.campos[
                this.getIndexForm('NombreNuevo')
              ].valor = response.Data.NombreNuevo;
              this.solicitudForm.campos[
                this.getIndexForm('NombreNuevo')
              ].deshabilitar = true;
              this.solicitudForm.campos[
                this.getIndexForm('ApellidoNuevo')
              ].valor = response.Data.ApellidoNuevo;
              this.solicitudForm.campos[
                this.getIndexForm('ApellidoNuevo')
              ].deshabilitar = true;
              this.solicitudForm.campos[
                this.getIndexForm('ButonEditar')
              ].deshabilitar = false;
              this.solicitudForm.campos[
                this.getIndexForm('Documento')
              ].deshabilitar = true;
              this.solicitudForm.Documento = response.Data.Documento;
              const files = [];
              if (this.solicitudForm.Documento + '' !== '0') {
                files.push({ Id: this.solicitudForm.Documento });
              }
              if (
                this.solicitudForm.Documento !== undefined &&
                this.solicitudForm.Documento !== null &&
                this.solicitudForm.Documento !== 0
              ) {
                this.newNuxeoService.getFiles(files).subscribe(
                  (res) => {
                    const filesResponse = <any>res;
                    console.log('FILES RESPONSE', filesResponse);

                    if (Object.keys(filesResponse).length === files.length) {
                      this.SoporteDocumento = this.solicitudForm.Documento;

                      const documentoIndex = this.getIndexForm('Documento');
                      if (documentoIndex !== -1) {
                        this.solicitudForm.campos[documentoIndex].file =
                          filesResponse[0].file;
                        this.solicitudForm.campos[documentoIndex].urlTemp =
                          filesResponse[0].url;
                        this.solicitudForm.campos[documentoIndex].valor =
                          filesResponse[0].url;
                      }
                      this.loading = false;
                    }
                  },
                  (error: HttpErrorResponse) => {
                    this.loading = false;
                    this.popUpManager.showAlert(
                      '',
                      this.translate.instant('formacion_academica.no_data')
                    );
                  }
                );
              }
              this.loading = false;
            } else if (response.Status === 404) {
              this.loading = false;
            } else if (response.Status === 400) {
              this.popUpManager.showErrorToast(
                this.translate.instant('ERROR.general')
              );
              this.loading = false;
            }
          },
          () => {
            this.popUpManager.showErrorToast(
              this.translate.instant('ERROR.general')
            );
            this.loading = false;
          }
        );
    }
  }

  enviarRespuesta(event) {
    console.log('enviarRespuesta');
    this.loading = true;
    this.solicitudRespuesta = new RespuestaSolicitud();
    this.solicitudRespuesta.SolicitudId = parseInt(
      sessionStorage.getItem('Solicitud'),
      10
    );
    this.solicitudRespuesta.Observacion =
      this.respuestaSolicitudForm.campos[
        this.getIndexForm('Observacion')
      ].valor;

    const estadoSolicitud: string | null = this.respuestaSolicitudForm.campos[1]
      .valor
      ? this.respuestaSolicitudForm.campos[1].valor
      : null;

    switch (estadoSolicitud) {
      case RESPUESTA_SOLICITUD.campos[1].opciones.Aprobado:
        this.solicitudRespuesta.Estado = 9;
        this.solicitudRespuesta.Aprobado = true;
        break;
      case RESPUESTA_SOLICITUD.campos[1].opciones.Rechazado:
        this.solicitudRespuesta.Estado = 11;
        this.solicitudRespuesta.Aprobado = false;
        break;
      case RESPUESTA_SOLICITUD.campos[1].opciones.Rectificar:
        this.solicitudRespuesta.Estado = 17;
        this.solicitudRespuesta.Aprobado = false;
        break;
      default:
        this.popUpManager.showInfoToast('No seleccionado el tipo de respuesta');
        return;
    }

    this.sgaMidActualizacionDatosService
      .post('solicitudes/evoluciones', this.solicitudRespuesta)
      .subscribe(
        (response: any) => {
          if (response.Status === 200) {
            this.loading = false;
            this.getSolicitud();
            Swal.fire({
              icon: 'success',
              title: this.translate.instant('GLOBAL.operacion_exitosa'),
              text: this.translate.instant('solicitudes.respuesta'),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            }).then((willDelete) => {
              if (willDelete.value) {
                this.solicitudEnviada.emit(true);
              }
            });
            this.getSolicitud();
          } else if (response.Status === 400) {
            this.loading = false;
            this.popUpManager.showErrorToast(
              this.translate.instant('solicitudes.error')
            );
          }
        },
        () => {
          this.loading = false;
          this.popUpManager.showErrorToast(
            this.translate.instant('ERROR.general')
          );
        }
      );
  }

  loadInfoNueva() {
    console.log('loadInfoNueva');
    const IdSolcitud = localStorage.getItem('Solicitud');
    this.SoporteDocumento = [];
    this.sgaMidActualizacionDatosService
      .get('solicitudes/' + IdSolcitud)
      .subscribe(
        (response: any) => {
          if (response.Status === 200) {
            this.solicitudForm.campos[this.getIndexForm('NombreNuevo')].valor =
              response.Data.Resultado.NombreNuevo;
            this.solicitudForm.campos[
              this.getIndexForm('NombreNuevo')
            ].deshabilitar = true;
            this.solicitudForm.campos[
              this.getIndexForm('ApellidoNuevo')
            ].valor = response.Data.Resultado.ApellidoNuevo;
            this.solicitudForm.campos[
              this.getIndexForm('ApellidoNuevo')
            ].deshabilitar = true;
            this.solicitudForm.Documento = response.Data.Resultado.Documento;
            const files = [];
            if (this.solicitudForm.Documento + '' !== '0') {
              files.push({ Id: this.solicitudForm.Documento });
            }
            if (
              this.solicitudForm.Documento !== undefined &&
              this.solicitudForm.Documento !== null &&
              this.solicitudForm.Documento !== 0
            ) {
              this.newNuxeoService.get(files).subscribe(
                (res) => {
                  const filesResponse = <any>res;
                  if (Object.keys(filesResponse).length === files.length) {
                    this.SoporteDocumento = this.solicitudForm.Documento;
                    this.solicitudForm.btn = '';
                    this.solicitudForm.campos[
                      this.getIndexForm('Documento')
                    ].urlTemp = filesResponse[0].url;
                    this.solicitudForm.campos[
                      this.getIndexForm('Documento')
                    ].valor = filesResponse[0].url;
                    this.loading = false;
                  }
                },
                (error: HttpErrorResponse) => {
                  this.loading = false;
                  this.popUpManager.showAlert(
                    '',
                    this.translate.instant('formacion_academica.no_data')
                  );
                }
              );
            }
          } else if (response.Status === 404) {
            this.sgaMidActualizacionDatosService
              .get('solicitudes/' + IdSolcitud + '/18')
              .subscribe(
                (response: any) => {
                  if (response.Status === 200) {
                    this.solicitudForm.campos[
                      this.getIndexForm('NombreNuevo')
                    ].valor = response.Data.Resultado.NombreNuevo;
                    this.solicitudForm.campos[
                      this.getIndexForm('NombreNuevo')
                    ].deshabilitar = true;
                    this.solicitudForm.campos[
                      this.getIndexForm('ApellidoNuevo')
                    ].valor = response.Data.Resultado.ApellidoNuevo;
                    this.solicitudForm.campos[
                      this.getIndexForm('ApellidoNuevo')
                    ].deshabilitar = true;
                    this.solicitudForm.Documento =
                      response.Data.Resultado.Documento;
                    const files = [];
                    if (this.solicitudForm.Documento + '' !== '0') {
                      files.push({ Id: this.solicitudForm.Documento });
                    }
                    if (
                      this.solicitudForm.Documento !== undefined &&
                      this.solicitudForm.Documento !== null &&
                      this.solicitudForm.Documento !== 0
                    ) {
                      this.newNuxeoService.get(files).subscribe(
                        (res) => {
                          const filesResponse = <any>res;
                          if (
                            Object.keys(filesResponse).length === files.length
                          ) {
                            this.SoporteDocumento =
                              this.solicitudForm.Documento;
                            this.solicitudForm.btn = '';
                            this.solicitudForm.campos[
                              this.getIndexForm('Documento')
                            ].urlTemp = filesResponse[0].url;
                            this.solicitudForm.campos[
                              this.getIndexForm('Documento')
                            ].valor = filesResponse[0].url;
                          }
                          this.loading = false;
                        },
                        (error: HttpErrorResponse) => {
                          this.loading = false;
                          this.popUpManager.showAlert(
                            '',
                            this.translate.instant(
                              'formacion_academica.no_data'
                            )
                          );
                        }
                      );
                    } else {
                      this.loading = false;
                    }
                  } else if (response.Status === 404) {
                    this.solicitudForm.campos[
                      this.getIndexForm('ApellidoNuevo')
                    ].deshabilitar = false;
                    this.solicitudForm.campos[
                      this.getIndexForm('ApellidoNuevo')
                    ].deshabilitar = false;
                    this.loading = false;
                  } else {
                    this.loading = false;
                    this.popUpManager.showErrorToast(
                      this.translate.instant('ERROR.general')
                    );
                  }
                },
                () => {
                  this.loading = false;
                  this.popUpManager.showErrorToast(
                    this.translate.instant('ERROR.general')
                  );
                }
              );
          } else {
            this.loading = false;
            this.popUpManager.showErrorToast(
              this.translate.instant('ERROR.general')
            );
          }
        },
        () => {
          this.loading = false;
          this.popUpManager.showErrorToast(
            this.translate.instant('ERROR.general')
          );
        }
      );
  }

  async cargarDatosNuevaSolicitud() {
    console.log('cargarDatosNuevaSolicitud');
    const TerceroId = await this.userService.getPersonaId();
    if (TerceroId !== undefined) {
      const hoy = new Date();
      this.solicitudForm.campos[this.getIndexForm('FechaSolicitud')].valor =
        hoy.getFullYear() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getDate();
      this.tercerosService.get('tercero/' + TerceroId).subscribe(
        (tercero: any) => {
          if (tercero !== undefined && tercero !== '') {
            this.solicitudForm.campos[this.getIndexForm('NombreActual')].valor =
              tercero['PrimerNombre'] + ' ' + tercero['SegundoNombre'];
            this.solicitudForm.campos[
              this.getIndexForm('ApellidoActual')
            ].valor =
              tercero['PrimerApellido'] + ' ' + tercero['SegundoApellido'];
          }
        },
        () => {
          this.popUpManager.showErrorToast(
            this.translate.instant('ERROR.general')
          );
        }
      );
    }
  }

  cargoDatos(event) {
    console.log('cargoDatos');
    this.loading = !event;
  }

  getIndexForm(nombre: String): number {
    for (let index = 0; index < this.solicitudForm.campos.length; index++) {
      const element = this.solicitudForm.campos[index];
      if (element.nombre === nombre) {
        return index;
      }
    }
    return 0;
  }

  async construirForm() {
    console.log('construirForm');
    this.solicitudForm.titulo = await this.translate.instant(
      'solicitudes.solicitud_encabezado'
    );
    this.respuestaSolicitudForm.titulo = await this.translate.instant(
      'solicitudes.solicitud_respuesta'
    );
    await this.solicitudForm.campos.forEach(async (campo) => {
      if (campo.etiqueta === 'button') {
        if (
          await this.userService.esAutorizado([
            'ADMIN_SGA',
            'ASISTENTE_ADMISIONES',
          ])
        ) {
          campo.label = this.translate.instant(
            'solicitudes.' + campo.label_i18n
          );
        } else if (await this.userService.esAutorizado(['ESTUDIANTE'])) {
          campo.label_i18n = campo.label_i18n_estudiante;
        }

        campo.info = this.translate.instant('solicitudes.' + campo.label_i18n);
      }
      campo.label = this.translate.instant('solicitudes.' + campo.label_i18n);
    });
    await this.respuestaSolicitudForm.campos.forEach((campo) => {
      campo.label = this.translate.instant('solicitudes.' + campo.label_i18n);
    });
  }

  enviarSolicitud(event) {
    console.log('enviarSolicitud', event);
    if (event.valid) {
      const opt: any = {
        title: this.translate.instant('solicitudes.enviar'),
        text: this.translate.instant('solicitudes.confirmar_envio'),
        icon: 'warning',
        buttons: true,
        dangerMode: true,
        showCancelButton: true,
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        cancelButtonText: this.translate.instant('GLOBAL.cancelar'),
      };
      Swal.fire(opt).then((willDelete) => {
        if (willDelete.value) {
          console.log('WILL DELETE VALUE', willDelete.value);
          this.loading = true;
          const files = [];
          const Solicitud: any = {};
          this.solicitudDatos = event.data;

          const documentoIndex = this.getIndexForm('Documento');
          if (this.solicitudDatos['Documento'].file !== undefined) {
            console.log('FILE', this.solicitudDatos['Documento'].file);
            files.push({
              IdDocumento: 25,
              nombre: this.userService.getPayload().sub,
              file: this.solicitudDatos['Documento'].file,
            });
          } else if (this.solicitudForm.campos[documentoIndex].file) {
            console.log('SOLICITUD FORM', this.solicitudForm.campos);
            files.push({
              IdDocumento: 25,
              nombre: this.userService.getPayload().sub,
              file: this.solicitudForm.campos[documentoIndex].file,
            });
          }

          console.log('FILES', files);

          if (files.length > 0 && files[0].file instanceof Blob) {
            this.newNuxeoService.uploadFiles(files).subscribe(
              (responseNux: any[]) => {
                console.log('RESPONSE NUX', responseNux);
                if (responseNux[0].Status === '200') {
                  this.solicitudDatos['Documento'] = responseNux[0].res.Id;
                  this.finalizarSolicitud(Solicitud);
                } else {
                  this.loading = false;
                }
              },
              (error: HttpErrorResponse) => {
                this.loading = false;
                Swal.fire({
                  icon: 'error',
                  title: error.status + '',
                  text: this.translate.instant('ERROR.' + error.status),
                  footer: this.translate.instant(
                    'informacion_academica.documento_informacion_academica_no_registrado'
                  ),
                  confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                });
              }
            );
          } else {
            // No se sube el archivo, se mantiene el ID del documento original
            this.solicitudDatos['Documento'] = this.solicitudForm.Documento;
            this.finalizarSolicitud(Solicitud);
          }
        }
      });
    }
  }

  finalizarSolicitud(Solicitud: any) {
    console.log('finalizarSolicitud');
    const hoy = new Date();
    this.solicitudDatos.FechaSolicitud = momentTimezone
      .tz(
        hoy.getFullYear() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getDate(),
        'America/Bogota'
      )
      .format('YYYY-MM-DD HH:mm:ss');
    console.log('FECHA DE SOLICITUD -->', this.solicitudDatos.FechaSolicitud);
    this.solicitudDatos.FechaSolicitud =
      this.solicitudDatos.FechaSolicitud + ' +0000 +0000';
    Solicitud.Solicitud = this.solicitudDatos;
    Solicitud.Solicitante = parseInt(
      decrypt(localStorage.getItem('persona_id')),
      10
    );
    Solicitud.TipoSolicitud = 4;

    if (this.modificado) {
      Solicitud.SolicitudPadreId = sessionStorage.getItem('Solicitud');
    }

    // Si la solicitud original es diferente de null y el estado de la solicitud original es diferente de null y la solicitud es diferente de null
    // significa que existe una solicitud, y se esta modificando
    // pero si no existe una solicitud original, se esta creando una nueva solicitud
    if (
      this.solicitudOriginal !== null &&
      this.solicitudOriginal.Estado !== null &&
      Solicitud
    ) {
      this.modificarSolicitud(Solicitud, this.solicitudOriginal.Estado);
    } else if (!this.solicitudOriginal) {
      this.crearNuevaSolicitud(Solicitud);
    }
  }

  private modificarSolicitud(solicitud, estado) {
    switch (estado) {
      case 'Solicitud generada':
        // Si el estado es solicitud generada, se modificar la solicitud original
        console.log(`MODIFCANDO SOLICITUD ORIGINAL...`, solicitud);
        this.putSolicitud(solicitud);
        break;
      case 'Rectificar':
        // Si el estado es rectificar, se debe guardar la solicitud con el estado de rectificar y crear una nueva solicitud con el estado de solicitud generada anclado a la solicitud original
        this.crearNuevaSolicitud(solicitud);
        break;
      default:
        this.popUpManager.showAlert(
          '',
          'Solicitud cerrada, no se puede realizar cambios'
        );
    }
  }

  private putSolicitud(solicitud: any) {
    // Creando estructura de datos que recibe el /solicitud [put]
    const putSolicitud: PutSolicitudNombre = {
      DatosAnteriores: {
        ApellidoActual: solicitud.Solicitud.ApellidoActual,
        NombreActual: solicitud.Solicitud.NombreActual,
      },
      DatosNuevos: {
        ApellidoNuevo: solicitud.Solicitud.ApellidoNuevo,
        NombreNuevo: solicitud.Solicitud.NombreNuevo,
      },
      DocumentoId: solicitud.Solicitud.Documento,
    };

    if (solicitud.SolicitudPadreId && solicitud.Solicitud) {
      this.sgaMidActualizacionDatosService
        .put(`solicitudes/${solicitud.SolicitudPadreId}`, putSolicitud)
        .subscribe(
          async (res: ApiMidResponse<any>) => {
            if (res.Status === 200) {
              if (res.Success) {
                try {
                  const confirm = await this.popUpManager.showConfirmAlert(
                    'Operación exitosa',
                    'Solicitud actualizada correctamente'
                  );
                  this.getSolicitud();
                } catch (error) {
                  console.error(error);
                }
              } else {
                try {
                  this.popUpManager.showErrorAlert(res.Message);
                } catch (error) {
                  console.error(error);
                }
              }
            } else {
              try {
                this.popUpManager.showErrorToast(
                  'Error al actualizar la solicitud'
                );
              } catch (error) {
                console.error(error);
              }
            }
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  private crearNuevaSolicitud(solicitud: any) {
    this.sgaMidActualizacionDatosService
      .post('solicitudes', solicitud)
      .subscribe(
        (res: any) => {
          if (res.Status === 200) {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              title: this.translate.instant('GLOBAL.operacion_exitosa'),
              text: this.translate.instant('solicitudes.crear_exito'),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            }).then((willDelete) => {
              if (willDelete.value) {
                this.solicitudEnviada.emit(true);
              }
            });
          } else {
            this.loading = false;
            this.popUpManager.showErrorToast(
              this.translate.instant('solicitudes.crear_error')
            );
          }
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: error.status + '',
            text: this.translate.instant('ERROR.' + error.status),
            footer: this.translate.instant(
              'informacion_academica.documento_informacion_academica_no_registrado'
            ),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
        }
      );
  }

  async habilitarRevision(event) {
    console.log('habilitarRevision');
    if (event.button === 'ButonEditar') {
      if (
        await this.userService.esAutorizado([
          'ADMIN_SGA',
          'ASISTENTE_ADMISIONES',
        ])
      ) {
        this.Admin = true;
      }
      if (await this.userService.esAutorizado(['ESTUDIANTE'])) {
        this.solicitudForm.campos[
          this.getIndexForm('ApellidoNuevo')
        ].deshabilitar = false;
        this.solicitudForm.campos[this.getIndexForm('Documento')].deshabilitar =
          false;
        this.solicitudForm.campos[
          this.getIndexForm('NombreNuevo')
        ].deshabilitar = false;
        this.solicitudForm.campos[
          this.getIndexForm('ButonEditar')
        ].deshabilitar = true;
        this.respuestaSolicitudForm.campos.forEach((campo) => {
          campo.deshabilitar = true;
        });
        this.respuestaSolicitudForm.btn = '';
        this.modificado = true;
        this.solicitudForm.btn = 'Actualizar';
      }
    }
  }

  private async procesarNuevaSolicitud(nuevaSolicitud: boolean) {
    console.log('procesarNuevaSolicitud');
    if (!this.solicitudForm) {
      console.error('solicitudForm is undefined');
      return;
    }

    if (!this.solicitudForm.campos) {
      console.error('solicitudForm.campos is undefined');
      return;
    }

    if (nuevaSolicitud) {
      this.solicitudForm.campos[this.getIndexForm('ApellidoNuevo')].valor = '';
      this.solicitudForm.campos[this.getIndexForm('NombreNuevo')].valor = '';
      this.solicitudForm.campos[this.getIndexForm('Documento')].urlTemp = '';
      this.solicitudForm.campos[this.getIndexForm('Documento')].valor = '';
      this.solicitudForm.campos[this.getIndexForm('ButonEditar')].ocultar =
        true;
      this.solicitudForm.btn = 'Enviar';
      this.Admin = false;

      if (await this.userService.esAutorizado(['ESTUDIANTE'])) {
        console.log('HABILITANDO CAMPOS :)');
        this.cargarDatosNuevaSolicitud();
        this.solicitudForm.campos[
          this.getIndexForm('ApellidoNuevo')
        ].deshabilitar = false;
        this.solicitudForm.campos[this.getIndexForm('Documento')].deshabilitar =
          false;
        this.solicitudForm.campos[
          this.getIndexForm('NombreNuevo')
        ].deshabilitar = false;
        this.solicitudForm.campos[
          this.getIndexForm('ButonEditar')
        ].deshabilitar = false;
        this.solicitudForm.campos[this.getIndexForm('ButonEditar')].ocultar =
          true;

        this.respuestaSolicitudForm.campos.forEach((campo) => {
          campo.deshabilitar = true;
        });
        this.loading = false;
      }
    } else {
      if (
        await this.userService.esAutorizado([
          'ADMIN_SGA',
          'ASISTENTE_ADMISIONES',
        ])
      ) {
        this.Admin = true;
      }
      if (await this.userService.esAutorizado(['ESTUDIANTE'])) {
        this.Admin = false;
      }
    }
  }

  private async procesarDataSolicitud(dataSolicitud: any | undefined) {
    console.log('procesarDataSolicitud');

    if (dataSolicitud && dataSolicitud !== undefined) {
      console.log('dataSolicitudEstado -->', dataSolicitud.Estado);
      // SOLICITUD EXISTENTE
      this.solicitudRespuesta.Observacion = dataSolicitud.Observacion;
      this.solicitudRespuesta.Estado = dataSolicitud.Estado;

      if (dataSolicitud.Estado === 'Solicitud generada') {
        this.solicitudForm.campos[this.getIndexForm('ButonEditar')].ocultar =
          false;
        this.respuestaSolicitudForm.btn = 'Enviar';
        this.respuestaSolicitudForm.campos.forEach((campo) => {
          campo.deshabilitar = false;
        });
      }

      if (dataSolicitud.Estado === 'Rectificar') {
        this.Admin = true;
        // Ocultar botón de editar
        this.solicitudForm.campos[this.getIndexForm('ButonEditar')].ocultar =
          false;
        // Deshabilitar campos de respuesta
        this.respuestaSolicitudForm.campos.forEach((campo) => {
          campo.deshabilitar = true;
        });
        // Ocultar boton de enviar
        this.respuestaSolicitudForm.btn = '';
      }

      if (dataSolicitud.Estado === 'Acta aprobada') {
        console.log('acta aprobada');
        this.Admin = true;
        // Deshabilitar campos de respuesta
        this.respuestaSolicitudForm.campos.forEach((campo) => {
          campo.deshabilitar = true;
        });
        // Ocultar botón de respuesta
        this.respuestaSolicitudForm.btn = '';
        // Ocultar boton de editar
        this.solicitudForm.campos[this.getIndexForm('ButonEditar')].ocultar =
          true;
      }

      if (dataSolicitud.Estado === 'Solicitud rechazada') {
        this.Admin = true;
        // Deshabilitar campos de respuesta
        this.respuestaSolicitudForm.campos.forEach((campo) => {
          campo.deshabilitar = true;
        });
        // Ocultar botón de respuesta
        this.respuestaSolicitudForm.btn = '';
        // Ocultar boton de editar
        this.solicitudForm.campos[this.getIndexForm('ButonEditar')].ocultar =
          true;
      }
    } else {
      // NUEVA SOLICITUD
      // Ocultar botón de editar
      this.solicitudForm.campos[this.getIndexForm('ButonEditar')].ocultar =
        true;
      this.solicitudForm.campos;
    }
  }

  private inicializarRespuestaSolicitud() {
    this.solicitudRespuesta = new RespuestaSolicitud();
    this.solicitudRespuesta.Aprobado = false;
    this.solicitudRespuesta.Observacion = '';
    this.solicitudRespuesta.SolicitudId = 0;
    this.respuestaSolicitudForm.campos[1].valor = false;
  }
}
