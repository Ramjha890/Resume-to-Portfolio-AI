import React from 'react';
import { PortfolioData } from '../types';
import { ModernDeveloper } from './ModernDeveloper';
import { MinimalProfessional } from './MinimalProfessional';
import { DarkPremium } from './DarkPremium';
import { CreativeDesigner } from './CreativeDesigner';
import { AIEngineer } from './AIEngineer';
import { StudentPortfolio } from './StudentPortfolio';
import { CorporateProfessional } from './CorporateProfessional';
import { GlassmorphismPortfolio } from './GlassmorphismPortfolio';

interface TemplateRendererProps {
  templateId: string;
  data: PortfolioData;
}

export const TEMPLATE_METADATA = [
  {
    id: 'modern-developer',
    name: 'Modern Developer',
    category: 'Engineering',
    description: 'Terminal-inspired accents, sleek dark UI, monospace badges, and high-contrast engineering focus.',
    color: '#8b5cf6',
  },
  {
    id: 'minimal-professional',
    name: 'Minimal Professional',
    category: 'Editorial',
    description: 'Spacious editorial serif typography, crisp whitespace, and elegant monochromatic presentation.',
    color: '#0f172a',
  },
  {
    id: 'dark-premium',
    name: 'Dark Premium',
    category: 'Cyber & Systems',
    description: 'Obsidian backdrop with glowing cyber emerald and cyan neon borders for systems builders.',
    color: '#10b981',
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    category: 'Design & UI/UX',
    description: 'Vibrant sunset gradients, playful typography, visual showcase cards, and bold interactive elements.',
    color: '#f43f5e',
  },
  {
    id: 'ai-engineer',
    name: 'AI Engineer',
    category: 'AI & Data Science',
    description: 'Electric indigo neural motifs, benchmark metrics, model highlights, and research publication tags.',
    color: '#6366f1',
  },
  {
    id: 'student-portfolio',
    name: 'Student Portfolio',
    category: 'Academic & Internships',
    description: 'Fresh, energetic layout highlighting coursework, hackathons, and early internships.',
    color: '#0284c7',
  },
  {
    id: 'corporate-professional',
    name: 'Corporate Professional',
    category: 'Executive & Leadership',
    description: 'Authoritative navy with subtle gold accents, executive summary spotlight, and leadership impact.',
    color: '#eab308',
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism Portfolio',
    category: 'Modernist',
    description: 'Ethereal frosted glass blur panels, ambient mesh gradients, and floating futuristic cards.',
    color: '#a855f7',
  },
];

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ templateId, data }) => {
  switch (templateId) {
    case 'minimal-professional':
      return <MinimalProfessional data={data} />;
    case 'dark-premium':
      return <DarkPremium data={data} />;
    case 'creative-designer':
      return <CreativeDesigner data={data} />;
    case 'ai-engineer':
      return <AIEngineer data={data} />;
    case 'student-portfolio':
      return <StudentPortfolio data={data} />;
    case 'corporate-professional':
      return <CorporateProfessional data={data} />;
    case 'glassmorphism':
      return <GlassmorphismPortfolio data={data} />;
    case 'modern-developer':
    default:
      return <ModernDeveloper data={data} />;
  }
};
