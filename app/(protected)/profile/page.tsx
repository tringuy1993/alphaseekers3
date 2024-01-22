import { UserAvatarFile } from './UserAvatarFile';
import { UserProfileUpdate } from './UserProfileUpdate';

import classes from './profile.module.css';

export default function PageOptions() {
  return (
    // <Box className={classes.profileLayout}>
    <div className={classes.profileLayout}>
      <UserAvatarFile />
      <div>
        <UserProfileUpdate />
      </div>
    </div>

    // </Box>
  );
}
