import { HttpClient } from '@angular/common/http'
import { inject, Injectable, signal } from '@angular/core'
import { COOKIES } from '@app/constants/cookies'
import type { User } from '@app/types/user'
import { environment } from 'environments/environment.development'
import { CookieService } from 'ngx-cookie-service'
import { firstValueFrom, map } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private cookieService = inject(CookieService)
  private http = inject(HttpClient)

  user = signal<User | null>(null)

  get currentUser(): User | null {
    return this.user()
  }

  get isLogged(): boolean {
    return Boolean(this.user())
  }

  hasRole(role: string): boolean {
    return this.user()?.role === role
  }

  login(credentials: { email: string; password: string, rememberMe: boolean }) {
    const { email, password, rememberMe } = credentials

    return this.http.post<{ token: string; user: User }>(`${environment.apiUrl}/api/auth/login`,
      { email, password }
    ).pipe(
      map(data => {
        if (!data.token) return null

        if (!data.user.active) {
          throw new Error('ACCOUNT_INACTIVE')
        }

        this.cookieService.set(
          COOKIES.TOKEN,
          data.token,
          rememberMe ? 15 : undefined,
          '/'
        )
        this.user.set(data.user)
        return data
      })
    )
  }

  logout() {
    this.cookieService.delete(COOKIES.TOKEN)
    this.user.set(null)
  }


  async loadUser() {
    try {
      const token = this.cookieService.get(COOKIES.TOKEN)

      if (!token) {
        this.user.set(null)
        return
      }

      const result = await firstValueFrom(this.http.get<User>(`${environment.apiUrl}/api/auth/me`))
      this.user.set(result)

    } catch (error: any) {
      if (error.status === 401 || error.status === 403) {
        this.cookieService.delete(COOKIES.TOKEN)
        this.user.set(null)
      }
    }
  }
}
