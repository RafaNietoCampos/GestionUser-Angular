// toast.component.ts (tu código + FIX animación suave)
import { Component, input, signal, effect, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ToastService } from '@app/services/toast.service'
import { XIcon } from "../icons/x"

export type ToastType = 'success' | 'error' | 'warning' | 'info'

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, XIcon],
  templateUrl: './toast.html',
})
export class ToastComponent {
  toastService = inject(ToastService)

  id = input<number>(Date.now())
  type = input.required<ToastType>()
  title = input<string | null>(null)
  message = input.required<string>()
  duration = input<number | undefined>(2000)

  visible = signal(false)
  show = signal(true)

  constructor() {
    requestAnimationFrame(() => { this.visible.set(true) })

    effect(() => {
      if (this.show() && this.visible()) {
        setTimeout(() => this.dismiss(), this.duration())
      }
    })
  }

  dismiss () {
    this.visible.set(false)
    setTimeout(() => {
      this.toastService.dismiss(this.id())
    }, 350)
  }

  getClasses () {
    const base = 'shadow-2xl rounded-xl px-6 py-4 border-l-4 backdrop-blur-sm shadow-lg drop-shadow-2xl w-full'
    const types: Record<ToastType, string> = {
      success: 'bg-green-200/60 text-green-900 border-green-500/50',
      error: 'bg-red-200/60 text-red-900 border-red-500/50',
      warning: 'bg-yellow-200/60 text-yellow-900 border-yellow-500/50',
      info: 'bg-blue-200/60 text-blue-900 border-blue-500/50'
    }
    const animClass = this.visible()
      ? 'opacity-100 translate-x-0 scale-100'
      : 'opacity-0 translate-x-28 scale-95'

    return `${base} ${types[this.type()]} transition-all duration-300 ease-out ${animClass}`
  }
}
