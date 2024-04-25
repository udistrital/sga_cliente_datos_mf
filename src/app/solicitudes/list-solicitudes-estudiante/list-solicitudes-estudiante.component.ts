import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popup_manager';
import { ImplicitAutenticationService } from 'src/data/services/implicit_autentication.service';
import { SgaMidService } from 'src/data/services/sga_mid.service';
import * as momentTimezone from 'moment-timezone';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'list-solicitudes-estudiante',
  templateUrl: './list-solicitudes-estudiante.component.html',
  styleUrls: ['../solicitudes.component.scss'],
})
export class ListSolicitudesEstudianteComponent implements OnInit {
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = ['Numero', 'Fecha', 'Tipo', 'Estado', 'Observacion', 'Acciones'];
  nombresColumnas = [];

  showTable: boolean;
  showSolicitudID: boolean;
  showSolicitudNombre: boolean;
  rol: any;
  listaDatos = [];

  constructor(
    private translate: TranslateService,
    private sgaMidService: SgaMidService,
    private popUpManager: PopUpManager,
    private autenticationService: ImplicitAutenticationService,
  ) {
    this.showTable = true;
    this.showSolicitudID = false;
    this.showSolicitudNombre = false;
    this.nombresColumnas["Numero"] = "solicitudes.numero";
    this.nombresColumnas["Fecha"] = "solicitudes.fecha";
    this.nombresColumnas["Tipo"] = "solicitudes.tipo";
    this.nombresColumnas["Estado"] = "solicitudes.estado";
    this.nombresColumnas["Observacion"] = "solicitudes.observacion";
    this.nombresColumnas["Acciones"] = "GLOBAL.acciones";

    this.autenticationService.getRole().then((rol)=> {
      this.rol = rol;
      if (this.rol.includes('ADMIN_SGA') || this.rol.includes('ASISTENTE_ADMISIONES')) {
        this.loadList();
      } if (this.rol.includes('ESTUDIANTE')) {
        this.loadSolicitud();
      }
      this.cargarDatosTabla([]);
    });
  }

  ngOnInit() {}

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

  async loadList() {
    for (let i = 15; i < 21; i++) {
      await this.loadSolicitudes(i);
      if (i === 20) {
        await this.loadSolicitudes(32);
        await this.loadSolicitudes(33);
      }
    }
    const listaFinal = [];
    for (let i = 0; i < this.listaDatos.length; i++) {
      listaFinal[i] = this.listaDatos[i][0];
    }
    this.cargarDatosTabla(listaFinal);
  }

  loadSolicitudes(IdEstadoTipoSolicitud: number) {
    return new Promise((resolve, reject) => {
      this.sgaMidService
        .get('solicitud_evaluacion/consultar_solicitudes/' + IdEstadoTipoSolicitud)
        .subscribe(
          (response: any) => {
            if (response.Response.Code === '200') {
              const data = <Array<any>>response.Response.Body[0].Data;
              const dataInfo = <Array<any>>[];
              data.forEach(element => {
                element.Fecha = momentTimezone
                  .tz(element.Fecha, 'America/Bogota')
                  .format('DD/MM/YYYY');
                dataInfo.push(element);
              });
              if (dataInfo !== undefined) {
                this.listaDatos.push(dataInfo);
              }
              resolve(dataInfo);
            } else if (response.Response.Code === '400') {
              this.popUpManager.showInfoToast(
                'info',
                this.translate.instant('solicitudes.error')
              );
              resolve([]);
            } else if (response.Response.Code === '404') {
              resolve([]);
            }
          },
          error => {
            this.popUpManager.showErrorToast(
              this.translate.instant('ERROR.general'),
            );
            reject(error);
          },
        );
    });
  }

  loadSolicitud() {
    const IdTercero = localStorage.getItem('persona_id');
    this.sgaMidService
      .get('solicitud_evaluacion/consultar_solicitud/' + IdTercero)
      .subscribe(
        (response: any) => {
          if (response.Response.Code === '200') {
            const data = <Array<any>>response.Response.Body[0].Response;
            const dataInfo = <Array<any>>[];
            data.forEach(element => {
              element.Fecha = momentTimezone
                .tz(element.Fecha, 'America/Bogota')
                .format('DD/MM/YYYY');
              dataInfo.push(element);
            });
            this.cargarDatosTabla(dataInfo);
          } else if (response.Response.Code === '404') {
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
            this.translate.instant('ERROR.general'),
          );
        },
      );
  }

  cargarDatosTabla(datosCargados: any[]): void {
    datosCargados.forEach(registro => {
      registro.Acciones = {
        icon: 'search',
        label: this.translate.instant('solicitudes.tooltip_ver_registro'),
        class: 'icon-primary'
      };
    })
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
