import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '@app/services/auth.service'

export const isUserLoggedGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService)

  if (!authService.isLogged) {
    return router.createUrlTree([''], {
      queryParams: { returnUrl: state.url }
    })
  }

  return true
}
