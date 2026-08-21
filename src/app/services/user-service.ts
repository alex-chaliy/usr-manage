import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { data } from '../../data/mock_data';
import { User, UserListFilters, UserSortField, UserTableRow } from '../models/User.model';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination.constants';
import { ApiResponse } from '../models/ApiInteraction.model';

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
      id: user.id,
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
    return this.applyFilters(filters)
      .pipe(delay(1000)); // Imitate network delay
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
    if (filters.positionQuery) {
      users = this.searchUsersByPosition(users, filters.positionQuery);
    }
    if (filters.levelQuery) {
      users = this.searchUsersByLevel(users, filters.levelQuery);
    }
    if (filters.techQuery) {
      users = this.searchUsersByPrimaryTech(users, filters.techQuery);
    }
    if (filters.employmentTypeQuery) {
      users = this.searchUsersByEmploymentType(users, filters.employmentTypeQuery);
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

  private searchUsersByPosition(users: UserTableRow[], position: string): UserTableRow[] {
    const query = position.trim().toLowerCase();
    return users.filter((u) => {
      const positionValue = (u.position || '').toLowerCase();
      return !query || positionValue === query;
    });
  }

  private searchUsersByLevel(users: UserTableRow[], level: string): UserTableRow[] {
    const query = level.trim().toLowerCase();
    return users.filter((u) => {
      const levelValue = (u.level || '').toLowerCase();
      return !query || levelValue === query;
    });
  }

  private searchUsersByPrimaryTech(users: UserTableRow[], primaryTech: string): UserTableRow[] {
    const query = primaryTech.trim().toLowerCase();
    return users.filter((u) => {
      const primaryTechValue = (u.primaryTech || '').toLowerCase();
      return !query || primaryTechValue === query;
    });
  }

  private searchUsersByEmploymentType(
    users: UserTableRow[],
    employmentType: string,
  ): UserTableRow[] {
    const query = employmentType.trim().toLowerCase();
    return users.filter((u) => {
      const employmentTypeValue = (u.employmentType || '').toLowerCase();
      return !query || employmentTypeValue === query;
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

  getPositions(): Observable<ApiResponse<Map<string, string>>> {
    return of({
      data: this.positionMap,
      offset: 0,
      limit: this.positionMap.size,
      total: this.positionMap.size,
    }).pipe(delay(1000)); // Imitate network delay
  }

  getLevels(): Observable<ApiResponse<Map<string, string>>> {
    return of({
      data: this.levelMap,
      offset: 0,
      limit: this.levelMap.size,
      total: this.levelMap.size,
    }).pipe(delay(1200)); // Imitate network delay
  }

  getTechs(): Observable<ApiResponse<Map<string, string>>> {
    return of({
      data: this.techMap,
      offset: 0,
      limit: this.techMap.size,
      total: this.techMap.size,
    }).pipe(delay(500)); // Imitate network delay
  }

  getEmploymentTypes(): Observable<ApiResponse<Map<string, string>>> {
    return of({
      data: this.employmentTypeMap,
      offset: 0,
      limit: this.employmentTypeMap.size,
      total: this.employmentTypeMap.size,
    }).pipe(delay(2000)); // Imitate network delay
  }
}
