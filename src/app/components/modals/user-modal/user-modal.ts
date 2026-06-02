import { Component, computed, effect, inject, output, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors, type ValidatorFn } from '@angular/forms'
import { ChevronIcon } from '@app/components/icons/chevron'
import { XIcon } from '@app/components/icons/x'
import { USER_ROLE } from '@app/constants/user-role'
import { ToastService } from '@app/services/toast.service'
import { UsersService } from '@app/services/users.service'
import type { User, UserRole } from '@app/types/user'

@Component({
  selector: 'app-user-modal',
  imports: [XIcon, ChevronIcon, ReactiveFormsModule],
  templateUrl: './user-modal.html',
})
export class UserModal {
  private userService = inject(UsersService)
  private toastService = inject(ToastService)
  private fb = new FormBuilder();

  onClose = output<void>()
  onSuccess = output<User>()
  onCancel = output<void>()

  protected isActive = signal<boolean>(false)
  protected user = signal<User | null>(null)
  protected isEdit = signal<boolean>(false)

  protected title = computed(() => this.isEdit() ? 'Editar Usuario' : 'Añadir Usuario');


  protected form = this.fb.nonNullable.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{8}$/)]],
    email: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}[TRWAGMYFPDXBNJZSQVHLCKE]$/)]],
    address: ['', [Validators.required]],
    role: [USER_ROLE.BASE as UserRole, [Validators.required, validUserRole]],
  });

  constructor() {
    effect(() => {
      const user = this.user()
      if (user) {
        this.form.patchValue({
          id: user.id ?? null,
          name: user.name || '',
          phone: user.phone || '',
          email: user.email || '',
          dni: user.dni || '',
          address: user.address || '',
          role: user.role || (USER_ROLE.BASE as UserRole),
        })
      } else {
        this.form.reset()
      }
    })
  }

  protected onSave() {

    if (this.form.valid) {
      const userData = this.form.getRawValue()
      if (this.isEdit()) {
        if (userData.id == null) {
          this.toastService.error('No se pudo identificar el usuario a actualizar.')
          return
        }
        this.userService.updateUser(userData as Partial<User>).subscribe({
          next: (user) => {
            this.onSuccess.emit(user)
            this.toastService.success(`Usuario actualizado correctamente.`)
          },
          error: () => {
            this.toastService.error('Se produjo un error en la actualización del usuario.')
          },
          complete: () => {
            this.closeModal()
          }
        })
      } else {
        const { id, ...payload } = userData
        this.userService.addUser(payload as Partial<User>).subscribe({
          next: (user) => {
            this.onSuccess.emit(user)
            this.toastService.success(`Usuario creado correctamente.`)
          },
          error: () => {
            this.toastService.error('Se produjo un error en la creación del usuario.')
          },
          complete: () => {
            this.closeModal()
          }
        })
      }
    }
  }

  protected onBackdropClick() {
    this.closeModal()
  }

  closeModal() {
    this.isActive.set(false)
    this.form.reset()
    this.user.set(null)
    this.isEdit.set(false)
  }

  openModal(user?: User) {
    if (user) {
      this.isEdit.set(true)
      this.user.set({ ...user })
    }
    this.isActive.set(true)
  }
}

const validUserRole: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const validRoles: UserRole[] = Object.values(USER_ROLE).filter(v => v !== 'admin')

  if (!control.value || validRoles.includes(control.value as UserRole)) {
    return null
  }

  return { invalidRole: { value: control.value, validRoles } }
}
