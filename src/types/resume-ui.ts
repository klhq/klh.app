import type { SkillLevel } from './resume';

export type ResumeDictionary = {
  pageTitle: string;
  sections: {
    contact: string;
    skills: string;
    workExperience: string;
    education: string;
  };
  skillLevels: Record<SkillLevel, string>;
};
