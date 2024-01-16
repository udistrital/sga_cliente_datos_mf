import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { getSingleSpaExtraProviders } from 'single-spa-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: APP_BASE_HREF, useValue: '/datos/' },
    getSingleSpaExtraProviders(),
    provideHttpClient(withFetch())
  ]
};
