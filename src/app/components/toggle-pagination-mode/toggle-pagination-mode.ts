import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationMode } from '../../models/Pagination.model';

@Component({
  selector: 'app-toggle-pagination-mode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle-pagination-mode.html',
  styleUrls: ['./toggle-pagination-mode.scss'],
})
export class TogglePaginationMode {
  private _initialMode: PaginationMode = 'pagination';

  @Input()
  set mode(value: PaginationMode) {
    this._initialMode = value ?? 'pagination';
    // initialize toggle according to incoming mode only once (or whenever parent sets it)
    this.toggleValue = this._initialMode === 'infinite_scroll';
  }

  // mode is derived from toggleValue (mode depends on toggleValue)
  get mode(): PaginationMode {
    return this.toggleValue ? 'infinite_scroll' : 'pagination';
  }

  @Output() modeChange = new EventEmitter<PaginationMode>();

  toggleValue = false;

  onToggle(): void {
    this.toggleValue = !this.toggleValue;
    this.modeChange.emit(this.mode);
  }
}
