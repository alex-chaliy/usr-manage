import { providePrimeNG } from 'primeng/config';

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { environment as env } from '../environments/environment';
import { NoirAuraThemePreset } from '../prime-ng/NoirAura.theme';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    providePrimeNG({
      license: env.PRIMEUI_LICENSE_KEY,
      ripple: false, // Disables click 'Ripple' animations globally
      theme: {
        preset: NoirAuraThemePreset,
        options: {
          darkModeSelector: '.app-dark' // Defines the class used for dark mode
        }
      },
    }),
  ],
};
