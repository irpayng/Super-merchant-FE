'use client';
import React, { useState } from 'react';
import { NavItemComponent } from '@/components/layout/sidebar';
import { NavItem } from '@/lib/navigation';
import NotificationSettings from '@/components/settings/NotificationSettings';
import ChangePin from '@/components/settings/ChangePin';
import ChangePassword from '@/components/settings/ChangePassword';

const settingsNav: NavItem[] = [
  { id: 'notification', name: 'Notifications', icon: 'Bell' },
  { id: 'change-password', name: 'Change Password', icon: 'ShieldCheck' },
  { id: 'change-pin', name: 'Change PIN', icon: 'KeyRound' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('notification');

  const renderContent = () => {
    switch (activeTab) {
      case 'notification':
        return <NotificationSettings />;
      case 'change-pin':
        return <ChangePin />;
      case 'change-password':
        return <ChangePassword />;
      default:
        return null;
    }
  };

  return (
    <div className='flex h-full'>
      <nav className='flex flex-col p-4 space-y-2 w-60 bg-card  h-full'>
        {settingsNav.map((item, itemIdx) => {
          return (
            <NavItemComponent
              key={itemIdx}
              item={item}
              activeId={activeTab}
              onClick={setActiveTab}
            />
          );
        })}
      </nav>
      <main className='flex-1 p-6 bg-background'>{renderContent()}</main>
    </div>
  );
};

export default Settings;
