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

export type UserSortField = 'salaryMonthly' | 'age' | 'firstName' | 'lastName';
