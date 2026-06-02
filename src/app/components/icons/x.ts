// x-icon.component.ts (Close/X)
import { Component, input } from '@angular/core'

@Component({
  selector: 'app-x-icon',
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
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
    }
  `]
})
export class XIcon {
  className = input('size-5');
}
