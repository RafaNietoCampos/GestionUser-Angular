import { Component, input, computed } from '@angular/core';
import { environment } from 'environments/environment'

@Component({
  selector: 'app-image',
  standalone: true,
  template: `
    <img
      [src]="fullSrc()"
      [alt]="alt()"
      [class]="className()"
    />
  `,
  imports: [],
  styles: []
})
export class Image {

  src = input<string>('');

  alt = input<string>('');

  className = input<string>('');

  fullSrc = computed(() => {
    if (!this.src()) {
      return '';
    }
    return `${environment.apiUrl}${this.src()}`;
  });
}
