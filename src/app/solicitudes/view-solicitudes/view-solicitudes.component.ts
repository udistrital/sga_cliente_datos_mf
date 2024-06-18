import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import * as momentTimezone from 'moment-timezone';
import { PopUpManager } from 'src/app/managers/popup_manager';
import { decrypt } from 'src/app/utils/util-encrypt';
import { SgaMidActualizacionDatosService } from 'src/data/services/sga_mid_actualizacion_datos.service';
import { UserService } from 'src/data/services/user.service';
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2';

@Component({
  selector: 'view-solicitudes',
  templateUrl: './view-solicitudes.component.html',
  styleUrls: ['./view-solicitudes.component.scss'],
})
export class ViewSolicitudesComponent implements OnInit {
  datosSolicitudes: any[];
  estructuraTabla: any;

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
  nombresColumnas = [];

  solicitudSeleccionada: any;
  showTable: boolean;
  showSolicitudID: boolean;
  showSolicitudNombre: boolean;
  nuevaSolicitud: boolean;
  listaDatos = [];

  constructor(
    private translate: TranslateService,
    private sgaMidActualizacionDatosService: SgaMidActualizacionDatosService,
    private popUpManager: PopUpManager,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.inicializarVariables();
    this.cargarDatos();
  }

  async cargarDatos() {
    try {
      if (await this.userService.esAutorizado(['ESTUDIANTE'])) {
        this.loadSolicitud();
      } else {
        this.popUpManager.showAlert(
          '',
          "No tienes permisos para ver esta información",
      );
      }
    } catch (error) {
      console.error(error);
    }
  }

  private inicializarVariables() {
    this.showTable = true;
    this.showSolicitudID = false;
    this.showSolicitudNombre = false;
    this.nombresColumnas['Numero'] = 'solicitudes.numero';
    this.nombresColumnas['Fecha'] = 'solicitudes.fecha';
    this.nombresColumnas['Tipo'] = 'solicitudes.tipo';
    this.nombresColumnas['Estado'] = 'solicitudes.estado';
    this.nombresColumnas['Observacion'] = 'solicitudes.observacion';
    this.nombresColumnas['Acciones'] = 'GLOBAL.acciones';
  }

  onclick(data) {
    console.log("data -->",data)
    this.solicitudSeleccionada = data;
    sessionStorage.setItem('Solicitud', data.Numero);
    sessionStorage.setItem('TerceroSolitud', data.TerceroId);
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
    this.listaDatos = [];
    for (let i = 15; i < 21; i++) {
      await this.loadSolicitudes(i);
    }
    await this.loadSolicitudes(32);
    await this.loadSolicitudes(33);

    const listaFinal = [];
    for (let i = 0; i < this.listaDatos.length; i++) {
      for (let j = 0; j < this.listaDatos[i].length; j++) {
        listaFinal.push(this.listaDatos[i][j]);
      }
    }
    this.cargarDatosTabla(listaFinal);
  }

  loadSolicitudes(IdEstadoTipoSolicitud: number) {
    return new Promise((resolve, reject) => {
      this.sgaMidActualizacionDatosService
        .get('solicitudes/estados/' + IdEstadoTipoSolicitud)
        .subscribe(
          (response: any) => {
            if (response.Status === 200) {
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
              Swal.fire(
                this.translate.instant('GLOBAL.error'),
                this.translate.instant('solicitudes.error'),
                'info'
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

  async loadSolicitud() {
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
            Swal.fire(
              this.translate.instant('GLOBAL.info'),
              this.translate.instant('solicitudes.no_data'),
              'warning'
            );
          } else {
            Swal.fire(
              this.translate.instant('GLOBAL.error'),
              this.translate.instant('solicitudes.error'),
              'error'
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
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'Fecha':
          // Convert date string to Date object
          return new Date(momentTimezone(item.Fecha, 'DD/MM/YYYY').toISOString());
        case 'Numero':
          return Number(item.Numero); // Ensure Numero is treated as a number
        default:
          return item[property];
      }
    };
    this.dataSource.sortData = (data, sort) => {
      const active = sort.active;
      const direction = sort.direction;
      if (!active || direction === '') {
        return data;
      }
      return data.sort((a, b) => {
        const aDate = new Date(momentTimezone(a.Fecha, 'DD/MM/YYYY').toISOString());
        const bDate = new Date(momentTimezone(b.Fecha, 'DD/MM/YYYY').toISOString());
        const aNumero = Number(a.Numero);
        const bNumero = Number(b.Numero);
        
        // First sort by Fecha
        const dateComparison = bDate.getTime() - aDate.getTime();
        
        // If dates are equal, sort by Numero
        if (dateComparison === 0) {
          return bNumero - aNumero;
        }
        
        return dateComparison;
      });
    };
    if (this.dataSource.sort) {
      this.dataSource.sort.active = 'Fecha';
      this.dataSource.sort.direction = 'desc';
      this.dataSource.sort.sortChange.emit(); // Emit sort change event to trigger sorting
    }
  }

  consultarSolicitudes() {
    this.showTable = false;
    this.cargarDatos();
  }

  activateTab() {
    this.nuevaSolicitud = undefined;
    this.solicitudSeleccionada = undefined;
    this.showTable = true;
    this.showSolicitudID = false;
    this.showSolicitudNombre = false;
    this.nuevaSolicitud = false;
    this.cargarDatos();
  }

  nuevoNombre() {
    sessionStorage.setItem(
      'TerceroSolitud',
      decrypt(localStorage.getItem('persona_id'))
    );
    this.showSolicitudNombre = true;
    this.showSolicitudID = false;
    this.showTable = false;
    this.nuevaSolicitud = true;
  }

  nuevoID() {
    sessionStorage.setItem(
      'TerceroSolitud',
      decrypt(localStorage.getItem('persona_id'))
    );
    this.showSolicitudNombre = false;
    this.showSolicitudID = true;
    this.showTable = false;
    this.nuevaSolicitud = true;
  }
}
