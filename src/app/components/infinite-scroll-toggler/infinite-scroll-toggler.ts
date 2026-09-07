import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-infinite-scroll-toggler',
  imports: [ToggleSwitchModule, FormsModule],
  templateUrl: './infinite-scroll-toggler.html',
  styleUrl: './infinite-scroll-toggler.scss',
})
export class InfiniteScrollToggler {
  isInfinite = input<boolean>(false);
  isInfiniteChange = output<boolean>();

  onValueChange(isInfinite: boolean) {
    this.isInfiniteChange.emit(isInfinite);
  }
}
