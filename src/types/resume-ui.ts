import type { College, Company, SkillLevel } from './resume';

export type ResumeDictionary = {
  pageTitle: string;
  sections: {
    contact: string;
    skills: string;
    workExperience: string;
    education: string;
  };
  skillLevels: Record<SkillLevel, string>;
  companyNames: Record<Company, string>;
  collegeNames: Record<College, string>;
};
