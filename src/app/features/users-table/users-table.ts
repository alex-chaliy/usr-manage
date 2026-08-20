import { Observable, take } from 'rxjs';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { UserListFilters, UserSortField, UserTableRow } from '../../models/User.model';
import { PaginationMode } from '../../models/Pagination.model';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { TogglePaginationMode } from '../../components/toggle-pagination-mode/toggle-pagination-mode';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTION } from '../../constants/pagination.constants';
import { PAGE_SIZE_MAP } from '../../constants/pagination.constants';
import { CustomSelect } from '../../components/custom-select/custom-select';
import { SortDirection } from '../../models/Sort.model';
import { ApiResponse, AsyncState } from '../../models/ApiInteraction.model';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users-table',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    CurrencyPipe,
    TogglePaginationMode,
    CustomSelect,
  ],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
})
export class UsersTable implements OnInit {
  private readonly userService = inject(UserService);
  private readonly cdk = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  readonly displayedColumns = [
    'fullName',
    'email',
    'position',
    'level',
    'primaryTech',
    'employmentType',
    'age',
    'salaryMonthly',
  ];

  fullNameQuery = '';
  emailQuery = '';
  currentSortField: UserSortField | null = null;
  paginationMode: PaginationMode = 'pagination';
  sortDirection: SortDirection = 'asc';
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;
  pageSizeMap: Map<string, string> = PAGE_SIZE_MAP;

  positionQuery = null as unknown as [string, string] | null;
  levelQuery = null as unknown as [string, string] | null;
  techQuery = null as unknown as [string, string] | null;
  employmentTypeQuery = null as unknown as [string, string] | null;

  positionMap = null as unknown as Map<string, string>;
  levelMap = null as unknown as Map<string, string>;
  techMap = null as unknown as Map<string, string>;
  employmentTypeMap = null as unknown as Map<string, string>;

  totalResults = 0;
  allUsers: UserTableRow[] = [];

  usersAsyncState: AsyncState = 'loading';
  positionMapAsyncState: AsyncState = 'loading';
  levelMapAsyncState: AsyncState = 'loading';
  techMapAsyncState: AsyncState = 'loading';
  employmentTypeMapAsyncState: AsyncState = 'loading';

  keepCurrentRender = false;

  pageSizeOption = DEFAULT_PAGE_SIZE_OPTION;

  ngOnInit(): void {
    this.getFilteredUsers();
    this.getSelectOptions();
  }

  /**
   * @param keepPage - if true, keeps current render of data-table and current page number.
   * current page number can be increased/decreased from outside, but it doesn't reset page number to 1.
   * to say shortly, do not reset page number to 1,
   * and keep current render of data-table until we recieve the next page data.
   * `keepPage = true` is used when sorting or navigating between pages,
   * that helps to avoid ui blink. 
   * @param sumChunk - if true, don't wipe users-list with new chunk (next page data),
   * but add new chunk to existed users-list instead.
   * `sumChunk = true` needed for infinite scroll.
   * `sumChunk = false` works with classic pagination.
   */
  getFilteredUsers(keepPage = false, sumChunk = false): void {
    this.usersAsyncState = 'loading';
    this.keepCurrentRender = keepPage;
    this.page = keepPage ? this.page : 1;
    this.userService
      .getUsers(this.getFiltersObject())
      .pipe(
        takeUntilDestroyed(this.destroyRef), // Automatically cleans up on destroy
      )
      .subscribe({
        next: (res: ApiResponse<UserTableRow[]>) => {
          if (!this.allUsers) {
            this.allUsers = [];
          }
          this.usersAsyncState = 'success';
          this.allUsers = sumChunk ? [...this.allUsers, ...res.data] : res.data;
          this.totalResults = res.total;
          this.cdk.detectChanges(); // Ensure the view updates after data changes
        },
        error: (err) => {
          this.usersAsyncState = 'error';
          console.error('Error fetching filtered users:', err);
        },
      });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.pageSize));
  }

  get hasPreviousPage(): boolean {
    return this.page > 1;
  }

  get hasNextPage(): boolean {
    return this.page < this.totalPages;
  }

  onPaginationModeChange(mode: PaginationMode): void {
    console.log('Pagination mode changed:', mode);
    this.page = 1;
    this.pageSize = DEFAULT_PAGE_SIZE;
    this.pageSizeOption = [...DEFAULT_PAGE_SIZE_OPTION]; // reset page-size custom-select
    this.getFilteredUsers();
  }

  previousPage(): void {
    if (!this.hasPreviousPage) {
      return;
    }
    this.page -= 1;
    this.getFilteredUsers(true); // Keep the current page when navigating
  }

  nextPage(): void {
    if (!this.hasNextPage) {
      return;
    }
    this.page += 1;
    this.getFilteredUsers(true); // Keep current page render when navigating
  }

  sortTable(field: UserSortField): void {
    const isSameField = this.currentSortField === field;
    this.sortDirection = isSameField && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.currentSortField = field;

    this.getFilteredUsers(true); // Keep the current page when sorting
  }

  resetFilters(): void {
    this.fullNameQuery = '';
    this.emailQuery = '';
    this.page = 1;
    this.currentSortField = null;
    this.sortDirection = 'asc';
    this.positionQuery = null;
    this.levelQuery = null;
    this.techQuery = null;
    this.employmentTypeQuery = null;

    this.getFilteredUsers();
  }

  private getFiltersObject(): UserListFilters {
    return {
      fullNameQuery: this.fullNameQuery,
      emailQuery: this.emailQuery,
      page: this.page,
      pageSize: this.pageSize,
      sortField: this.currentSortField,
      sortDirection: this.sortDirection,

      positionQuery: this.positionQuery ? this.positionQuery[1] : '',
      levelQuery: this.levelQuery ? this.levelQuery[1] : '',
      techQuery: this.techQuery ? this.techQuery[1] : '',
      employmentTypeQuery: this.employmentTypeQuery ? this.employmentTypeQuery[1] : '',
    };
  }

  onSelectPositionChange(selectedOption: [string, string] | null): void {
    this.positionQuery = selectedOption;
    this.getFilteredUsers();
  }

  onSelectLevelChange(selectedOption: [string, string] | null): void {
    this.levelQuery = selectedOption;
    this.getFilteredUsers();
  }

  onSelectTechChange(selectedOption: [string, string] | null): void {
    this.techQuery = selectedOption;
    this.getFilteredUsers();
  }

  onSelectEmploymentTypeChange(selectedOption: [string, string] | null): void {
    this.employmentTypeQuery = selectedOption;
    this.getFilteredUsers();
  }

  onSelectPageSizeChange(selection: [string, string] | null): void {
    if (!selection) {
      return;
    }
    const [, value] = selection;
    const numeric = Number(value);
    if (!Number.isNaN(numeric) && numeric > 0) {
      this.pageSize = numeric;
      this.page = 1;
      this.getFilteredUsers();
    }
  }

  getSelectOptions(): void {
    this.getPositionOptions();
    this.getLevelOptions();
    this.getTechOptions();
    this.getEmploymentTypeOptions();
  }

  getPositionOptions(): void {
    this.positionMapAsyncState = 'loading';
    this.userService
      .getPositions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: ApiResponse<Map<string, string>>) => {
          this.positionMap = res.data;
          this.positionMapAsyncState = 'success';
          this.cdk.detectChanges();
        },
        error: (err) => {
          this.positionMapAsyncState = 'error';
          console.error('Error fetching position options:', err);
        },
      });
  }

  getLevelOptions(): void {
    this.levelMapAsyncState = 'loading';
    this.userService
      .getLevels()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: ApiResponse<Map<string, string>>) => {
          this.levelMap = res.data;
          this.levelMapAsyncState = 'success';
          this.cdk.detectChanges();
        },
        error: (err) => {
          this.levelMapAsyncState = 'error';
          console.error('Error fetching level options:', err);
        },
      });
  }

  getTechOptions(): void {
    this.techMapAsyncState = 'loading';
    this.userService
      .getTechs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: ApiResponse<Map<string, string>>) => {
          this.techMap = res.data;
          this.techMapAsyncState = 'success';
          this.cdk.detectChanges();
        },
        error: (err) => {
          this.techMapAsyncState = 'error';
          console.error('Error fetching tech options:', err);
        },
      });
  }

  getEmploymentTypeOptions(): void {
    this.employmentTypeMapAsyncState = 'loading';
    this.userService
      .getEmploymentTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: ApiResponse<Map<string, string>>) => {
          this.employmentTypeMap = res.data;
          this.employmentTypeMapAsyncState = 'success';
          this.cdk.detectChanges();
        },
        error: (err) => {
          this.employmentTypeMapAsyncState = 'error';
          console.error('Error fetching employment type options:', err);
        },
      });
  }

  // Infinite Scroll Methods

  nextChunk() {
    if (!this.hasNextPage) {
      return;
    }
    this.page += 1;
    this.getFilteredUsers(true, true);
  }
}
