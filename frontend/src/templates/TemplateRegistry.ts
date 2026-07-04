import type { User } from '../store/authStore';
import TemplateModern from './TemplateModern';
import TemplateTerminal from './TemplateTerminal';
import TemplateGlass from './TemplateGlass';
import TemplateMinimalist from './TemplateMinimalist';
import TemplateGrid from './TemplateGrid';
import TemplateNeobrutalism from './TemplateNeobrutalism';
import TemplateDarkPro from './TemplateDarkPro';
import TemplateStartup from './TemplateStartup';
import TemplateCreative from './TemplateCreative';
import TemplateExecutive from './TemplateExecutive';

export interface PortfolioProps {
  user: User;
}

export const templates: Record<string, {
  name: string;
  description: string;
  component: React.FC<PortfolioProps>;
}> = {
  modern: {
    name: 'Modern Clean',
    description: 'A minimalist, Apple-esque design focused on typography and whitespace.',
    component: TemplateModern
  },
  terminal: {
    name: 'Developer Terminal',
    description: 'A retro command-line aesthetic for hardcore developers.',
    component: TemplateTerminal
  },
  glass: {
    name: 'Glassmorphism',
    description: 'Frosted glass panels over vibrant gradient meshes.',
    component: TemplateGlass
  },
  minimalist: {
    name: 'Pure Minimalist',
    description: 'Ultra-clean, high typography layout focusing entirely on content.',
    component: TemplateMinimalist
  },
  grid: {
    name: 'Bento Grid',
    description: 'A modern, modular bento-box layout popularized by Apple.',
    component: TemplateGrid
  },
  neobrutalism: {
    name: 'Neobrutalism',
    description: 'Bold colors, hard shadows, high contrast. Very trendy for creative coders.',
    component: TemplateNeobrutalism
  },
  darkpro: {
    name: 'Dark Pro',
    description: 'A sleek, dark-mode developer portfolio with neon accents and grid lines.',
    component: TemplateDarkPro
  },
  startup: {
    name: 'SaaS Startup',
    description: 'Looks exactly like a high-end SaaS product landing page.',
    component: TemplateStartup
  },
  creative: {
    name: 'Creative Agency',
    description: 'Asymmetric layouts, large italic typography, and smooth transitions.',
    component: TemplateCreative
  },
  executive: {
    name: 'Executive Lead',
    description: 'Very professional, traditional structure but highly polished for corporate judges.',
    component: TemplateExecutive
  }
};
