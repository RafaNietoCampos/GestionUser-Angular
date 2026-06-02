import { CommonModule } from '@angular/common'
import { Component, effect, inject, signal } from '@angular/core'
import { ChevronIcon } from "@app/components/icons/chevron"
import { EventModal } from '@app/components/modals/event-modal/event-modal'
import { USER_ROLE } from '@app/constants/user-role'
import { AuthService } from '@app/services/auth.service'
import { EventsService } from '@app/services/events.service'
import { GrupoService } from '@app/services/grupo.service'
import { ToastService } from '@app/services/toast.service'
import type { Event } from '@app/types/event'
import { Group } from '@app/types/group'

@Component({
  selector: 'app-events',
  imports: [CommonModule, EventModal, ChevronIcon],
  templateUrl: './events.html',
})
export class Events {
  authService = inject(AuthService)
  eventsService = inject(EventsService)
  grupoService = inject(GrupoService)
  toastService = inject(ToastService)

  showEventModal = false;
  currentDate = signal(new Date());
  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  daysOfWeek = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

  eventList = signal<Array<Event>>([])
  groupList = signal<Array<Group>>([])
  groupsLoading = signal(false)
  groupsError = signal<string | null>(null)
  selectedEvent = signal<Event | null>(null)

  constructor() {
    effect(() => {
      this.eventsService.getEventsByDate(this.currentDate().getFullYear(), this.currentDate().getMonth() + 1).subscribe({
        next: (value) => {
          this.eventList.set(value)
          this.selectedEvent.set(null)
        },
      })
    })
  }

  get currentMonthName (): string {
    return this.monthNames[this.currentDate().getMonth()]
  }

  get currentYear (): number {
    return this.currentDate().getFullYear()
  }

  // Generate calendar grid (simplified for visual representation)
  // This logic correctly places days in the grid
  get calendarDays (): (number | null)[] {
    const year = this.currentDate().getFullYear()
    const month = this.currentDate().getMonth()
    const firstDay = new Date(year, month, 1).getDay() // 0 is Sunday, 1 is Monday...

    // Adjust for Monday start (Monday=0 in our grid logic, so subtract 1 from JS getDay(). existing Sunday(0) becomes 6)
    let startOffset = firstDay - 1
    if (startOffset < 0) startOffset = 6

    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: (number | null)[] = []
    for (let i = 0; i < startOffset; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  previousMonth () {
    this.currentDate.set(new Date(this.currentDate().getFullYear(), this.currentDate().getMonth() - 1, 1))
  }

  nextMonth () {
    this.currentDate.set(new Date(this.currentDate().getFullYear(), this.currentDate().getMonth() + 1, 1))
  }

  shouldShowNewEventBtn () {
    const user = this.authService.currentUser

    if (!user) return false

    const allowedRoles: Array<string> = [USER_ROLE.ADMIN, USER_ROLE.JUNTA, USER_ROLE.CAPATAZ]

    return allowedRoles.includes(user.role)
  }

  openNewEvent () {
    this.loadGroups()
    this.showEventModal = true
  }

  loadGroups () {
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

  protected onBackdropClick () {
    this.selectedEvent.set(null)
  }

  onEventSelect (selected: Event) {
    if (selected) {
      this.selectedEvent.set(selected)

      // Si tenemos ID de grupo pero falta el nombre, lo recuperamos
      if (selected.group?.id && !selected.group.name) {
        this.grupoService.getGroupById(Number(selected.group.id)).subscribe({
          next: (groupData) => {
            this.selectedEvent.update(curr => {
              if (curr && curr.id === selected.id) {
                return {
                  ...curr,
                  group: {
                    id: curr.group!.id,
                    name: groupData.name
                  }
                }
              }
              return curr
            })
          }
        })
      }
    } else {
      this.selectedEvent.set(null)
    }
  }
}
