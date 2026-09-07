import { ButtonDirective } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PageChangedOutput, PageSizeChangedOutput } from './models/CustomPaginator.model';

@Component({
  selector: 'app-custom-paginator',
  imports: [
    FormsModule,
    SelectModule, // needs Angular's FormsModule to work properly
    ButtonDirective
  ],
  templateUrl: './custom-paginator.html',
  styleUrl: './custom-paginator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPaginator {
  disabled = input<boolean>(false);

  offset = input<number>(0); // start index
  limit = input<number>(20); // page size
  total = input<number>(20); // total number of records

  usePageSizes = input<boolean>(false);
  pageSizeOptions = input<number[]>([20, 50, 100]);

  onPageChange = output<PageChangedOutput>();
  onPageSizeChange = output<PageSizeChangedOutput>();

  // sequential number of the current page
  page = computed<number>(() => {
    return Math.floor(this.offset() / this.limit() + 1);
  });

  // total number of pages, dependently on `limit` and `total`
  pages = computed<number>(() => {
    return this.calcPages(this.total(), this.limit());
  });
  private calcPages(total: number, limit: number): number {
    return Math.max(1, Math.ceil(total / limit));
  }

  hasPrevPage = computed<boolean>(() => {
    return this.calcHasPrevPage(this.page());
  });
  private calcHasPrevPage(page: number): boolean {
    return page > 1;
  }

  hasNextPage = computed<boolean>(() => {
    return this.calcHasNextPage(this.page(), this.pages());
  });
  private calcHasNextPage(page: number, pages: number): boolean {
    return page < pages;
  }

  emitPrevPage(): void {
    if (!this.hasPrevPage()) {
      return;
    }

    this.onPageChange.emit({
      offset: this.offset() - this.limit(),
      limit: this.limit(),
      total: this.total(),
      usePageSizes: this.usePageSizes(),
      pageSizes: this.pageSizeOptions(),
      page: this.page() - 1,
      pages: this.pages(),
      hasPrevPage: this.calcHasPrevPage(this.page() - 1),
      hasNextPage: this.hasNextPage(),
      changeDirection: 'prev',
    });
  }

  emitNextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    this.onPageChange.emit({
      offset: this.offset() + this.limit(),
      limit: this.limit(),
      total: this.total(),
      usePageSizes: this.usePageSizes(),
      pageSizes: this.pageSizeOptions(),
      page: this.page() + 1,
      pages: this.pages(),
      hasPrevPage: this.hasPrevPage(),
      hasNextPage: this.calcHasNextPage(this.page() + 1, this.pages()),
      changeDirection: 'next',
    });
  }

  emitPageSizeChange(newPageSize: number): void {
    this.onPageSizeChange.emit({
      offset: 0,
      limit: newPageSize,
      total: this.total(),
      usePageSizes: this.usePageSizes(),
      pageSizes: this.pageSizeOptions(),
      page: 1,
      pages: this.calcPages(this.total(), newPageSize),
      hasPrevPage: false,
      hasNextPage: this.calcHasNextPage(1, this.calcPages(this.total(), newPageSize)),
    });
  }
}
