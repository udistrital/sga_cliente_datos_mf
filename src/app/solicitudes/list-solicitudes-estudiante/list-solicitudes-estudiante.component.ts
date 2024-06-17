import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popup_manager';
import { SgaMidActualizacionDatosService } from 'src/data/services/sga_mid_actualizacion_datos.service';
import * as momentTimezone from 'moment-timezone';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { decrypt } from 'src/app/utils/util-encrypt';
import { ApiMidResponse } from 'src/app/models/api-mid-response.interface';
import { UserService } from 'src/data/services/user.service';

@Component({
  selector: 'list-solicitudes-estudiante',
  templateUrl: './list-solicitudes-estudiante.component.html',
  styleUrls: ['../solicitudes.component.scss'],
})
export class ListSolicitudesEstudianteComponent implements OnInit {
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = [
    'Numero',
    'Fecha',
    'Tipo',
    'Estado',
    'Observacion',
    'Acciones',
  ];
  nombresColumnas: string[] = [];

  showTable: boolean;
  showSolicitudID: boolean;
  showSolicitudNombre: boolean;
  listaDatos = [];

  constructor(
    private translate: TranslateService,
    private sgaMidActualizacionDatosService: SgaMidActualizacionDatosService,
    private popUpManager: PopUpManager,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.showTable = true;
    this.showSolicitudID = false;
    this.showSolicitudNombre = false;
    this.nombresColumnas['Numero'] = 'solicitudes.numero';
    this.nombresColumnas['Fecha'] = 'solicitudes.fecha';
    this.nombresColumnas['Tipo'] = 'solicitudes.tipo';
    this.nombresColumnas['Estado'] = 'solicitudes.estado';
    this.nombresColumnas['Observacion'] = 'solicitudes.observacion';
    this.nombresColumnas['Acciones'] = 'GLOBAL.acciones';


    try {
      const esAdmin = await this.userService.esAutorizado(['ADMIN_SGA', 'ASISTENTE_ADMISIONES']);
      if(esAdmin){
        this.cargarTodasSolicitudes();
      }
      const esEstudiante = await this.userService.esAutorizado(['ESTUDIANTE']);
      if(esEstudiante){
        this.cargarSolicitudPorIdTercero();
      }
    } catch (error) {
      this.popUpManager.showErrorToast(this.translate.instant('ERROR.general') + error);
    }
  }

  onclick(data) {
    sessionStorage.setItem('TerceroSolitud', data.TerceroId);
    sessionStorage.setItem('Solicitud', data.Numero);
    if (data.Tipo === 'Actualización de identificación') {
      this.showSolicitudID = true;
      this.showTable = false;
      this.showSolicitudNombre = false;
    } else {
      this.showSolicitudNombre = true;
      this.showSolicitudID = false;
      this.showTable = false;
    }
  }

  async cargarTodasSolicitudes() {
    for (let i = 15; i <= 20; i++) {
      await this.cargarSolicitudPorTipo(i);
    }
    await Promise.all([this.cargarSolicitudPorTipo(32), this.cargarSolicitudPorTipo(33)]);
    const listaFinal = this.listaDatos.map((data) => data[0]);
    this.cargarDatosTabla(listaFinal);
  }

  cargarSolicitudPorTipo(IdEstadoTipoSolicitud: number) {
    return new Promise((resolve, reject) => {
      this.sgaMidActualizacionDatosService
        .get('solicitudes/estados/' + IdEstadoTipoSolicitud)
        .subscribe(
          (response: ApiMidResponse<any>) => {
            if (response.Status === 200 && response.Success === true) {
              const data = <Array<any>>response.Data.Data;
              const dataInfo = <Array<any>>[];
              data.forEach((element) => {
                element.Fecha = momentTimezone
                  .tz(element.Fecha, 'America/Bogota')
                  .format('DD/MM/YYYY');
                dataInfo.push(element);
              });
              if (dataInfo !== undefined) {
                this.listaDatos.push(dataInfo);
              }
              resolve(dataInfo);
            } else if (response.Status === 400) {
              this.popUpManager.showInfoToast(
                'info',
                this.translate.instant('solicitudes.error')
              );
              resolve([]);
            } else if (response.Status === 404) {
              resolve([]);
            }
          },
          (error) => {
            this.popUpManager.showErrorToast(
              this.translate.instant('ERROR.general')
            );
            reject(error);
          }
        );
    });
  }

  async cargarSolicitudPorIdTercero() {
    const IdTercero = await this.userService.getPersonaId();
    this.sgaMidActualizacionDatosService
      .get('solicitudes/estudiantes/' + IdTercero)
      .subscribe(
        (response: any) => {
          if (response.Status === 200) {
            const data = <Array<any>>response.Data.Response;
            const dataInfo = <Array<any>>[];
            data.forEach((element) => {
              element.Fecha = momentTimezone
                .tz(element.Fecha, 'America/Bogota')
                .format('DD/MM/YYYY');
              dataInfo.push(element);
            });
            this.cargarDatosTabla(dataInfo);
          } else if (response.Status === 404) {
            this.popUpManager.showInfoToast(
              'info',
              this.translate.instant('solicitudes.no_data')
            );
          } else {
            this.popUpManager.showInfoToast(
              'info',
              this.translate.instant('solicitudes.error')
            );
          }
        },
        () => {
          this.popUpManager.showErrorToast(
            this.translate.instant('ERROR.general')
          );
        }
      );
  }

  cargarDatosTabla(datosCargados: any[]): void {
    datosCargados.forEach((registro) => {
      registro.Acciones = {
        icon: 'search',
        label: this.translate.instant('solicitudes.tooltip_ver_registro'),
      };
    });
    this.dataSource = new MatTableDataSource(datosCargados);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  activateTab() {
    this.showTable = true;
    this.showSolicitudID = false;
    this.showSolicitudNombre = false;
  }
}
