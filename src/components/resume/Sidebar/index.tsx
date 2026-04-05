import { FC } from 'react';
import clsx from 'clsx';

import type {
  College,
  ExperienceData,
  SkillLevel,
  SkillSetData,
  SocialLink as SocialLinkData,
} from '@/types/resume';
import SocialLink from './SocialLink';
import SkillList from './SkillList';
import TimelineList from '../TimelineList';

const COLLEGE_NAME_MAP = {
  ntu: 'National Taiwan University',
  nchu: 'National Chung Hsing University',
} as const;

interface SidebarProps {
  socialLinks: ReadonlyArray<SocialLinkData>;
  skillSet: SkillSetData;
  education: ExperienceData<College>;
  printEmail?: string;
}
const Sidebar: FC<SidebarProps> = ({ socialLinks, skillSet, education, printEmail }) => (
  <aside
    className={clsx(
      'glass-sidebar animate-fade-in-left flex flex-col gap-8 p-6',
      // Borders & Background
      'border-b border-slate-100 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[20px_20px]',
      'dark:border-white/5 dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]',
      // Responsive (MD)
      'md:border-r md:border-b-0 md:p-8',
      // Print Styles
      'print:gap-2 print:border-r print:border-b-0 print:border-slate-300',
      'print:bg-slate-50 print:bg-none print:p-4 print:text-[10px] print:text-slate-900'
    )}
  >
    {/* Contact Section */}
    <div>
      <div
        className={clsx(
          'mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase',
          'dark:text-slate-500',
          'print:mb-2 print:border-b print:border-slate-300 print:pb-1 print:text-[11px] print:text-slate-600'
        )}
      >
        Contact
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1 print:grid-cols-1 print:gap-1.5">
        {socialLinks.map((e) => (
          <SocialLink key={e.name} socialLink={e} printEmail={printEmail} />
        ))}
      </div>
    </div>

    {/* Skills Section */}
    <div>
      <div
        className={clsx(
          'mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase',
          'dark:text-slate-500',
          'print:mb-2 print:break-after-avoid print:border-b print:border-slate-300 print:pb-1 print:text-[11px] print:text-slate-600'
        )}
      >
        Skills
      </div>
      <div className="flex flex-col gap-6 print:gap-2">
        {Object.entries(skillSet).map(([skillType, skills], i) => (
          <SkillList key={i} level={skillType as SkillLevel} skills={skills} />
        ))}
      </div>
    </div>

    {/* Education Section (Compact) */}
    <TimelineList
      title="Education"
      data={education}
      nameMap={COLLEGE_NAME_MAP}
      compact
    />
  </aside>
);

export default Sidebar;
