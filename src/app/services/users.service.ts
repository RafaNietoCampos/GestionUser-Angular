import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import type { User } from '@app/types/user'
import { environment } from 'environments/environment'
import type { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient)

  getAllUsers(): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${environment.apiUrl}/api/usuario/all`)
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/usuario/${id}`)
  }

  addUser(newUser: Partial<User>): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/api/usuario`, newUser)
  }

  updateUser(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/api/usuario/${user.id}`, user)
  }

  delete(user: User): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/usuario/${user.id}`)
  }

  changePassword(passwordData: { oldPassword: string, newPassword: string, confirmPassword: string }): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/usuario/me/password`, passwordData)
  }

  updateProfile(profileData: { email: string, phone: string, address: string }): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/usuario/me`, profileData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

}
