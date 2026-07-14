"use client";

import { useContext } from 'react'
import DashboardRootContext from './DashboardContext';

const useDashboardProps = () => {
  const context = useContext(DashboardRootContext)

  if (!context) {
    throw new Error('useDashboardProps must be used within a MyProvider');
  }
  return context;
}

export default useDashboardProps