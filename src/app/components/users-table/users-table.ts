import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { data } from '../../../data/mock_data';
import { User, UserSortField } from '../../models/User';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';

const PAGE_SIZE = 20;

interface UserTableRow {
  fullName: string;
  email: string;
  position: string;
  level: string;
  primaryTech: string;
  employmentType: string;
  age: number;
  salaryMonthly: number;
}

@Component({
  selector: 'app-users-table',
  imports: [FormsModule, MatTableModule, CurrencyPipe],
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

  toggleValue = false;
  nameQuery = '';
  emailQuery = '';
  currentSortField: UserSortField | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  page = 1;
  pageSize = PAGE_SIZE;
  totalResults = 0;
  allUsers: UserTableRow[] = [];
  dataSource: UserTableRow[] = [];

  private readonly positionMap = new Map(data.positions.map((position) => [position.id, position.name]));
  private readonly levelMap = new Map(data.levels.map((level) => [level.id, level.name]));
  private readonly techMap = new Map(data.tech.map((tech) => [tech.id, tech.name]));
  private readonly employmentTypeMap = new Map(
    data.employmentTypes.map((employmentType) => [employmentType.id, employmentType.name]),
  );

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.pageSize));
  }

  get hasPreviousPage(): boolean {
    return this.page > 1;
  }

  get hasNextPage(): boolean {
    return this.page < this.totalPages;
  }

  get filteredUsers(): UserTableRow[] {
    const name = this.nameQuery.trim().toLowerCase();
    const email = this.emailQuery.trim().toLowerCase();

    return this.allUsers.filter((user) => {
      const matchesName = !name || user.fullName.toLowerCase().includes(name);
      const matchesEmail = !email || user.email.toLowerCase().includes(email);

      return matchesName && matchesEmail;
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.allUsers = users.map((user) => ({
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        position: this.positionMap.get(user.positionId) ?? 'Unknown',
        level: this.levelMap.get(user.levelId) ?? 'Unknown',
        primaryTech: this.techMap.get(user.primaryTechId) ?? 'Unknown',
        employmentType: this.employmentTypeMap.get(user.employmentTypeId) ?? 'Unknown',
        age: user.age,
        salaryMonthly: user.salaryMonthly,
      }));

      this.totalResults = this.allUsers.length;
      this.applyPage();
    });
  }

  toggle(): void {
    this.toggleValue = !this.toggleValue;
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

    this.userService.sortBy(field, this.sortDirection).subscribe((users: User[]) => {
      this.allUsers = users.map((user) => ({
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        position: this.positionMap.get(user.positionId) ?? 'Unknown',
        level: this.levelMap.get(user.levelId) ?? 'Unknown',
        primaryTech: this.techMap.get(user.primaryTechId) ?? 'Unknown',
        employmentType: this.employmentTypeMap.get(user.employmentTypeId) ?? 'Unknown',
        age: user.age,
        salaryMonthly: user.salaryMonthly,
      }));

      this.applyPage();
    });
  }

  private applyPage(): void {
    const filteredUsers = this.filteredUsers;
    this.totalResults = filteredUsers.length;

    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.dataSource = filteredUsers.slice(startIndex, endIndex);
  }

  updateFilters(): void {
    this.page = 1;
    this.applyPage();
  }

  resetFilters(): void {
    this.nameQuery = '';
    this.emailQuery = '';
    this.page = 1;
    this.currentSortField = null;
    this.sortDirection = 'asc';
    this.userService.resetUserList().subscribe((users: User[]) => {
      this.allUsers = users.map((user) => ({
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        position: this.positionMap.get(user.positionId) ?? 'Unknown',
        level: this.levelMap.get(user.levelId) ?? 'Unknown',
        primaryTech: this.techMap.get(user.primaryTechId) ?? 'Unknown',
        employmentType: this.employmentTypeMap.get(user.employmentTypeId) ?? 'Unknown',
        age: user.age,
        salaryMonthly: user.salaryMonthly,
      }));

      this.applyPage();
    });
  }
}
