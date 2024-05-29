import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Popover from '@mui/material/Popover';
import NotificationIcon from './NotificationIcon';
import NotificationTray from './NotificationTray';
import { AppConfiguration } from './interfaces/Notifications';

const NotificationComponent: React.FC<AppConfiguration> = ({appConfiguration}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <Box>
    <CssBaseline />
    <NotificationIcon onClick={handleIconClick} appConfiguration ={ appConfiguration } />
    <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
      <NotificationTray open={open} appConfiguration = { appConfiguration } />
      </Popover>
    </Box>
  );
};

export default NotificationComponent;
