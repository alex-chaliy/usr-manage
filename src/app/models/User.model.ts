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
  'firstName' | 'email' | 'salaryMonthly' | 'age' ;

export interface UserListFilters {
  offset: number; // start index
  limit: number; // page size, how many items per page

  sortField: UserSortField | null;
  sortDirection: SortDirection;

  fullNameQuery: string;
  emailQuery: string;

  positionQuery: string; // position id
  levelQuery: string; // level id
  techQuery: string; // tech skill id
  employmentTypeQuery: string; // employment type id
}
