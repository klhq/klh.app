export type LandingDictionary = {
  hero: {
    greeting: string;
    tagline: string;
    availability?: string;
  };
  projects: {
    title: string;
    items: Array<{
      name: string;
      description: string;
      url?: string;
      tags?: string[];
    }>;
  };
  contact: {
    title: string;
    cta: string;
  };
  nav: {
    resume: string;
    blog: string;
  };
};
