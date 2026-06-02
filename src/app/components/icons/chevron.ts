// chevron-icon.component.ts
import { Component, input } from '@angular/core'

@Component({
  selector: 'app-chevron-icon',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [class]="className()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-block;
      vertical-align: middle;
    }
  `]
})
export class ChevronIcon {
  className = input('size-5');
}
