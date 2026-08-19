import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { UserSortField, UserTableRow } from '../../models/User.model';
import { PaginationMode } from '../../models/Pagination.model';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { TogglePaginationMode } from '../toggle-pagination-mode/toggle-pagination-mode';
import { DEFAULT_PAGE_SIZE } from '../../constants/pagination.constants';
import { SortDirection } from '../../models/Sort.model';

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
  dataSource: UserTableRow[] = [];

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.pageSize));
  }

  get hasPreviousPage(): boolean {
    return this.page > 1;
  }

  get hasNextPage(): boolean {
    return this.page < this.totalPages;
  }

  // filtering is handled by UserService; component keeps the current `allUsers` list

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users: UserTableRow[]) => {
      this.allUsers = users;
      this.totalResults = this.allUsers.length;
      this.applyPage();
    });
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
    this.applyPage();
  }

  nextPage(): void {
    if (!this.hasNextPage) {
      return;
    }

    this.page += 1;
    this.applyPage();
  }

  sortTable(field: UserSortField): void {
    const isSameField = this.currentSortField === field;
    this.sortDirection = isSameField && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.currentSortField = field;

    this.userService.sortBy(field, this.sortDirection).subscribe((users: UserTableRow[]) => {
      this.allUsers = users;
      this.applyPage();
    });
  }

  private applyPage(): void {
    this.totalResults = this.allUsers.length;

    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.dataSource = this.allUsers.slice(startIndex, endIndex);
  }

  updateFilters(): void {
    this.page = 1;

    this.userService.resetUserList().subscribe(() => {
      const name = this.fullNameQuery.trim();
      const email = this.emailQuery.trim();

      if (name) {
        this.userService.searchUsersByFullName(name).subscribe((users: UserTableRow[]) => {
          if (email) {
            this.userService.searchUsersByEmail(email).subscribe((users2: UserTableRow[]) => {
              this.allUsers = users2;
              this.applyPage();
            });
          } else {
            this.allUsers = users;
            this.applyPage();
          }
        });
      } else if (email) {
        this.userService.searchUsersByEmail(email).subscribe((users: UserTableRow[]) => {
          this.allUsers = users;
          this.applyPage();
        });
      } else {
        this.userService.getUsers().subscribe((users: UserTableRow[]) => {
          this.allUsers = users;
          this.applyPage();
        });
      }
    });
  }

  resetFilters(): void {
    this.fullNameQuery = '';
    this.emailQuery = '';
    this.page = 1;
    this.currentSortField = null;
    this.sortDirection = 'asc';
    this.userService.resetUserList().subscribe((users: UserTableRow[]) => {
      this.allUsers = users;
      this.applyPage();
    });
  }
}
