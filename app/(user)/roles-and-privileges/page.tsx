'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import RolesTab from './(tabs)/rolesTab';
import UsersTab from './(tabs)/usersTab';

const tabs = [
  { value: 'manage_roles', label: 'Manage Roles' },
  { value: 'manage_users', label: 'Manage Users' },
];

const RolesAndPrivileges = () => {
  const [activeTab, setActiveTab] = useState('manage_roles');

  return (
    <div className='mt-8'>
      {/* Tab Navigation */}
      <div className='border-b border-border mb-0'>
        <div className='flex gap-0'>
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              variant='tab'
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'border-b-2',
                activeTab === tab.value
                  ? 'border-[#FC6401] text-[#FC6401]'
                  : 'border-transparent text-muted-foreground',
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className='mt-4'>
        {activeTab === 'manage_roles' && <RolesTab />}
        {activeTab === 'manage_users' && <UsersTab />}
      </div>
    </div>
  );
};

export default RolesAndPrivileges;
