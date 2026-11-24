import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { LoginIcon } from '@app/components/icons/login'
import { AuthService } from '@app/services/auth.service'
import { ToastService } from '@app/services/toast.service'
import { firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-login-modal',
  imports: [ReactiveFormsModule, LoginIcon],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css',
})
export class LoginModal {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isActive = false;

  isLoading = signal(false);

  closeModal() {
    this.loginForm.reset()
    this.isActive = false
  }

  openModal() {
    this.isActive = true
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal()
    }
  }

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }

    this.isLoading.set(true)

    try {
      const { email, password, rememberMe } = this.loginForm.getRawValue()

      const result = await firstValueFrom(this.authService.login({ email, password, rememberMe }))

      if (!result) throw new Error('Login falló')

      this.toastService.success(`Bienvenida/o ${result.user.name.split(' ')[0]}`)

      // Si llegó aquí redirigido desde una página privada, volver a ella
      const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl']
      if (typeof returnUrl === 'string' && returnUrl.startsWith('/')) {
        this.router.navigateByUrl(returnUrl)
      }
    } catch (error: any) {
      if (error.message === 'ACCOUNT_INACTIVE') {
        this.toastService.error('Su cuenta está desactivada. Por favor, contacte con el administrador.')
      } else {
        this.toastService.error('Credenciales incorrectas. Inténtelo de nuevo.')
      }
    } finally {
      this.isLoading.set(false)
      this.closeModal()
    }
  }
}
