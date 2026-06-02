import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { SearchBoxComponent } from "@app/components/form/search-box";
import { Image } from "@app/components/image/image";
import { GrupoService } from '@app/services/grupo.service';
import { Group } from '@app/types/group';

interface Item {
  id: number;
  title: string;
  type: 'PASO' | 'BANDA';
  image: string;
  description: string;
}

@Component({
  selector: 'app-pasos-bandas',
  imports: [CommonModule, SearchBoxComponent, Image],
  templateUrl: './pasos-bandas.html',
  styleUrl: './pasos-bandas.css',
})
export class PasosBandas {
  showModal = false;
  selectedItem: Item | null = null;
  grupoService = inject(GrupoService)

  groupList = signal<Array<Group>>([])

  private timer?: ReturnType<typeof setTimeout>

  constructor() {
    this.grupoService.getAllGroups().subscribe({
      next: groups => this.groupList.set(groups)
    })
  }
  searchTerm = signal('');

  filteredGroups = computed(() => {
    const term = this.searchTerm().toLowerCase().trim()
    if (!term) return this.groupList()

    return this.groupList().filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    )
  });

  onInput(value: string) {
    // Debounce
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.searchTerm.set(value.length < 3 ? '' : value) // ← Actualiza signal
    }, 150)
  }
}
