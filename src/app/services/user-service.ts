import { delay, Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';

import { data } from '../../data/mock_data';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination.constants';
import { ApiResponse } from '../models/ApiInteraction.model';
import { EmploymentType } from '../models/EmploymentType.model';
import { Level } from '../models/Level.model';
import { Position } from '../models/Position.model';
import { TechSkill } from '../models/TechSkill.model';
import { User, UserAggrageted, UserListFilters, UserSortField } from '../models/User.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly positionMap: Position[] = [...data.positions];
  private readonly levelMap: Level[] = [...data.levels];
  private readonly techMap: TechSkill[] = [...data.tech];
  private readonly employmentTypeMap: EmploymentType[] = [...data.employmentTypes];

  userList: UserAggrageted[] = this.mapUsersData(data.users as User[]);

  private mapUsersData(users: User[]): UserAggrageted[] {
    return users.map((user) => ({
      ...user,
      position: this.positionMap.find((p) => p.id === user.positionId) || null,
      level: this.levelMap.find((l) => l.id === user.levelId) || null,
      primaryTech: this.techMap.find((t) => t.id === user.primaryTechId) || null,
      secondaryTechs:
        this.techMap.filter((t) =>
          user.secondaryTechIds.some((userTechId) => t.id === userTechId),
        ) || null,
      employmentType: this.employmentTypeMap.find((et) => et.id === user.employmentTypeId) || null,
    }));
  }

  getUsers(filters: UserListFilters): Observable<ApiResponse<UserAggrageted[]>> {
    return this.applyFilters(filters).pipe(delay(600)); // Imitate network delay
  }

  private applyFilters(filters: UserListFilters): Observable<ApiResponse<UserAggrageted[]>> {
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

    return of(this.slicePage(users, filters.offset, filters.limit));
  }

  private slicePage(
    userList: UserAggrageted[],
    offset: number,
    pageSize: number,
  ): ApiResponse<UserAggrageted[]> {
    const endIndex = offset + pageSize;
    return {
      data: userList.slice(offset, endIndex),
      offset: offset,
      limit: pageSize,
      total: userList.length,
    };
  }

  private searchUsersByFullName(users: UserAggrageted[], fullName: string): UserAggrageted[] {
    const query = fullName.toLowerCase();
    return users.filter((u) => {
      const fullNameValue = `${u.firstName} ${u.lastName}`.toLowerCase();
      return fullNameValue.includes(query);
    });
  }

  private searchUsersByEmail(users: UserAggrageted[], email: string): UserAggrageted[] {
    const query = email.trim().toLowerCase();
    return users.filter((u) => {
      const emailValue = (u.email || '').toLowerCase();
      return !query || emailValue.includes(query);
    });
  }

  private searchUsersByPosition(users: UserAggrageted[], positionId: string): UserAggrageted[] {
    return users.filter((u) => u.positionId === positionId);
  }

  private searchUsersByLevel(users: UserAggrageted[], levelId: string): UserAggrageted[] {
    return users.filter((u) => u.levelId === levelId);
  }

  private searchUsersByPrimaryTech(
    users: UserAggrageted[],
    primaryTechId: string,
  ): UserAggrageted[] {
    return users.filter((u) => u.primaryTechId === primaryTechId);
  }

  private searchUsersByEmploymentType(
    users: UserAggrageted[],
    employmentTypeId: string,
  ): UserAggrageted[] {
    return users.filter((u) => u.employmentTypeId === employmentTypeId);
  }

  private sortBy(
    users: UserAggrageted[],
    field: UserSortField,
    order: 'asc' | 'desc',
  ): UserAggrageted[] {
    return [...users].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        const comparison = valueA.localeCompare(valueB);
        return order === 'asc' ? comparison : -comparison;
      }

      const comparison = Number(valueA) - Number(valueB);
      return order === 'asc' ? comparison : -comparison;
    });
  }

  getPositions(): Observable<ApiResponse<Position[]>> {
    return of({
      data: this.positionMap,
      offset: 0,
      limit: this.positionMap?.length,
      total: this.positionMap.length,
    }).pipe(delay(1000)); // Imitate network delay
  }

  getLevels(): Observable<ApiResponse<Level[]>> {
    return of({
      data: this.levelMap,
      offset: 0,
      limit: this.levelMap.length,
      total: this.levelMap.length,
    }).pipe(delay(1200)); // Imitate network delay
  }

  getTechs(): Observable<ApiResponse<TechSkill[]>> {
    return of({
      data: this.techMap,
      offset: 0,
      limit: this.techMap.length,
      total: this.techMap.length,
    }).pipe(delay(500)); // Imitate network delay
  }

  getEmploymentTypes(): Observable<ApiResponse<EmploymentType[]>> {
    return of({
      data: this.employmentTypeMap,
      offset: 0,
      limit: this.employmentTypeMap.length,
      total: this.employmentTypeMap.length,
    }).pipe(delay(2000)); // Imitate network delay
  }
}
