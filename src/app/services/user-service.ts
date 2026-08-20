import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { data } from '../../data/mock_data';
import { User, UserListFilters, UserSortField, UserTableRow } from '../models/User.model';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination.constants';
import { ApiResponse } from '../models/ApiResponse.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly positionMap = new Map(
    data.positions.map((position) => [position.id, position.name]),
  );
  private readonly levelMap = new Map(data.levels.map((level) => [level.id, level.name]));
  private readonly techMap = new Map(data.tech.map((tech) => [tech.id, tech.name]));
  private readonly employmentTypeMap = new Map(
    data.employmentTypes.map((employmentType) => [employmentType.id, employmentType.name]),
  );

  userList: UserTableRow[] = this.mapUsersData(data.users as User[]);

  private mapUsersData(users: User[]): UserTableRow[] {
    return users.map((user) => ({
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      position: this.positionMap.get(user.positionId) ?? 'Unknown',
      level: this.levelMap.get(user.levelId) ?? 'Unknown',
      primaryTech: this.techMap.get(user.primaryTechId) ?? 'Unknown',
      employmentType: this.employmentTypeMap.get(user.employmentTypeId) ?? 'Unknown',
      age: user.age,
      salaryMonthly: user.salaryMonthly,
    }));
  }

  getUsers(filters: UserListFilters): Observable<ApiResponse<UserTableRow[]>> {
    return this.applyFilters(filters);
  }

  private applyFilters(filters: UserListFilters): Observable<ApiResponse<UserTableRow[]>> {
    if (!filters) {
      return of(this.slicePage(this.userList, 1, DEFAULT_PAGE_SIZE));
    }

    let users = [...this.userList];

    if (filters.fullNameQuery) {
      users = this.searchUsersByFullName(users, filters.fullNameQuery);
    }
    if (filters.emailQuery) {
      users = this.searchUsersByEmail(users, filters.emailQuery);
    }
    if (filters.sortField) {
      users = this.sortBy(users, filters.sortField, filters.sortDirection || 'asc');
    }

    return of(this.slicePage(users, filters.page, filters.pageSize));
  }

  private slicePage(
    userList: UserTableRow[],
    page: number,
    pageSize: number,
  ): ApiResponse<UserTableRow[]> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      data: userList.slice(startIndex, endIndex),
      offset: startIndex,
      limit: pageSize,
      total: userList.length,
    };
  }

  private searchUsersByFullName(users: UserTableRow[], fullName: string): UserTableRow[] {
    const query = fullName.trim().toLowerCase();
    return users.filter((u) => {
      const fullNameValue = (u.fullName || '').toLowerCase();
      return !query || fullNameValue.includes(query);
    });
  }

  private searchUsersByEmail(users: UserTableRow[], email: string): UserTableRow[] {
    const query = email.trim().toLowerCase();
    return users.filter((u) => {
      const emailValue = (u.email || '').toLowerCase();
      return !query || emailValue.includes(query);
    });
  }

  private sortBy(
    users: UserTableRow[],
    field: UserSortField,
    order: 'asc' | 'desc',
  ): UserTableRow[] {
    return [...users].sort((a, b) => {
      const valueA =
        field === 'fullName' || field === 'firstName' || field === 'lastName'
          ? a.fullName
          : a[field];
      const valueB =
        field === 'fullName' || field === 'firstName' || field === 'lastName'
          ? b.fullName
          : b[field];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        const comparison = valueA.localeCompare(valueB);
        return order === 'asc' ? comparison : -comparison;
      }

      const comparison = Number(valueA) - Number(valueB);
      return order === 'asc' ? comparison : -comparison;
    });
  }
}
