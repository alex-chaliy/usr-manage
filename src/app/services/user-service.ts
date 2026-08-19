import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { data } from '../../data/mock_data';
import { User, UserSortField, UserTableRow } from '../models/User.model';

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

  getUsers(): Observable<UserTableRow[]> {
    return of(this.userList);
  }

  searchUsersByFullName(fullName: string): Observable<UserTableRow[]> {
    const query = fullName.trim().toLowerCase();
    this.userList = this.userList.filter((u) => {
      const fullNameValue = (u.fullName || '').toLowerCase();
      return !query || fullNameValue.includes(query);
    });
    return of(this.userList);
  }

  searchUsersByEmail(email: string): Observable<UserTableRow[]> {
    const query = email.trim().toLowerCase();
    this.userList = this.userList.filter((u) => {
      const emailValue = (u.email || '').toLowerCase();
      return !query || emailValue.includes(query);
    });
    return of(this.userList);
  }

  resetUserList(): Observable<UserTableRow[]> {
    this.userList = this.mapUsersData(data.users as User[]);
    return of(this.userList);
  }

  sortBy(field: UserSortField, order: 'asc' | 'desc'): Observable<UserTableRow[]> {
    const sortedUsers = [...this.userList].sort((a, b) => {
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

    this.userList = sortedUsers;
    return of(this.userList);
  }
}
