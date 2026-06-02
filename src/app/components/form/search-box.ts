import { Component, input, output, booleanAttribute, ViewChild, type ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GlassIcon } from "../icons/glass"

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, GlassIcon],
  template: `
    <div class="relative w-full">
      <app-glass-icon className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
          #searchInput
          type="text"
          name="search-box"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          (input)="onInput.emit(searchInput.value)"
          (keyup.enter)="handleEnter(searchInput.value)"
          class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none transition-all duration-200 bg-white placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-100" />
    </div>
  `,
})
export class SearchBoxComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>

  placeholder = input('Buscar usuario...');
  disabled = input(false, { transform: booleanAttribute });

  onInput = output<string>();
  onEnter = output<string>(); // Cambié a string para pasar el valor

  handleEnter (value: string) {
    this.onEnter.emit(value)
    this.searchInput.nativeElement.value = '' // Limpia tras Enter
    this.searchInput.nativeElement.focus()
  }
}
