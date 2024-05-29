import DOMPurify from 'dompurify';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { fetchNotificationList, markNotificationAsRead, markNotificationAsSeen } from '../services/InappNotificationServices';
import { AppConfiguration, Notification, PaginatedNotifications } from './interfaces/Notifications';
import { ListItemButton, ListItemSecondaryAction, Typography } from '@mui/material';
import styled from 'styled-components';
import { Notifications } from '@mui/icons-material';

const HoverEffectSpan = styled.span`
  display: inline-block;
  width: 5px;
  height: 5px;
  background-color: #42a5f5;
  border-radius: 50%;
  margin-right: -15px;

  &:hover {
    box-shadow: 0 0 10px rgba(66, 165, 245, 0.7);
    border-radius: 50%;
    width: 8px;
    height: 8px;
  }
`;

interface NotificationTrayProps {
  open: boolean;
  appConfiguration: {
    apiKey: string;
    userId: string;
    appId: string;
    host: string;
  };
}

interface PaginationProperties {
  page: number;
  limit: number;
}

const getGroupNotifications = (notifications: Notification[]) => {

  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'days').startOf('day');
  
  const grouped: Record<string, Notification[]> = {
    Today: [],
    Yesterday: [],
    Older: []
  };

  if (notifications.length === 0) {
    return {};
  }

  for (const notification of notifications) {
    const createdAt = moment(notification.created_at);
  
    if (createdAt.isSameOrAfter(today)) {
      grouped.Today.push(notification);
    } else if (createdAt.isSameOrAfter(yesterday)) {
      grouped.Yesterday.push(notification);
    } else {
      grouped.Older.push(notification);
    }
  
  }

  if (grouped.Today?.length === 0) {
    delete grouped.Today;
  }
  if (grouped.Yesterday?.length === 0) {
    delete grouped.Yesterday;
  }
  if (grouped.Older?.length === 0) {
    delete grouped.Older;
  }
  if (grouped.Today?.length === 0 && grouped.Yesterday?.length === 0) {
    grouped.Latest = grouped.Older;
    delete grouped.Older;
  }

  return grouped;
};

const mergedGroupedNotifications = (groupedNotifications: Record<string, Notification[]>, previousGroupedNotifications: Record<string, Notification[]>) => {
  const mergedGroupedNotifications = { ...previousGroupedNotifications };

  for (const [group, notifications] of Object.entries(groupedNotifications)) {
    if (mergedGroupedNotifications[group]) {
      mergedGroupedNotifications[group] = [...mergedGroupedNotifications[group], ...notifications];
    } else {
      mergedGroupedNotifications[group] = notifications;
    }
  }

  return mergedGroupedNotifications;
}

const formatTimeAgo = (timestamp: string) => {
  const now = moment();
  const notificationTime = moment(timestamp);
  return now.diff(notificationTime, 'seconds') < 60
    ? 'Just now'
    : now.diff(notificationTime, 'minutes') < 60
    ? `${now.diff(notificationTime, 'minutes')} minutes ago`
    : now.diff(notificationTime, 'hours') < 24
    ? `${now.diff(notificationTime, 'hours')} hours ago`
    : `${now.diff(notificationTime, 'days')} days ago`;
};

const NotificationTray: React.FC<NotificationTrayProps> = ({ open, appConfiguration }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groupNotifications, setGroupedNotifications] = useState<Record<string, Notification[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async (page: number) => {
    try {
      setLoading(true);
      const response: PaginatedNotifications = await fetchNotificationList({ ...appConfiguration }, page);
      setNotifications(prevNotifications => [...prevNotifications, ...response.data]);
      setTotalPages(response.total_pages);
      setGroupedNotifications(prevGroupNotifications => mergedGroupedNotifications(getGroupNotifications(response.data), prevGroupNotifications));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setCurrentPage(1); // Reset to first page on open
      setNotifications([]); // Clear previous notifications
      setGroupedNotifications({});
      fetchNotifications(1).then(() => markNotificationAsSeen(appConfiguration));
    }
  }, [open]);

  const handleClick = async (appConfiguration: {appId: string, apiKey: string, userId: string, host: string}, notificationId: string) => {
    await markNotificationAsRead(appConfiguration, notificationId);
  
    const updatedNotifications = notifications.map((notification) =>
      notification.inapp_notification_id === notificationId ? { ...notification, is_read: true } : notification
    );
  
    setNotifications(updatedNotifications);
    setGroupedNotifications(getGroupNotifications(updatedNotifications));
  };

  const handleItemClick = (notific: Notification) => {
    handleClick(appConfiguration, notific.inapp_notification_id);
    window.open(notific.link_uri, '_blank');
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchNotifications(nextPage);
  };

  return (
    <div>
      {Object.entries(groupNotifications).map(([group, groupednotification]) => (
        <List sx={{ bgcolor: 'background.paper' }}>
        <ListItem>
          <ListItemText primary={group} />
        </ListItem>
        {groupednotification.map((notification: Notification) => (
          <><ListItem button
            alignItems='flex-start'
            key={notification.inapp_notification_id}
            style={{ backgroundColor: notification.is_seen ? 'white' : '#ccc9c9', marginRight: '-3px' }}
            onClick={() => handleItemClick(notification)}>

            <ListItemAvatar >
              <Avatar alt={notification.actor_name || 'Profile'} src={notification.actor_image} />
            </ListItemAvatar>
            <ListItemText
              primary={notification.title}
              primaryTypographyProps={{ fontSize: 16, fontWeight: 'medium', marginTop: '-7px' }}
              secondary={<React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notification.body) }} />
                <Typography variant="caption" component="div" align="right" sx={{ marginTop: '-7px' }}>
                  {formatTimeAgo(notification.created_at)}
                </Typography>

                {!notification.is_read && (
                  <ListItemSecondaryAction>
                    <HoverEffectSpan onClick={(event) => {event.stopPropagation(); handleClick(appConfiguration, notification.inapp_notification_id)}} />
                  </ListItemSecondaryAction>
                )}
              </React.Fragment>} />
          </ListItem>
          <Divider variant="inset" component="li" /></>
        ))}
      </List>
      ))}
      {totalPages > currentPage && (
        <ListItemButton onClick={handleLoadMore} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} disabled={loading}>
          <ListItemText primary={loading ? "Loading..." : "Load more"} />
        </ListItemButton>
      )}
    </div>
  );
};

export default NotificationTray;
