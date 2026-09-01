import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserService } from '../../services/user-service';
import { UsersTable } from './users-table';

class MockUserService {
  getUsers() {
    return of({ data: [], total: 0 });
  }
  getPositions() {
    return of({ data: [], total: 0 });
  }
  getLevels() {
    return of({ data: [], total: 0 });
  }
  getTechs() {
    return of({ data: [], total: 0 });
  }
  getEmploymentTypes() {
    return of({ data: [], total: 0 });
  }
}

describe('Users Table', () => {
  let component: UsersTable;
  let fixture: ComponentFixture<UsersTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTable],
      providers: [{ provide: UserService, useClass: MockUserService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggles sort direction when sorting the same field', () => {
    component.currentSortField = 'age';
    component.sortDirection = 'asc';
    let called = false;
    let receivedArg: boolean | undefined = undefined;
    component.getFilteredUsers = ((keepPage?: boolean, _sumChunk?: boolean): void => {
      called = true;
      receivedArg = keepPage;
    }) as UsersTable['getFilteredUsers'];
    component.sortTable('age');
    expect(component.currentSortField).toBe('age');
    expect(component.sortDirection).toBe('desc');
    expect(called).toBe(true);
    expect(receivedArg).toBe(true);
  });

  it('sets new sort field and resets direction to asc', () => {
    component.currentSortField = 'age';
    component.sortDirection = 'desc';
    let called = false;
    let receivedArg: boolean | undefined = undefined;
    component.getFilteredUsers = ((keepPage?: boolean, _sumChunk?: boolean): void => {
      called = true;
      receivedArg = keepPage;
    }) as UsersTable['getFilteredUsers'];
    component.sortTable('email');
    expect(component.currentSortField).toBe('email');
    expect(component.sortDirection).toBe('asc');
    expect(called).toBe(true);
    expect(receivedArg).toBe(true);
  });

  it('builds filters object correctly', () => {
    component.fullNameQuery = 'John';
    component.emailQuery = 'example@x.com';
    component.page = 2;
    component.pageSize = 25;
    component.currentSortField = 'email';
    component.sortDirection = 'desc';
    component.chosenPositionId = 'pos-1';
    component.chosenLevelId = 'level-2';
    component.chosenTechId = 'tech-3';
    component.chosenEmploymentTypeId = 'emp-4';

    const filters = (component as unknown as { getFiltersObject: () => Record<string, unknown> }).getFiltersObject();

    expect(filters['fullNameQuery']).toBe('John');
    expect(filters['emailQuery']).toBe('example@x.com');
    expect(filters['page']).toBe(2);
    expect(filters['pageSize']).toBe(25);
    expect(filters['sortField']).toBe('email');
    expect(filters['sortDirection']).toBe('desc');
    expect(filters['positionQuery']).toBe('pos-1');
    expect(filters['levelQuery']).toBe('level-2');
    expect(filters['techQuery']).toBe('tech-3');
    expect(filters['employmentTypeQuery']).toBe('emp-4');
  });
});
