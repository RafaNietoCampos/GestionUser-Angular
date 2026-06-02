import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { XIcon } from '@app/components/icons/x'
import { EventsService } from '@app/services/events.service'
import { ToastService } from '@app/services/toast.service'
import type { CreateEvent, Event } from '@app/types/event'
import type { Group } from '@app/types/group'

@Component({
  selector: 'app-event-modal',
  imports: [CommonModule, FormsModule, XIcon],
  templateUrl: './event-modal.html',
  styleUrl: './event-modal.css',
})
export class EventModal {
  @Output() close = new EventEmitter<void>()
  @Output() saved = new EventEmitter<void>()

  @Input() groups: Array<Group> = []
  @Input() loading = false
  @Input() error: string | null = null
  @Input() event: Event | null = null

  private eventsService = inject(EventsService)
  private toastService = inject(ToastService)

  title = ''
  eventDate = ''
  description = ''
  groupId: number | null = null
  saving = false
  saveError: string | null = null

  get modalTitle() {
    return this.event ? 'Editar Evento' : 'Nuevo Evento'
  }

  ngOnChanges() {
    if (this.event) {
      this.title = this.event.title
      this.description = this.event.description ?? ''
      this.groupId = this.event.group?.id ? Number(this.event.group.id) : null

      // Convert Date object or ISO string to yyyy-MM-dd for <input type="date">
      if (this.event.date) {
        const d = new Date(this.event.date)
        this.eventDate = d.toISOString().split('T')[0]
      }
    } else {
      this.title = ''
      this.description = ''
      this.eventDate = ''
      this.groupId = null
    }
  }

  onClose() {
    this.close.emit()
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit()
    }
  }

  onSave() {
    if (this.saving) return

    if (!this.title.trim() || !this.eventDate) {
      this.toastService.error('Por favor, completa título y fecha.')
      return
    }

    const payload: CreateEvent = {
      title: this.title.trim(),
      description: this.description.trim(),
      date: this.eventDate, // enviar string yyyy-MM-dd para evitar desfase de zona horaria
      groupId: this.groupId ?? undefined
    }

    this.saveError = null
    this.saving = true

    if (this.event) {
      const updatePayload: Event = {
        ...this.event,
        title: this.title.trim(),
        description: this.description.trim(),
        date: new Date(this.eventDate),
        group: this.groupId ? { id: String(this.groupId), name: '' } : undefined
      }

      this.eventsService.putEvent(updatePayload).subscribe({
        next: () => {
          this.saving = false
          this.toastService.success('Evento actualizado correctamente.')
          this.saved.emit()
          this.close.emit()
          location.reload()
        },
        error: () => {
          this.saving = false
          this.toastService.error('No se pudo actualizar el evento.')
        }
      })
    } else {
      const payload: CreateEvent = {
        title: this.title.trim(),
        description: this.description.trim(),
        date: this.eventDate,
        groupId: this.groupId ?? undefined
      }

      this.eventsService.postEvent(payload).subscribe({
        next: () => {
          this.saving = false
          this.toastService.success('Evento creado correctamente.')
          this.saved.emit()
          this.close.emit()
          location.reload()
        },
        error: () => {
          this.saving = false
          this.toastService.error('No se pudo guardar el evento.')
        }
      })
    }
  }
}
