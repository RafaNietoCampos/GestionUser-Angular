import { Component } from '@angular/core'

@Component({
  selector: 'app-register-modal',
  imports: [],
  templateUrl: './register-modal.html',
  styleUrl: './register-modal.css',
})
export class RegisterModal {

  isActive = false;

  closeModal() {
    this.isActive = false;
  }

  openModal() {
    this.isActive = true;
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }
}
