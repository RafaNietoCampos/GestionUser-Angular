import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from '@app/app.routes'

import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { authInterceptor } from '@app/interceptors/auth.interceptor'
import { AuthService } from '@app/services/auth.service'
import { CookieService } from 'ngx-cookie-service'




export const appConfig: ApplicationConfig = {
  providers: [
    CookieService,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    ),
    provideAppInitializer(() => {
      const authService = inject(AuthService)
      return authService.loadUser()
    })
  ]
}
