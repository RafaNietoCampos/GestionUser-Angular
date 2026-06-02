import { Component, input } from '@angular/core'

@Component({
  selector: 'app-glass-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" [class]="className()" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.class]="className()" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    `,
  styles: [`
    :host {
      display: inline-block;
      vertical-align: middle;
    }
  `]
})

export class GlassIcon {
  className = input('size-5');
}

