import { computed, Injectable, signal } from '@angular/core'
import type { ToastType } from '@app/components/toast/toast'

export interface ToastData {
  id: number
  type: ToastType
  title?: string
  message: string
  duration?: number
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0
  toasts = signal<ToastData[]>([]);
  visibleToasts = computed(() => this.toasts());

  success (message: string, title?: string, duration = 5000) {
    this.show('success', message, title, duration)
  }

  error (message: string, title?: string, duration = 6000) {
    this.show('error', message, title, duration)
  }

  warning (message: string, title?: string, duration = 5000) {
    this.show('warning', message, title, duration)
  }

  info (message: string, title?: string, duration = 4000) {
    this.show('info', message, title, duration)
  }

  private show (type: ToastType, message: string, title?: string, duration = 5000) {
    this.toasts.update(t => [...t, { id: ++this.nextId, type, title, message, duration }])
  }

  dismiss (id: number) {
    this.toasts.update(t => t.filter(toast => toast.id !== id))
  }
}
