import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/services/auth.service'
import { UsersService } from '@app/services/users.service'
import { SaveIcon } from "@app/components/icons/save";
import {ToastService} from '@app/services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, SaveIcon, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  authService = inject(AuthService);
  usersService = inject(UsersService);
  toastService= inject(ToastService);

  isPasswordSectionOpen = false;

  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  profileData = {
    email: '',
    phone: '',
    address: ''
  };

  ngOnInit(){
    if(this.authService.currentUser){
      this.profileData={
        email: this.authService.currentUser.email || '',
        phone: this.authService.currentUser.phone || '',
        address: this.authService.currentUser.address || ''
      };
    }
  }

  private toastSuccess(message: string, title: string = 'Éxito') {
    this.toastService.success(message, title, 2500);
  }

  private toastError(message: string, title: string = 'Error') {
    this.toastService.error(message, title, 3000);
  }

  updateProfile() {
    if (!this.profileData.email || !this.profileData.phone || !this.profileData.address) {
      this.toastError('Por favor, completa todos los campos');
      return;
    }

    this.usersService.updateProfile(this.profileData).subscribe({
      next: () => {
        this.toastSuccess('Datos actualizados correctamente');
        // Refresca los datos de la sesión para que el resto de la app vea los cambios
        this.authService.user.update(user => user ? { ...user, ...this.profileData } : user);
      },
      error: (err) => {
        console.error('Error completo:', err);
        let errorMessage = 'Inténtalo de nuevo';

        if (err.status === 400) {
          errorMessage = 'Datos inválidos';
        } else if (err.status === 401) {
          errorMessage = 'No estás autorizado';
        } else if (err.status === 403) {
          errorMessage = 'No tienes permisos para actualizar el perfil';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        this.toastError('Error al actualizar los datos: ' + errorMessage);
      }
    });
  }

  togglePasswordSection() {
    this.isPasswordSectionOpen = !this.isPasswordSectionOpen;
  }

  updatePassword() {
    if (!this.passwordData.oldPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.toastError('Por favor, completa todos los campos');
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toastError('Las contraseñas no coinciden');
      return;
    }

    this.usersService.changePassword(this.passwordData).subscribe({
      next: () => {
        this.toastSuccess('Contraseña actualizada correctamente');
        this.passwordData = { oldPassword: '', newPassword: '', confirmPassword: '' };
        this.isPasswordSectionOpen = false;
      },
      error: (err) => {
        console.error('Error completo:', err); // Para depuración
        let errorMessage = 'Inténtalo de nuevo';

        if (err.status === 400) {
          errorMessage = 'La contraseña actual es incorrecta';
        } else if (err.status === 401) {
          errorMessage = 'No estás autorizado';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        this.toastError('Error al actualizar la contraseña: ' + errorMessage);
      }
    });
  }

}
