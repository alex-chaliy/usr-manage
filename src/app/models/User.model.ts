import { EmploymentType } from './EmploymentType.model';
import { Level } from './Level.model';
import { Position } from './Position.model';
import { SortDirection } from './Sort.model';
import { TechSkill } from './TechSkill.model';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  address: string;
  phone: string;
  experienceYears: number;
  positionId: string;
  levelId: string;
  primaryTechId: string;
  secondaryTechIds: string[];
  salaryMonthly: number;
  employmentTypeId: string;
  isRemote: boolean;
  isActive: boolean;
}

export type UserAggrageted = User & {
  position: Position | null;
  level: Level | null;
  primaryTech: TechSkill | null;
  employmentType: EmploymentType | null;
  secondaryTechs: TechSkill[] | null;
}

export type UserSortField =
  'salaryMonthly' | 'age' | 'firstName' | 'lastName' | 'email';

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
