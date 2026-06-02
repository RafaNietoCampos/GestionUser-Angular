import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '@app/services/auth.service'
import type { UserRole } from '@app/types/user'

export const isUserAllowedByRoleGuard: CanActivateFn = (route) => {
  const router = inject(Router)
  const authService = inject(AuthService)

  const user = authService.currentUser

  if (!user?.role) return router.createUrlTree(['/'])

  const roleList: Array<UserRole> = route.data?.['allowedRoles'] ?? []

  if (!roleList.length || roleList.includes(user.role)) return true

  return router.createUrlTree(['/'])
}
