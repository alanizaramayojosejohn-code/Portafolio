export interface ExperienceEntry {
  period: string;
  title?: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  link: string;
  image: string;
  headerGradient: string;
  category: string;
}
