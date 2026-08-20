import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-select.html',
  styleUrls: ['./custom-select.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSelect implements OnInit {
  private _optionsList: Map<string, string> | null | undefined;
  private _valueOption: [string, string] | null | undefined;
  private _isLoading = false;

  @Input() loadingPlaceholder = 'Loading...';
  @Input() placeholder = 'Select Option';
  @Output() selectionChange = new EventEmitter<[string, string] | null>();

  @Input()
  set optionsList(v: Map<string, string> | null | undefined) {
    this._optionsList = v;
    this.updateOptionsFromList();
  }
  get optionsList(): Map<string, string> | null | undefined {
    return this._optionsList;
  }

  @Input()
  set valueOption(v: [string, string] | null | undefined) {
    this._valueOption = v;
    // apply valueOption only when not loading
    if (!this._isLoading) {
      this.applyValueOption();
    }
  }
  get valueOption(): [string, string] | null | undefined {
    return this._valueOption;
  }

  @Input()
  set isLoading(v: boolean) {
    const prev = this._isLoading;
    this._isLoading = Boolean(v);
    if (prev && !this._isLoading) {
      // loading finished -> apply valueOption or placeholder/options
      this.onLoadingFinished();
    }
  }
  get isLoading(): boolean {
    return this._isLoading;
  }

  optionEntries: Array<[string, string]> = [];
  selectedKey: string = '';
  disabled = false;

  ngOnInit(): void {
    this.updateOptionsFromList();
    if (!this._isLoading) {
      this.applyValueOption();
    }
  }

  private updateOptionsFromList(): void {
    if (!this._optionsList) {
      this.disabled = true;
      this.optionEntries = [['', 'no options provided']];
      this.selectedKey = '';
      return;
    }

    this.optionEntries = Array.from(this._optionsList.entries());
    this.disabled = this._isLoading ? true : this.optionEntries.length === 0;
    if (this.disabled && this.optionEntries.length === 0) {
      // no options
      this.optionEntries = [['', 'no options provided']];
      this.selectedKey = '';
    }
  }

  private applyValueOption(): void {
    const vo = this._valueOption;
    if (vo === null) {
      // explicit null -> reset to placeholder
      this.selectedKey = '';
      return;
    }

    if (vo && this._optionsList && this._optionsList.has(vo[0])) {
      this.selectedKey = vo[0];
      // Do not emit here to avoid feedback loops when parent mirrors selection into `valueOption`.
    }
  }

  private onLoadingFinished(): void {
    // loading finished, rebuild options and apply valueOption if present
    this.updateOptionsFromList();
    // if valueOption provided, apply it, otherwise keep placeholder
    this.applyValueOption();
  }

  onSelectChange(): void {
    if (!this._optionsList || !this.selectedKey) {
      return;
    }
    this.emitCurrentSelection();
  }

  private emitCurrentSelection(): void {
    if (!this._optionsList || !this.selectedKey) {
      return;
    }

    const value = this._optionsList.get(this.selectedKey) ?? '';
    this.selectionChange.emit([this.selectedKey, value]);
  }
}
