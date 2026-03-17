import { DataPanel } from '@/components/Layout';
import { UserAvatarFile } from './UserAvatarFile';
import { UserProfileUpdate } from './UserProfileUpdate';

import classes from './profile.module.css';

export default function PageOptions() {
  return (
    <div className={classes.page}>
      <div className={classes.profileLayout}>
        <DataPanel
          title="Avatar"
          subtitle="Profile image and upload status"
          status={{ label: 'Account', tone: 'muted' }}
          variant="elevated"
        >
          <UserAvatarFile />
        </DataPanel>
        <DataPanel
          title="Profile Settings"
          subtitle="Public details and preferences"
          status={{ label: 'Editable', tone: 'live' }}
          variant="elevated"
        >
          <UserProfileUpdate />
        </DataPanel>
      </div>
    </div>
  );
}
