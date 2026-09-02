import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

import {
  InfiniteScrollToggler
} from '../../components/infinite-scroll-toggler/infinite-scroll-toggler';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from '../../constants/pagination.constants';
import { ApiResponse, AsyncState } from '../../models/ApiInteraction.model';
import { EmploymentType } from '../../models/EmploymentType.model';
import { Level } from '../../models/Level.model';
import { Position } from '../../models/Position.model';
import { SortDirection } from '../../models/Sort.model';
import { TechSkill } from '../../models/TechSkill.model';
import { UserAggrageted, UserListFilters, UserSortField } from '../../models/User.model';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-users-table',
  imports: [
    CommonModule,
    FormsModule,

    MatTableModule,
    ScrollingModule,
    InfiniteScrollDirective,

    InfiniteScrollToggler,

    SelectModule,
    InputTextModule,
    ButtonDirective,
  ],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
})
export class UsersTable implements OnInit {
  private readonly userService = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @ViewChild(CdkVirtualScrollViewport) private viewport?: CdkVirtualScrollViewport;
  readonly virtualRowHeight = 56;

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

  isInfiniteMode = false;

  fullNameQuery = '';
  emailQuery = '';
  currentSortField: UserSortField | null = null;

  sortDirection: SortDirection = 'asc';
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;
  pageSizeOptions: number[] = [...PAGE_SIZES];

  chosenPositionId = '';
  chosenLevelId = '';
  chosenTechId = '';
  chosenEmploymentTypeId = '';

  positionMap = null as unknown as Position[];
  levelMap = null as unknown as Level[];
  techMap = null as unknown as TechSkill[];
  employmentTypeMap = null as unknown as EmploymentType[];

  totalResults = 0;
  allUsers: UserAggrageted[] = [];

  usersAsyncState: AsyncState = 'idle';
  positionMapAsyncState: AsyncState = 'idle';
  levelMapAsyncState: AsyncState = 'idle';
  techMapAsyncState: AsyncState = 'idle';
  employmentTypeMapAsyncState: AsyncState = 'idle';

  keepCurrentRender = false;

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
        next: (res: ApiResponse<UserAggrageted[]>) => {
          if (!this.allUsers) {
            this.allUsers = [];
          }
          this.usersAsyncState = 'success';
          this.allUsers = sumChunk ? [...this.allUsers, ...res.data] : res.data;
          this.totalResults = res.total;
          this.cdr.detectChanges(); // Ensure the view updates after data changes
          this.viewport?.checkViewportSize();
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

  onInfiniteModeChange(isInfinite: boolean): void {
    this.isInfiniteMode = isInfinite;
    this.page = 1;
    this.pageSize = DEFAULT_PAGE_SIZE;
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
    this.chosenPositionId = '';
    this.chosenLevelId = '';
    this.chosenTechId = '';
    this.chosenEmploymentTypeId = '';

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

      positionQuery: this.chosenPositionId,
      levelQuery: this.chosenLevelId,
      techQuery: this.chosenTechId,
      employmentTypeQuery: this.chosenEmploymentTypeId,
    };
  }

  onSelectPositionChange(chosenPositionId: string): void {
    this.chosenPositionId = chosenPositionId;
    this.getFilteredUsers();
  }

  onSelectLevelChange(chosenLevelId: string): void {
    this.chosenLevelId = chosenLevelId;
    this.getFilteredUsers();
  }

  onSelectTechChange(chosenTechId: string): void {
    this.chosenTechId = chosenTechId;
    this.getFilteredUsers();
  }

  onSelectEmploymentTypeChange(chosenEmploymentTypeId: string): void {
    this.chosenEmploymentTypeId = chosenEmploymentTypeId;
    this.getFilteredUsers();
  }

  onSelectPageSizeChange(selection: number | null): void {
    if (selection === null || selection === undefined) {
      return;
    }
    const numeric = Number(selection);
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
        next: (res: ApiResponse<Position[]>) => {
          this.positionMap = res.data;
          this.positionMapAsyncState = 'success';
          this.cdr.detectChanges();
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
        next: (res: ApiResponse<Level[]>) => {
          this.levelMap = res.data;
          this.levelMapAsyncState = 'success';
          this.cdr.detectChanges();
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
        next: (res: ApiResponse<TechSkill[]>) => {
          this.techMap = res.data;
          this.techMapAsyncState = 'success';
          this.cdr.detectChanges();
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
        next: (res: ApiResponse<EmploymentType[]>) => {
          this.employmentTypeMap = res.data;
          this.employmentTypeMapAsyncState = 'success';
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.employmentTypeMapAsyncState = 'error';
          console.error('Error fetching employment type options:', err);
        },
      });
  }

  // Infinite Scroll Methods

  nextChunk() {
    if (this.usersAsyncState === 'loading' || !this.hasNextPage) {
      return;
    }
    this.page += 1;
    this.getFilteredUsers(true, true);
  }

  trackByUser(_index: number, row: UserAggrageted): string {
    return row.id;
  }
}
