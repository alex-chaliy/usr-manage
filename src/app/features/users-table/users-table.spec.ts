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
    component.currentSortField.set('age');
    component.sortDirection.set('asc');
    const getFilteredUsersSpy = spyOn(component, 'getFilteredUsers');

    component.sortTable('age');

    expect(component.currentSortField()).toBe('age');
    expect(component.sortDirection()).toBe('desc');
    expect(getFilteredUsersSpy).toHaveBeenCalledTimes(1);
    expect(getFilteredUsersSpy.calls.mostRecent().args[0]).toEqual({
      keepOffset: false,
    });
  });

  it('sets new sort field and resets direction to asc', () => {
    component.currentSortField.set('age');
    component.sortDirection.set('desc');
    const getFilteredUsersSpy = spyOn(component, 'getFilteredUsers');

    component.sortTable('email');

    expect(component.currentSortField()).toBe('email');
    expect(component.sortDirection()).toBe('asc');
    expect(getFilteredUsersSpy).toHaveBeenCalledTimes(1);
    expect(getFilteredUsersSpy.calls.mostRecent().args[0]).toEqual({
      keepOffset: false,
    });
  });

  it('builds filters object correctly', () => {
    component.fullNameQuery.set('John');
    component.emailQuery.set('example@x.com');
    component.offset.set(2);
    component.limit.set(25);
    component.currentSortField.set('email');
    component.sortDirection.set('desc');
    component.chosenPositionId.set('pos-1');
    component.chosenLevelId.set('level-2');
    component.chosenTechId.set('tech-3');
    component.chosenEmploymentTypeId.set('emp-4');

    const filters = (component as unknown as { getFiltersObject: () => Record<string, unknown> }).getFiltersObject();

    expect(filters['fullNameQuery']).toBe('John');
    expect(filters['emailQuery']).toBe('example@x.com');
    expect(filters['offset']).toBe(2);
    expect(filters['limit']).toBe(25);
    expect(filters['sortField']).toBe('email');
    expect(filters['sortDirection']).toBe('desc');
    expect(filters['positionQuery']).toBe('pos-1');
    expect(filters['levelQuery']).toBe('level-2');
    expect(filters['techQuery']).toBe('tech-3');
    expect(filters['employmentTypeQuery']).toBe('emp-4');
  });
});
