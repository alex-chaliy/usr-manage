import { ScrollerOptions } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';

import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { PIcon } from '@primeicons/angular/p-icon';

import { CustomPaginator } from '../../components/custom-paginator/custom-paginator';
import {
  PageChangedOutput, PageSizeChangedOutput
} from '../../components/custom-paginator/models/CustomPaginator.model';
import {
  InfiniteScrollToggler
} from '../../components/infinite-scroll-toggler/infinite-scroll-toggler';
import {
  DEFAULT_PAGE_SIZE, INFINITE_MODE_PAGE_SIZE, PAGE_SIZES
} from '../../constants/pagination.constants';
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

@Component({
  selector: 'app-users-table',
  imports: [
    CommonModule,
    FormsModule,

    // custon components
    InfiniteScrollToggler,
    CustomPaginator,

    // prime-ng components
    SelectModule,
    InputTextModule,
    ButtonDirective,

    TableModule,
    PIcon,
  ],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
})
export class UsersTable implements OnInit {
  private readonly userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  private readonly usersTableRef = viewChild<Table>('usersDataTable'); 

  readonly scrollOptions: ScrollerOptions = {
    itemSize: 56,

    // TODO find the proper solution how to fix table glitches when scroll up, and remove these comments
    // newly loaded items are appended to the DOM without removing previously rendered items
    // helps to fix virtual-scroll bug where
    // the height/range calculation glitches and causes jumpy scrolling or blank rows
    appendOnly: true, // fixed the bug with glitching, but only when scroll up
    // still issuing the bug with glitching when scroll down to load a new data chunk

    // numToleratedItems: 10, // rows tolerated outside viewport before triggering load

    delay: 150, // ms debounce while scrolling
  };

  isInfiniteMode = signal<boolean>(false);

  usersData = signal<UserAggrageted[]>([]);
  usersAsyncState = signal<AsyncState>('idle');

  offset = signal<number>(0);
  limit = signal<number>(DEFAULT_PAGE_SIZE);
  // total records in db with applied filters
  totalRecordsInDB = signal<number>(0);

  pageSizeOptions = signal<number[]>([...PAGE_SIZES]);

  fullNameQuery = signal<string>('');
  emailQuery = signal<string>('');

  currentSortField = signal<UserSortField | null>(null);
  sortDirection = signal<SortDirection>('asc');

  chosenPositionId = signal<string>('');
  chosenLevelId = signal<string>('');
  chosenTechId = signal<string>('');
  chosenEmploymentTypeId = signal<string>('');

  // options for select-filters
  positionOptions = signal<Position[]>([]);
  levelOptions = signal<Level[]>([]);
  techOptions = signal<TechSkill[]>([]);
  employmentTypeOptions = signal<EmploymentType[]>([]);

  positionOptionsAsyncState = signal<AsyncState>('idle');
  levelOptionsAsyncState = signal<AsyncState>('idle');
  techOptionsAsyncState = signal<AsyncState>('idle');
  employmentTypeOptionsAsyncState = signal<AsyncState>('idle');

  ngOnInit(): void {
    this.getFilteredUsers();
    this.getSelectOptions();
  }

  getFilteredUsers(
    loadStrategy: LoadStrategyConfig = {
      keepOffset: false,
      sumChunk: false,
    },
  ): void {
    this.usersAsyncState.set('loading');
    !loadStrategy.keepOffset && this.offset.set(0);

    this.userService
      .getUsers(this.getFiltersObject())
      .pipe(
        takeUntilDestroyed(this.destroyRef), // Automatically cleans up on destroy
      )
      .subscribe({
        next: (res: ApiResponse<UserAggrageted[]>) => {
          // TODO remove log
          // console.log('getFilteredUsers : res : ', res);

          this.usersAsyncState.set('success');
          this.usersData.set(
            loadStrategy.sumChunk ? [...this.usersData(), ...res.data] : [...res.data],
          );
          this.totalRecordsInDB.set(res.total);
        },
        error: (err) => {
          this.usersAsyncState.set('error');
          console.error('Error fetching filtered users:', err);
        },
      });
  }

  onPageChange(pco: PageChangedOutput): void {
    // TODO remove log
    // console.log('onPageChange : pco : ', pco);

    this.offset.set(pco.offset);
    this.getFilteredUsers({
      keepOffset: true, // Don't reset offset to 0 when navigating
    });
  }

  onPageSizeChange(psco: PageSizeChangedOutput): void {
    // TODO remove log
    // console.log('onPageSizeChange : psco : ', psco);

    this.limit.set(psco.limit);
    this.getFilteredUsers({ keepOffset: false }); // intentionally keep offset
  }

  sortTable(field: UserSortField): void {
    const isSameField = this.currentSortField() === field;
    this.sortDirection.set(isSameField ? (this.sortDirection() === 'asc' ? 'desc' : 'asc') : 'asc');
    this.currentSortField.set(field);

    this.getFilteredUsers();
  }

  // TODO replace with `computed`
  // probably create a Map with sort-field names and bind it to this.currentSortField()
  getSortIconName(sortField: UserSortField): SortIconType {
    return this.currentSortField() === sortField
      ? this.sortDirection() === 'asc'
        ? 'sort-up'
        : 'sort-down'
      : 'sort';
  }

  resetFilters(): void {
    // TODO find a proper and working solution how to fix glitches occured on filters-reset, and remove this comments
    // trying  to fix glitches in infinite-mode, when reset a table
    // this.usersTableRef()?.reset();

    this.offset.set(0);
    this.limit.set(this.isInfiniteMode() ? INFINITE_MODE_PAGE_SIZE : DEFAULT_PAGE_SIZE);
    this.totalRecordsInDB.set(0);

    this.fullNameQuery.set('');
    this.emailQuery.set('');

    this.currentSortField.set(null);
    this.sortDirection.set('asc');

    this.chosenPositionId.set('');
    this.chosenLevelId.set('');
    this.chosenTechId.set('');
    this.chosenEmploymentTypeId.set('');

    this.usersData.set([]);

    this.getFilteredUsers({
      keepOffset: false, // intentionally reset offset
      sumChunk: false, // intentionally reset users data-array with a new data from response
    });
  }

  private getFiltersObject(): UserListFilters {
    return {
      limit: this.limit(),
      offset: this.offset(),

      sortField: this.currentSortField(),
      sortDirection: this.sortDirection(),

      fullNameQuery: this.fullNameQuery(),
      emailQuery: this.emailQuery(),

      positionQuery: this.chosenPositionId(),
      levelQuery: this.chosenLevelId(),
      techQuery: this.chosenTechId(),
      employmentTypeQuery: this.chosenEmploymentTypeId(),
    };
  }

  onSelectPositionChange(chosenPositionId: string): void {
    this.chosenPositionId.set(chosenPositionId);
    this.getFilteredUsers();
  }

  onSelectLevelChange(chosenLevelId: string): void {
    this.chosenLevelId.set(chosenLevelId);
    this.getFilteredUsers();
  }

  onSelectTechChange(chosenTechId: string): void {
    this.chosenTechId.set(chosenTechId);
    this.getFilteredUsers();
  }

  onSelectEmploymentTypeChange(chosenEmploymentTypeId: string): void {
    this.chosenEmploymentTypeId.set(chosenEmploymentTypeId);
    this.getFilteredUsers();
  }

  getSelectOptions(): void {
    this.getPositionOptions();
    this.getLevelOptions();
    this.getTechOptions();
    this.getEmploymentTypeOptions();
  }

  getPositionOptions(): void {
    this.positionOptionsAsyncState.set('loading');
    this.userService
      .getPositions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: ApiResponse<Position[]>) => {
          this.positionOptions.set(res.data);
          this.positionOptionsAsyncState.set('success');
        },
        error: (err) => {
          this.positionOptionsAsyncState.set('error');
          console.error('Error fetching position options:', err);
        },
      });
  }

  getLevelOptions(): void {
    this.levelOptionsAsyncState.set('loading');
    this.userService
      .getLevels()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: ApiResponse<Level[]>) => {
          this.levelOptions.set(res.data);
          this.levelOptionsAsyncState.set('success');
        },
        error: (err) => {
          this.levelOptionsAsyncState.set('error');
          console.error('Error fetching level options:', err);
        },
      });
  }

  getTechOptions(): void {
    this.techOptionsAsyncState.set('loading');
    this.userService
      .getTechs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: ApiResponse<TechSkill[]>) => {
          this.techOptions.set(res.data);
          this.techOptionsAsyncState.set('success');
        },
        error: (err) => {
          this.techOptionsAsyncState.set('error');
          console.error('Error fetching tech options:', err);
        },
      });
  }

  getEmploymentTypeOptions(): void {
    this.employmentTypeOptionsAsyncState.set('loading');
    this.userService
      .getEmploymentTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: ApiResponse<EmploymentType[]>) => {
          this.employmentTypeOptions.set(res.data);
          this.employmentTypeOptionsAsyncState.set('success');
        },
        error: (err) => {
          this.employmentTypeOptionsAsyncState.set('error');
          console.error('Error fetching employment type options:', err);
        },
      });
  }

  onFullNameInputChange(value: string) {
    this.fullNameQuery.set(value);
    this.getFilteredUsers();
  }

  onEmailInputChange(value: string) {
    this.emailQuery.set(value);
    this.getFilteredUsers();
  }

  // Infinite Scroll Methods

  onInfiniteModeChange(isInfinite: boolean): void {
    this.isInfiniteMode.set(isInfinite);
    this.limit.set(this.isInfiniteMode() ? INFINITE_MODE_PAGE_SIZE : DEFAULT_PAGE_SIZE);
    this.totalRecordsInDB.set(0);

    this.getFilteredUsers({
      keepOffset: false, // intentionally reset offset
      sumChunk: false, // intentionally reset users data-array with a new data from response
    });
  }

  loadChunk(loadEvent?: TableLazyLoadEvent) {
    if (this.isLoadChunkBlocked()) {
      return;
    }

    // TODO remive log
    // console.log('loadChunk :  loadEvent: ', loadEvent);

    this.offset.set(this.usersData().length);

    this.getFilteredUsers({
      keepOffset: true,
      sumChunk: true,
    });
  }

  private isLoadChunkBlocked = computed(() => {
    const usersLoading = this.usersAsyncState() === 'loading';
    const allRecordsLoaded = this.usersData().length >= this.totalRecordsInDB();

    // TODO remove log
    // console.log('isLoadChunkBlocked : ', usersLoading || allRecordsLoaded);
    return usersLoading || allRecordsLoaded;
  });
}
