import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-infinite-scroll-toggler',
  imports: [ToggleSwitchModule, FormsModule],
  templateUrl: './infinite-scroll-toggler.html',
  styleUrl: './infinite-scroll-toggler.scss',
})
export class InfiniteScrollToggler {
  @Input() isInfinite = false;
  @Output() isInfiniteChange = new EventEmitter<boolean>();

  onValueChange(isInfinite: boolean) {
    this.isInfinite = isInfinite;
    this.isInfiniteChange.emit(this.isInfinite);
  }
}
