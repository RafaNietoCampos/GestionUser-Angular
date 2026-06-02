import { CommonModule } from '@angular/common'
import { Component, computed, inject, signal, ViewChild } from '@angular/core'
import { SearchBoxComponent } from "@app/components/form/search-box"
import { AddUserIcon } from "@app/components/icons/add-user"
import { SaveIcon } from "@app/components/icons/save"
import { UserModal } from '@app/components/modals/user-modal/user-modal'
import { AuthService } from '@app/services/auth.service'
import { PdfService } from '@app/services/pdf.service'
import { ToastService } from '@app/services/toast.service'
import { UsersService } from '@app/services/users.service'
import type { User } from '@app/types/user'

@Component({
  selector: 'app-users',
  imports: [CommonModule, UserModal, AddUserIcon, SearchBoxComponent, SaveIcon],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  @ViewChild('userModal') userModal = UserModal

  private userService = inject(UsersService)
  authService = inject(AuthService)
  pdfService = inject(PdfService)
  toastService = inject(ToastService)

  private timer?: ReturnType<typeof setTimeout>

  userList = signal<Array<User>>([])
  searchTerm = signal('')
  showUserModal = false


  constructor() {
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.userList.set(users)
      }
    })
  }


  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim()
    if (!term) return this.userList()

    return this.userList().filter(user =>
      user.email.toLowerCase().includes(term) ||
      user.name.toLowerCase().includes(term)
    )
  })

  onInput(value: string) {
    // Debounce
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.searchTerm.set(value.length < 3 ? '' : value)
    }, 150)
  }

  addUserToList(user: User) {
    this.userList.update(value => {
      const exists = value.findIndex(item => item.id === user.id)
      if (exists >= 0) {
        const copy = [...value]
        copy[exists] = user
        return copy
      }
      return [...value, user]
    })
  }

  deleteUser(user: User) {
    this.userService.updateUser({ ...user, active: false }).subscribe({
      next: (updatedUser) => {
        this.userList.update(value => {
          return value.map(item => item.id === user.id ? updatedUser : item)
        })
        this.toastService.success('Usuario deshabilitado correctamente.')
      },
      error: () => {
        this.toastService.error('No ha sido posible deshabilitar el usuario.')
      }
    })
  }

  enableUser(user: User) {
    this.userService.updateUser({ ...user, active: true }).subscribe({
      next: (updatedUser) => {
        this.userList.update(value => {
          return value.map(item => item.id === user.id ? updatedUser : item)
        })
        this.toastService.success('Usuario habilitado correctamente.')
      },
      error: () => {
        this.toastService.error('No ha sido posible habilitar el usuario.')
      }
    })
  }
}
