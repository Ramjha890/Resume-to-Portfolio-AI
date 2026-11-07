export interface User {
  id: number;
  full_name: string;
  email: string;
  is_admin: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Resume {
  id: number;
  user_id: number;
  original_filename: string;
  file_size: number;
  created_at: string;
  extracted_text_preview?: string;
  extracted_text?: string;
}

export interface SkillCategory {
  category_name: string;
  skills: string[];
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  gpa?: string;
  highlights: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  live_url?: string;
  github_url?: string;
  image_url?: string;
  featured: boolean;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issue_date?: string;
  url?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  date?: string;
}

export interface HeroSection {
  name: string;
  headline: string;
  summary: string;
  email: string;
  phone?: string;
  location?: string;
  avatar_url?: string;
  open_to_work: boolean;
  cta_primary_text: string;
  cta_secondary_text: string;
}

export interface AboutSection {
  title: string;
  bio: string;
  highlights: string[];
  years_of_experience?: string;
}

export interface ContactSection {
  title: string;
  subtitle: string;
  email: string;
  phone?: string;
  location?: string;
  enable_contact_form: boolean;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
  leetcode?: string;
  dribbble?: string;
  other?: string;
}

export interface StylingConfig {
  theme_mode: 'dark' | 'light';
  primary_color: string;
  font_family: string;
  custom_accent?: string;
}

export interface PortfolioData {
  hero: HeroSection;
  about: AboutSection;
  skills: SkillCategory[];
  work_experience: WorkExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  contact: ContactSection;
  social_links: SocialLinks;
  styling: StylingConfig;
  section_order: string[];
  section_visibility: Record<string, boolean>;
}

export interface Portfolio {
  id: number;
  user_id: number;
  portfolio_name: string;
  slug: string;
  template_id: string;
  portfolio_data: PortfolioData;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  visitor_count: number;
}

export interface AdminStats {
  total_users: number;
  total_resumes: number;
  total_portfolios: number;
  total_published_portfolios: number;
  total_views: number;
  recent_registrations: {
    id: number;
    full_name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
    portfolio_count: number;
    resume_count: number;
  }[];
  recent_activity: {
    id: number;
    user_id: number;
    activity_type: string;
    description: string;
    created_at: string;
  }[];
}
