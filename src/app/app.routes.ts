import { Routes } from '@angular/router'
import { isUserLoggedGuard } from '@app/guards/is-user-logged'
import { PasosBandas } from '@app/pages/private/pasos-bandas/pasos-bandas'
import { Profile } from '@app/pages/private/profile/profile'

import { CalendarIcon } from '@app/components/icons/calendar'
import { FoldersIcon } from '@app/components/icons/folders'
import { MusicIcon } from '@app/components/icons/music'
import { UsersIcon } from '@app/components/icons/users'
import { USER_ROLE } from '@app/constants/user-role'
import { isUserAllowedByRoleGuard } from '@app/guards/is-user-allowed-by-role'
import { LayoutComponent } from '@app/layout/layout.component'
import { AdminEvents } from '@app/pages/private/events-dashboard/events-dashboard'
import { AdminGrupos } from '@app/pages/private/grupos-dashboard/grupos-dashboard'
import { NewsPaper } from '@app/pages/private/posts-dashboard/posts-dashboard'
import { Users } from '@app/pages/private/users/users'
import { Events } from '@app/pages/public/events/events'
import { Home } from '@app/pages/public/home/home'
import { PostDetail } from '@app/pages/public/news-detail/news-detail'
import { NotFound } from '@app/pages/public/not-found/not-found'

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'account',
        data: { isInMenu: false },
        canActivateChild: [isUserLoggedGuard, isUserAllowedByRoleGuard],
        children: [
          {
            title: 'Mi perfil',
            path: 'profile',
            component: Profile,
            data: { isInMenu: false }
          },
          {
            title: 'Grupos de la Hermandad',
            path: 'pasos-bandas',
            component: PasosBandas,
            data: {
              isInMenu: true,
              icon: MusicIcon,
            }
          },
          {
            title: 'Administar Grupos',
            path: 'grupos-dashboard',
            component: AdminGrupos,
            data: {
              allowedRoles: [USER_ROLE.ADMIN, USER_ROLE.JUNTA],
              isInMenu: true,
              icon: MusicIcon
            }
          },
          {
            title: 'Gestión de Usuarios',
            path: 'users',
            component: Users,
            data: {
              allowedRoles: [USER_ROLE.ADMIN, USER_ROLE.JUNTA],
              isInMenu: true,
              icon: UsersIcon,
            }
          },
          {
            title: 'Administar Noticias',
            path: 'posts-dashboard',
            component: NewsPaper,
            data: {
              allowedRoles: [USER_ROLE.ADMIN, USER_ROLE.JUNTA],
              isInMenu: true,
              icon: FoldersIcon
            }
          },
          {
            title: 'Administar Eventos',
            path: 'events-dashboard',
            component: AdminEvents,
            data: {
              allowedRoles: [USER_ROLE.ADMIN, USER_ROLE.JUNTA, USER_ROLE.CAPATAZ],
              isInMenu: true,
              icon: CalendarIcon
            }
          }
        ]
      },
      {
        title: 'Eventos',
        path: 'events',
        component: Events,
        data: {
          isInMenu: true,
          icon: CalendarIcon,
        }
      },
      { path: 'news/:id', component: PostDetail, data: { isInMenu: false } },
      { path: '', component: Home, data: { isInMenu: false } },
      { path: '**', component: NotFound, data: { isInMenu: false } },
    ],
  },
]

/**
 * ¿Próximamente?
 * {
        title: 'Gestión de Costaleros',
        path: 'sections',
        component: Sections,
        data: {
          allowedRoles: [USER_ROLE.ADMIN, USER_ROLE.JUNTA, USER_ROLE.CAPATAZ],
          isInMenu: true,
          icon: FoldersIcon,
        }
      }
 */
