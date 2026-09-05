// import { TableLazyLoadEvent } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { PIcon } from '@primeicons/angular/p-icon';

import {
  InfiniteScrollToggler
} from '../../components/infinite-scroll-toggler/infinite-scroll-toggler';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from '../../constants/pagination.constants';
import { ApiResponse, AsyncState } from '../../models/ApiInteraction.model';
import { EmploymentType } from '../../models/EmploymentType.model';
import { Level } from '../../models/Level.model';
import { LoadStrategyConfig } from '../../models/LoadStrategyConfig.model';
import { Position } from '../../models/Position.model';
import { SortDirection } from '../../models/Sort.model';
import { SortIconType } from '../../models/SortIcon.model';
import { TechSkill } from '../../models/TechSkill.model';
import { UserAggrageted, UserListFilters, UserSortField } from '../../models/User.model';
import { UserService } from '../../services/user-service';

const PrimeNGIconImports = [PIcon];

@Component({
  selector: 'app-users-table',
  imports: [
    CommonModule,
    FormsModule,

    InfiniteScrollToggler,

    SelectModule,
    InputTextModule,
    ButtonDirective,

    TableModule,
    ...PrimeNGIconImports,
  ],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
})
export class UsersTable implements OnInit {
  private readonly userService = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

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
  usersData: UserAggrageted[] = [];

  usersAsyncState: AsyncState = 'idle';
  positionMapAsyncState: AsyncState = 'idle';
  levelMapAsyncState: AsyncState = 'idle';
  techMapAsyncState: AsyncState = 'idle';
  employmentTypeMapAsyncState: AsyncState = 'idle';

  keepRenderUntilChanged = false;

  ngOnInit(): void {
    this.getFilteredUsers();
    this.getSelectOptions();
  }

  getFilteredUsers(
    lsc: LoadStrategyConfig = {
      keepPage: false,
      keepRenderUntilChanged: false,
      sumChunk: false,
    },
  ): void {
    this.usersAsyncState = 'loading';
    this.keepRenderUntilChanged = lsc.keepRenderUntilChanged;
    this.page = lsc.keepPage ? this.page : 1;
    this.userService
      .getUsers(this.getFiltersObject())
      .pipe(
        takeUntilDestroyed(this.destroyRef), // Automatically cleans up on destroy
      )
      .subscribe({
        next: (res: ApiResponse<UserAggrageted[]>) => {
          if (!this.usersData) {
            this.usersData = [];
          }

          this.usersAsyncState = 'success';
          this.usersData = lsc.sumChunk ? [...this.usersData, ...res.data] : [...res.data];
          this.totalResults = res.total;
          this.cdr.detectChanges(); // Ensure the view updates after data changessort
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

  previousPage(): void {
    if (!this.hasPreviousPage) {
      return;
    }
    this.page -= 1;
    this.getFilteredUsers({
      keepPage: true,
      keepRenderUntilChanged: true,
      sumChunk: false,
    }); // Don't reset page to 1 when navigating
  }

  nextPage(): void {
    if (!this.hasNextPage) {
      return;
    }
    this.page += 1;
    this.getFilteredUsers({
      keepPage: true,
      keepRenderUntilChanged: true,
      sumChunk: false,
    }); // Don't reset page to 1 when navigating
  }

  sortTable(field: UserSortField): void {
    const isSameField = this.currentSortField === field;
    this.sortDirection = isSameField && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.currentSortField = field;

    this.getFilteredUsers({
      keepPage: false,
      keepRenderUntilChanged: true,
      sumChunk: false,
    });
  }

  getSortIcon(sortField: UserSortField): SortIconType {
    return this.currentSortField === sortField
      ? this.sortDirection === 'asc'
        ? 'sort-up'
        : 'sort-down'
      : 'sort';
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

  onInfiniteModeChange(isInfinite: boolean): void {
    this.isInfiniteMode = isInfinite;
    this.page = 1;
    this.pageSize = DEFAULT_PAGE_SIZE;
    this.totalResults = 0;
    this.usersData = [];
    this.getFilteredUsers();
  }

  nextChunk($event?: any) {
    console.log('nextChunk : $event: ', $event);

    if (this.usersAsyncState === 'loading' || !this.hasNextPage) {
      return;
    }

    this.page += 1;
    this.getFilteredUsers({
      keepPage: true,
      keepRenderUntilChanged: true,
      sumChunk: true,
    });
  }
}
