import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
      license:
        'eyJpZCI6ImVhYTgyY2NiLTE0OTYtNGE2Yi1iNzA5LTdlZWU0N2I0ODZjOSIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODgzNjgyMTMsImV4cCI6MTgxOTkwNDIxM30.GGEUu10bXYqYaR9EiJY4nVfxctMAvb40JZdclc88k2TH4O0PIzzzyQyalW_SpI2STqK-oEfkev9Tn3rscbvrDg',
    }),
  ],
};
