export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  description: string;
  location: string;
  email: string;
  phone?: string;
  website?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  bio: string;
  yearsExperience: number;
  specialization: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  startDate: string;
  endDate?: string; // null for current position
  description: string;
  technologies: string[];
  achievements?: string[];
  isCurrentRole?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'mobile' | 'database' | 'devops' | 'design' | 'other';
  proficiency: number; // 0-100
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  achievements?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
  linkedinUrl?: string;
  videoUrl?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface TrustedBrand {
  name: string;
  logo: string;
  url?: string;
}

export interface Portfolio {
  personalInfo: PersonalInfo;
  socialLinks: SocialLink[];
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  services: Service[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  trustedBrands: TrustedBrand[];
}
