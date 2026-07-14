import React from 'react';
import { Switch } from '../ui/switch';

const NotificationSettings = () => {
  const [emailEnabled, setEmailEnabled] = React.useState(false);
  const [smsEnabled, setSmsEnabled] = React.useState(true);

  return (
    <div className='max-w-xl divide-y divide-muted'>
      <div className='py-4'>
        <Switch
          label='Email notifications'
          checked={emailEnabled}
          onCheckedChange={(checked: boolean) => setEmailEnabled(checked)}
        />
      </div>
      <div className='py-4'>
        <Switch
          label='SMS notifications'
          checked={smsEnabled}
          onCheckedChange={(checked: boolean) => setSmsEnabled(checked)}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
