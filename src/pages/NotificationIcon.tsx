import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/NotificationsNone';
import { fetchNotificationCount } from '../services/InappNotificationServices';
import useSocketConnection from '../utils/useSocketConnection';
import { eventTypeEnum, socketEvents } from '../constants/constants';
import { AppConfiguration } from './interfaces/Notifications';

interface NotificationIconProps {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  appConfiguration: {
    apiKey: string;
    userId: string;
    appId: string;
    host: string;
  };
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ onClick, appConfiguration }) => {
  const [count, setCount] = useState<number>(0);

  const event = socketEvents.notificationBadge;
  const userRoom = `${event}:room:${appConfiguration.appId}:${appConfiguration.userId}`;

  const handleSocket = (data: any) => {
    if (data.type !== eventTypeEnum.reset) {
      setCount((prevCount) => prevCount ? prevCount + 1 : 1);
    } else {
      setCount(0);
    }
  };

  useSocketConnection(appConfiguration, event, userRoom, handleSocket);
  useEffect(() => {
    const getNotificationCount = async () => {
      try {
        const count = await fetchNotificationCount(appConfiguration);
        setCount(count);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    getNotificationCount();
  }, []);

  return (
    <IconButton color="inherit" onClick={onClick}>
      <Badge badgeContent={count} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationIcon;
