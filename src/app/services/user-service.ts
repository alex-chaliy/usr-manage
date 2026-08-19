import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { data } from '../../data/mock_data';
import { User, UserSortField } from '../models/User';

@Injectable({ providedIn: 'root' })
export class UserService {
  userList: User[] = data.users as User[];

  getUsers(): Observable<User[]> {
    return of(this.userList);
  }

  searchUsersByName(name: string): Observable<User[]> {
    this.userList = this.userList.filter((u) => u.firstName === name || u.lastName === name);
    return of(this.userList);
  }

  searchUsersByEmail(email: string): Observable<User[]> {
    this.userList = this.userList.filter((u) => u.email === email);
    return of(this.userList);
  }

  resetUserList(): Observable<User[]> {
    this.userList = data.users as User[];
    return of(this.userList);
  }

  sortBy(field: UserSortField, order: 'asc' | 'desc'): Observable<User[]> {
    this.userList.sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return order === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });

    return of(this.userList);
  }

}
