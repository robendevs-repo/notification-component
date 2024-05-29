// src/constants.ts

export const NOTIFICATION_COUNT_ENDPOINT = "/api/v1/notifications/counts";
export const NOTIFICATION_LIST_ENDPOINT = "/api/v1/notifications/list-inapp";
export const MAKE_ALL_NOTIFICATIONS_SEEN_ENDPOINT = "/api/v1/notifications/make-seen";
export const MAKE_NOTIFICATION_AS_READ_ENDPOINT = "/api/v1/notifications/mark-read";


export const eventEnum = {
    NOTIFY_NOTIFICATION_COUNT_UPDATED: 'notifyNotificationCountUpdated',
    NOTIFY_NEW_NOTIFICATION_APEARED: 'notifyNewNotificationApeared',
};

export const socketEvents = {
    notificationBadge: 'notification-badge',
    notificationList: 'notification-list',
};

export const eventTypeEnum = {
    count: 'COUNT',
    reset: 'RESET',
    listUpdated: 'LIST_UPDATED',
};
