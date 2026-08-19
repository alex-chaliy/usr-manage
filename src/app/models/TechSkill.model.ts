export type TechSkillCategory =
  | 'LANGUAGE'
  | 'FRAMEWORK'
  | 'RUNTIME'
  | 'DEVOPS'
  | 'CLOUD'
  | 'DATABASE'
  | 'INFRA'
  | 'TOOLING'
  | 'TESTING';

export interface TechSkill {
  id: string;
  name: string;
  category: TechSkillCategory;
}
