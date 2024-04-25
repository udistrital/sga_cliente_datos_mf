import { Injectable } from '@angular/core';
import { RequestManager } from 'src/app/managers/request_manager';

@Injectable({
  providedIn: 'root',
})

export class SgaMidTercerosService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('TERCEROS_SERVICE');
  }

  get(endpoint) {
    this.requestManager.setPath('TERCEROS_SERVICE');
    return this.requestManager.get(endpoint);
  }

  post(endpoint, element) {
    this.requestManager.setPath('TERCEROS_SERVICE');
    return this.requestManager.post(endpoint, element);
  }

  put(endpoint, element) {
    this.requestManager.setPath('TERCEROS_SERVICE');
    return this.requestManager.put(endpoint, element);
  }

  delete(endpoint, element) {
    this.requestManager.setPath('TERCEROS_SERVICE');
    return this.requestManager.delete(endpoint, element.Id);
  }
}
