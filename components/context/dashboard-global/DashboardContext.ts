'use client';

import React, { Dispatch, SetStateAction } from 'react';

interface DashboardContextType {
  activeTableRow: any;
  setActiveTableRow: Dispatch<SetStateAction<any>>;

  
  detailsSliderOpen: boolean;
  setDetailsSliderOpen: Dispatch<SetStateAction<boolean>>;
}

const DashboardContext = React.createContext<DashboardContextType | null>(null);

export default DashboardContext;
