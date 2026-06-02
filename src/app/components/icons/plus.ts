import { Component, input } from '@angular/core'

@Component({
  selector: 'app-plus-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" [class]="className()" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
   `,
  styles: [`
    :host {
      display: inline-block;
      vertical-align: middle;
    }
  `]
})

export class PlusIcon {
  className = input('size-5');
}

