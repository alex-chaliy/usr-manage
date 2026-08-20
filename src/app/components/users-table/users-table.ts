import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { UserListFilters, UserSortField, UserTableRow } from '../../models/User.model';
import { PaginationMode } from '../../models/Pagination.model';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { TogglePaginationMode } from '../toggle-pagination-mode/toggle-pagination-mode';
import { DEFAULT_PAGE_SIZE } from '../../constants/pagination.constants';
import { SortDirection } from '../../models/Sort.model';
import { ApiResponse } from '../../models/ApiResponse.model';

@Component({
  selector: 'app-users-table',
  imports: [FormsModule, MatTableModule, CurrencyPipe, TogglePaginationMode],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
})
export class UsersTable implements OnInit {
  private readonly userService = inject(UserService);

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
  totalResults = 0;
  allUsers: UserTableRow[] = [];

  ngOnInit(): void {
    this.userService
      .getUsers(this.getFiltersObject())
      .subscribe((res: ApiResponse<UserTableRow[]>) => {
        this.allUsers = res.data;
        this.totalResults = res.total;
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

  onModeChange(mode: PaginationMode): void {
    // handle mode change from toggle component if needed
    // currently we don't change table behavior here, but parent can react
    console.log('Pagination mode changed:', mode);
  }

  previousPage(): void {
    if (!this.hasPreviousPage) {
      return;
    }
    this.page -= 1;
    this.updateFilters(true); // Keep the current page when navigating
  }

  nextPage(): void {
    if (!this.hasNextPage) {
      return;
    }
    this.page += 1;
    this.updateFilters(true); // Keep the current page when navigating
  }

  sortTable(field: UserSortField): void {
    const isSameField = this.currentSortField === field;
    this.sortDirection = isSameField && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.currentSortField = field;

    this.updateFilters(true); // Keep the current page when sorting
  }

  updateFilters(keepPage = false): void {
    this.page = keepPage ? this.page : 1;
    this.userService
      .getUsers(this.getFiltersObject())
      .subscribe((res: ApiResponse<UserTableRow[]>) => {
        this.allUsers = res.data;
        this.totalResults = res.total;
      });
  }

  resetFilters(): void {
    this.fullNameQuery = '';
    this.emailQuery = '';
    this.page = 1;
    this.currentSortField = null;
    this.sortDirection = 'asc';

    this.updateFilters();
  }

  private getFiltersObject(): UserListFilters {
    return {
      fullNameQuery: this.fullNameQuery,
      emailQuery: this.emailQuery,
      page: this.page,
      pageSize: this.pageSize,
      sortField: this.currentSortField,
      sortDirection: this.sortDirection,
    };
  }
}
