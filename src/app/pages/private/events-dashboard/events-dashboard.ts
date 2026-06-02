import { CommonModule } from '@angular/common'
import { Component, computed, inject, signal, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SearchBoxComponent } from "@app/components/form/search-box"
import { FoldersIcon } from "@app/components/icons/folders"
import { ToastService } from '@app/services/toast.service'
import type { Event } from '@app/types/event'
import { EventsService } from '@app/services/events.service'
import { GrupoService } from '@app/services/grupo.service'
import { Group } from '@app/types/group'
import { EventModal } from "@app/components/modals/event-modal/event-modal";

@Component({
  selector: 'app-posts-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBoxComponent, FoldersIcon, EventModal],
  templateUrl: './events-dashboard.html',
})
export class AdminEvents {

  eventService = inject(EventsService);
  grupoService = inject(GrupoService);
  toastService = inject(ToastService);

  showEventModal = false;
  selectedEvent = signal<Event | null>(null);

  private timer?: ReturnType<typeof setTimeout>

  eventList = signal<Array<Event>>([])
  groupList = signal<Array<Group>>([])
  groupsLoading = signal(false)
  groupsError = signal<string | null>(null)

  searchTerm = signal('')


  constructor() {
    this.eventService.getAllEvents().subscribe({
      next: value => {
        this.eventList.set(value)
      }
    })
  }

  filteredEvents = computed(() => {
    const term = this.searchTerm().toLowerCase().trim()
    if (!term) return this.eventList()

    return this.eventList().filter(post => post.title.toLowerCase().includes(term))
  })

  onInput(value: string) {
    // Debounce
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.searchTerm.set(value.length < 3 ? '' : value)
    }, 150)
  }

  addEventToList(event: Event) {
    this.eventList.update(value => [...value.filter(item => item.id !== event.id), event])
  }

  deleteEvent(event: Event) {
    this.eventService.deleteEvent(event.id).subscribe({
      next: () => {
        this.eventList.update(value => value.filter(item => item.id !== event.id))
        this.toastService.success('Evento eliminado correctamente.')
      },
      error: () => {
        this.toastService.error('No ha sido posible eliminar el evento.')
      }
    })
  }

  openNewEvent() {
    this.selectedEvent.set(null)
    this.loadGroups()
    this.showEventModal = true
  }

  openEditEvent(event: Event) {
    this.selectedEvent.set(event)
    this.loadGroups()
    this.showEventModal = true
  }

  loadGroups() {
    this.groupsLoading.set(true)
    this.groupsError.set(null)

    this.grupoService.getAllGroups().subscribe({
      next: (groups) => {
        this.groupList.set(groups ?? [])
        this.groupsLoading.set(false)
      },
      error: () => {
        this.groupList.set([])
        this.groupsError.set('No se pudieron cargar los grupos')
        this.groupsLoading.set(false)
      }
    })
  }

}
