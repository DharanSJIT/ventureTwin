import React from 'react';
import { useAuthStore } from '../store/authStore';
import FounderStudio from './FounderStudio';
import CodeStudio from './CodeStudio';
import DesignStudio from './DesignStudio';
import DataLab from './DataLab';

export default function StudioRouter() {
  const { user } = useAuthStore();
  const path = user?.careerPath || 'software_engineering';

  if (path === 'startup_founder') {
    return <FounderStudio />;
  }

  if (path === 'product_design') {
    return <DesignStudio />;
  }

  if (path === 'data_science') {
    return <DataLab />;
  }

  // Default
  return <CodeStudio />;
}
