import { Component, input } from '@angular/core'

@Component({
  selector: 'app-grid-icon',
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
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-block;
      vertical-align: middle;
    }
  `]
})

export class GridIcon {
className = input('size-5');
}
