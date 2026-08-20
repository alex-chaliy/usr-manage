import { Observable, take } from 'rxjs';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { UserListFilters, UserSortField, UserTableRow } from '../../models/User.model';
import { PaginationMode } from '../../models/Pagination.model';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { TogglePaginationMode } from '../toggle-pagination-mode/toggle-pagination-mode';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTION } from '../../constants/pagination.constants';
import { PAGE_SIZE_MAP } from '../../constants/pagination.constants';
import { CustomSelect } from '../custom-select/custom-select';
import { SortDirection } from '../../models/Sort.model';
import { ApiResponse, AsyncState } from '../../models/ApiInteraction.model';
import { CommonModule } from '@angular/common';

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

  defaultPageSizeOption = DEFAULT_PAGE_SIZE_OPTION;

  ngOnInit(): void {
    this.getFilteredUsers();
    this.getSelectOptions();
  }

  getFilteredUsers(keepPage = false): void {
    if (!keepPage) {
      this.usersAsyncState = 'loading';
    }
    this.page = keepPage ? this.page : 1;
    this.userService
      .getUsers(this.getFiltersObject())
      .subscribe({
        next: (res: ApiResponse<UserTableRow[]>) => {
          this.usersAsyncState = 'success';
          this.allUsers = res.data;
          this.totalResults = res.total;
          console.log('getFilteredUsers : allUsers:', this.allUsers);
          this.cdk.detectChanges(); // Ensure the view updates after data changes
        },
        error: () => {
          this.usersAsyncState = 'error';
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
    // handle mode change from toggle component if needed
    // currently we don't change table behavior here, but parent can react
    console.log('Pagination mode changed:', mode);
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
    this.getFilteredUsers(true); // Keep the current page when navigating
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
    console.log('onSelectTechChange : techQuery:', this.techQuery);
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
    this.userService.getPositions().subscribe({
      next: (res: ApiResponse<Map<string, string>>) => {
        this.positionMap = res.data;
        this.positionMapAsyncState = 'success';
        this.cdk.detectChanges();
      },
      error: () => {
        this.positionMapAsyncState = 'error';
      },
    });
  }

  getLevelOptions(): void {
    this.levelMapAsyncState = 'loading';
    this.userService.getLevels().subscribe({
      next: (res: ApiResponse<Map<string, string>>) => {
        this.levelMap = res.data;
        this.levelMapAsyncState = 'success';
        this.cdk.detectChanges();
      },
      error: () => {
        this.levelMapAsyncState = 'error';
      },
    });
  }

  getTechOptions(): void {
    this.techMapAsyncState = 'loading';
    this.userService.getTechs().subscribe({
      next: (res: ApiResponse<Map<string, string>>) => {
        this.techMap = res.data;
        this.techMapAsyncState = 'success';
        this.cdk.detectChanges();
      },
      error: () => {
        this.techMapAsyncState = 'error';
      },
    });
  }

  getEmploymentTypeOptions(): void {
    this.employmentTypeMapAsyncState = 'loading';
    this.userService.getEmploymentTypes().subscribe({
      next: (res: ApiResponse<Map<string, string>>) => {
        this.employmentTypeMap = res.data;
        this.employmentTypeMapAsyncState = 'success';
        this.cdk.detectChanges();
      },
      error: () => {
        this.employmentTypeMapAsyncState = 'error';
      },
    });
  }
}
