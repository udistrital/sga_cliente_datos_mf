import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RequestManager } from 'src/app/managers/request_manager';

const httpOptions = {
    headers: new HttpHeaders({
        'Accept': 'application/json',
    }),
}

const httpOptionsFile = {
    headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
    }),
}

const path = environment.SGA_MID_ACTUALIZACION_DATOS_SERVICE;

@Injectable()
export class SgaMidActualizacionDatosService {

  constructor(private requestManager: RequestManager, private http: HttpClient) {
    this.requestManager.setPath('SGA_MID_ACTUALIZACION_DATOS_SERVICE');
  }

  get(endpoint: string) {
    this.requestManager.setPath('SGA_MID_ACTUALIZACION_DATOS_SERVICE');
    return this.requestManager.get(endpoint);
  }

  post(endpoint: string, element: any) {
    this.requestManager.setPath('SGA_MID_ACTUALIZACION_DATOS_SERVICE');
    return this.requestManager.post(endpoint, element);
  }

  post_file(endpoint: string, element: any) {
    this.requestManager.setPath('SGA_MID_ACTUALIZACION_DATOS_SERVICE');
    return this.requestManager.post_file(endpoint, element);
  }

  put(endpoint: string, element: any) {
    this.requestManager.setPath('SGA_MID_ACTUALIZACION_DATOS_SERVICE');
    return this.requestManager.put(endpoint, element);
  }

  delete(endpoint: string, element: any) {
    this.requestManager.setPath('SGA_MID_ACTUALIZACION_DATOS_SERVICE');
    return this.requestManager.delete(endpoint, element.Id);
  }

}
