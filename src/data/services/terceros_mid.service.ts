import { Injectable } from '@angular/core';
import { RequestManager } from 'src/app/managers/request_manager';

@Injectable({
  providedIn: 'root',
})
export class TercerosMidService {
  constructor(private requestManager: RequestManager) {}

  private setPath() {
    this.requestManager.setPath('TERCEROS_MID_SERVICE');
  }

  get(endpoint) {
    this.setPath();
    return this.requestManager.get(endpoint);
  }

  post(endpoint, element) {
    this.setPath();
    return this.requestManager.post(endpoint, element);
  }

  put(endpoint, element) {
    this.setPath();
    return this.requestManager.put(endpoint, element);
  }

  delete(endpoint, element) {
    this.setPath();
    return this.requestManager.delete(endpoint, element.Id);
  }
}
