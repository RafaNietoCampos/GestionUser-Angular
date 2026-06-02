import { NgComponentOutlet } from '@angular/common'
import { Component, computed, inject, signal, ViewChild } from '@angular/core'
import { Router, RouterLink, RouterLinkActive, RouterOutlet, type Route, type Routes } from '@angular/router'
import { routes } from '@app/app.routes'
import { CostalIcon } from "@app/components/icons/costal"
import { GridIcon } from '@app/components/icons/grid'
import { LoginIcon } from "@app/components/icons/login"
import { LogoutIcon } from "@app/components/icons/logout"
import { LoginModal } from "@app/components/modals/login-modal/login-modal"
import { RegisterModal } from "@app/components/modals/register-modal/register-modal"
import { ToastComponent } from "@app/components/toast/toast"
import { AuthService } from '@app/services/auth.service'
import { ToastService } from '@app/services/toast.service'


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, LoginModal, LoginIcon, CostalIcon, LogoutIcon, RouterLink, RouterLinkActive, NgComponentOutlet, ToastComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  router = inject(Router)
  authService = inject(AuthService)
  toastService = inject(ToastService)

  @ViewChild('registerModal') registerModal!: RegisterModal
  @ViewChild('loginModal') loginModal!: LoginModal
  readonly sidebarOpen = signal(false)

  readonly sidebarState = computed(() => (this.sidebarOpen() ? 'open' : 'closed'))

  menuItems = [
    { title: 'Inicio', path: '/', data: { icon: GridIcon } },
    ...extractMenuRoutes(routes)
  ]

  openSidebar () { this.sidebarOpen.set(true) }
  closeSidebar () { this.sidebarOpen.set(false) }

  logout () {
    this.authService.logout()
    this.router.navigate(['/'])
  }

  shouldShowMenuRoute (route: Route): boolean {
    const isPublic = !route.path?.includes('account')
    const isPrivateAndRoleMatch = this.authService.isLogged
      && !isPublic
      && (!route.data?.['allowedRoles']?.length || route.data?.['allowedRoles']?.includes(this.authService.currentUser?.role))

    return isPublic || isPrivateAndRoleMatch
  }
}


function extractMenuRoutes (routes: Routes, parentPath = ''): Routes {
  const menuRoutes: Routes = []

  for (const route of routes) {
    const currentPath = route.path
      ? `${parentPath}/${route.path}`.replace('//', '/')
      : parentPath

    const routeData = route.data || {}

    // Si la ruta actual está en menú, la añadimos
    if (routeData?.['isInMenu']) {
      menuRoutes.push({
        ...route,
        path: currentPath,
      })
    }

    // Recorremos recursivamente los hijos
    if ('children' in route && route.children) {
      menuRoutes.push(...extractMenuRoutes(route.children, currentPath))
    }
  }

  return menuRoutes
}
