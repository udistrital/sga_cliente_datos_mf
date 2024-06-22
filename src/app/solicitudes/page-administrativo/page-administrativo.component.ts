import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PopUpManager } from 'src/app/managers/popup_manager';
import { SgaMidActualizacionDatosService } from 'src/data/services/sga_mid_actualizacion_datos.service';
import * as momentTimezone from 'moment-timezone';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from 'src/data/services/user.service';

@Component({
  selector: 'list-solicitudes-estudiante',
  templateUrl: './page-administrativo.component.html',
  styleUrls: ['./page-administrativo.component.scss'],
})
export class PageAdministrativoComponent implements OnInit {
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = [
    'Numero',
    'Fecha',
    'Tipo',
    'Estado',
    'Observacion',
    'Acciones',
  ];
  nombresColumnas: { [key: string]: string } = {};
  tiposSolicitud: string[] = [
    'Actualización de identificación',
    'Actualización de nombre',
  ];
  estadosSolicitud: string[] = [
    'Solicitud generada',
    'Acta aprobada',
    'Rectificar',
    'Solicitud rechazada',
  ];
  filterValues: any = {
    tipo: '',
    estado: '',
    global: '',
  };
  selectedTipo: string = '';
  selectedEstado: string = '';
  filterValue: string = '';

  showTable: boolean;
  showSolicitudID: boolean;
  showSolicitudNombre: boolean;
  solicitudSeleccionada: any;
  listaDatos: any[] = [];

  constructor(
    private translate: TranslateService,
    private sgaMidActualizacionDatosService: SgaMidActualizacionDatosService,
    private popUpManager: PopUpManager,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.inicializarVariables();
    await this.cargarDatos();
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  private async cargarDatos() {
    try {
      const esAdmin = await this.userService.esAutorizado([
        'ADMIN_SGA',
        'ASISTENTE_ADMISIONES',
      ]);
      if (esAdmin) {
        await this.cargarTodasSolicitudes();
      } else {
        this.popUpManager.showAlert(
          '',
          'No tienes permisos para ver esta información'
        );
      }
    } catch (error) {
      this.popUpManager.showErrorToast(
        this.translate.instant('ERROR.general') + error
      );
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

  onclick(data: any) {
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

  async cargarTodasSolicitudes() {
    this.listaDatos = [];
    try {
      await Promise.all([
        this.cargarSolicitudPorTipo(15),
        this.cargarSolicitudPorTipo(16),
        this.cargarSolicitudPorTipo(17),
        this.cargarSolicitudPorTipo(18),
        this.cargarSolicitudPorTipo(19),
        this.cargarSolicitudPorTipo(20),
        this.cargarSolicitudPorTipo(32),
        this.cargarSolicitudPorTipo(33),
      ]);
      const listaFinal = this.listaDatos.flat();
      this.cargarDatosTabla(listaFinal);
    } catch (error) {
      this.popUpManager.showErrorToast(this.translate.instant('ERROR.general'));
    }
  }

  cargarSolicitudPorTipo(IdEstadoTipoSolicitud: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sgaMidActualizacionDatosService
        .get(`solicitudes/estados/${IdEstadoTipoSolicitud}`)
        .subscribe(
          (response: any) => {
            if (response.Status === 200 && response.Success === true) {
              const data = response.Data.Data;
              const dataInfo = data.map((element: any) => {
                element.Fecha = momentTimezone
                  .tz(element.Fecha, 'America/Bogota')
                  .format('DD/MM/YYYY');
                return element;
              });
              this.listaDatos.push(dataInfo);
              resolve();
            } else {
              resolve();
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
    try {
      const IdTercero = await this.userService.getPersonaId();
      this.sgaMidActualizacionDatosService
        .get(`solicitudes/estudiantes/${IdTercero}`)
        .subscribe(
          (response: any) => {
            if (response.Status === 200) {
              const data = response.Data.Response;
              const dataInfo = data.map((element: any) => {
                element.Fecha = momentTimezone
                  .tz(element.Fecha, 'America/Bogota')
                  .format('DD/MM/YYYY');
                return element;
              });
              this.cargarDatosTabla(dataInfo);
            } else {
              this.popUpManager.showInfoToast(
                'info',
                this.translate.instant('solicitudes.no_data')
              );
            }
          },
          () => {
            this.popUpManager.showErrorToast(
              this.translate.instant('ERROR.general')
            );
          }
        );
    } catch (error) {
      this.popUpManager.showErrorToast(
        this.translate.instant('ERROR.general') + error
      );
    }
  }

  cargarDatosTabla(datosCargados: any[]): void {
    datosCargados.forEach((registro) => {
      registro.Acciones = {
        icon: 'search',
        label: this.translate.instant('solicitudes.tooltip_ver_registro'),
      };
    });
    this.ordenarDatos(datosCargados);
    this.dataSource = new MatTableDataSource(datosCargados);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  private ordenarDatos(datos: any[]): void {
    const estadosOrden = [
      'Solicitud generada',
      'Acta aprobada',
      'Rectificar',
      'Solicitud rechazada',
    ];
    datos.forEach((dato) => {
      // Crear una propiedad de fecha para la ordenación
      dato.FechaOrden = new Date(
        dato.Fecha.split('/').reverse().join('-')
      ).getTime();
    });
    datos.sort((a, b) => {
      const estadoA = estadosOrden.indexOf(a.Estado);
      const estadoB = estadosOrden.indexOf(b.Estado);
      if (estadoA === estadoB) {
        return b.FechaOrden - a.FechaOrden;
      }
      return estadoA - estadoB;
    });
  }

  applyFilter(filterValue: string) {
    this.filterValues.global = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  applyTipoFilter(filterValue: string) {
    this.filterValues.tipo = filterValue;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  applyEstadoFilter(filterValue: string) {
    this.filterValues.estado = filterValue;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  resetFilters() {
    this.filterValues = {
      tipo: '',
      estado: '',
      global: '',
    };
    this.selectedTipo = '';
    this.selectedEstado = '';
    this.filterValue = '';
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  customFilterPredicate() {
    return (data: any, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      const isGlobalMatch = Object.keys(data).some((key) => {
        return data[key].toString().toLowerCase().includes(searchTerms.global);
      });

      const isTipoMatch = searchTerms.tipo
        ? data.Tipo === searchTerms.tipo
        : true;
      const isEstadoMatch = searchTerms.estado
        ? data.Estado === searchTerms.estado
        : true;

      return isGlobalMatch && isTipoMatch && isEstadoMatch;
    };
  }

  activateTab() {
    this.showTable = true;
    this.showSolicitudID = false;
    this.showSolicitudNombre = false;
    this.resetFilters();
    this.cargarDatos();
  }

  solicitudEnviada(event: any) {
    this.activateTab();
  }
}
