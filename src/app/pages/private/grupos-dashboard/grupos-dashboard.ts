import { CommonModule } from '@angular/common'
import { Component, computed, inject, signal, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SearchBoxComponent } from "@app/components/form/search-box"
import { FoldersIcon } from "@app/components/icons/folders"
import { GrupoModal } from '@app/pages/private/grupos-dashboard/create-grupos-modal/create-grupo-modal'
import { GrupoService } from '@app/services/grupo.service'
import { ImagesService } from '@app/services/images.service'
import { ToastService } from '@app/services/toast.service'
import { Group } from '@app/types/group'


@Component({
  selector: 'app-grupos-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBoxComponent, GrupoModal, FoldersIcon],
  templateUrl: './grupos-dashboard.html',
})
export class AdminGrupos {
  @ViewChild('grupoModal') grupoModal?: GrupoModal

  imageService = inject(ImagesService);
  grupoService = inject(GrupoService);
  toastService = inject(ToastService);

  private timer?: ReturnType<typeof setTimeout>

  grupoList = signal<Array<Group>>([])
  searchTerm = signal('')
  showUserModal = false


  constructor() {
    this.grupoService.getAllGroups().subscribe({
      next: value => {
        this.grupoList.set(value)
      }
    })
  }

  filteredGrupos = computed(() => {
    const term = this.searchTerm().toLowerCase().trim()
    if (!term) return this.grupoList()

    return this.grupoList().filter(grupo => grupo.name.toLowerCase().includes(term))
  })

  onInput(value: string) {
    // Debounce
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.searchTerm.set(value.length < 3 ? '' : value)
    }, 150)
  }

  addGrupoToList(grupo: Group) {
    this.grupoList.update(value => [...value.filter(item => item.id !== grupo.id), grupo])
  }

  deleteGrupo(grupo: Group) {
    this.grupoService.deleteGroup(grupo.id).subscribe({
      next: () => {
        this.grupoList.update(value => value.filter(item => item.id !== grupo.id))
        this.toastService.success('Grupo eliminado correctamente.')
      },
      error: () => {
        this.toastService.error('No ha sido posible eliminar el grupo.')
      }
    })
  }
}
