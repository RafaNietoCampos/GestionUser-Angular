import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { XIcon } from '@app/components/icons/x'

interface Item {
  id: number;
  title: string;
  type: 'PASO' | 'BANDA';
  image: string;
  description: string;
}

@Component({
  selector: 'app-paso-banda-modal',
  imports: [CommonModule, FormsModule, XIcon],
  templateUrl: './paso-banda-modal.html',
  styleUrl: './paso-banda-modal.css',
})
export class PasoBandaModal {
  @Input() item: Item | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Item>();

  editedItem: Item | null = null;

  ngOnInit() {
    if (this.item) {
      this.editedItem = { ...this.item };
    }
  }

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onSave() {
    if (this.editedItem) {
      this.save.emit(this.editedItem);
    }
  }
}
