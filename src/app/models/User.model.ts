import { SortDirection } from './Sort.model';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  address: string;
  phone: string;
  positionId: string;
  levelId: string;
  experienceYears: number;
  primaryTechId: string;
  secondaryTechIds: string[];
  salaryMonthly: number;
  employmentTypeId: string;
  isRemote: boolean;
  isActive: boolean;
}

export interface UserTableRow {
  id: string;
  fullName: string;
  email: string;
  position: string;
  level: string;
  primaryTech: string;
  employmentType: string;
  age: number;
  salaryMonthly: number;
}

export type UserSortField =
  'salaryMonthly' | 'age' | 'fullName' | 'firstName' | 'lastName' | 'email';

export interface UserListFilters {
  fullNameQuery: string;
  emailQuery: string;
  page: number;
  pageSize: number;
  sortField: UserSortField | null;
  sortDirection: SortDirection;

  positionQuery: string;
  levelQuery: string;
  techQuery: string;
  employmentTypeQuery: string;
}
