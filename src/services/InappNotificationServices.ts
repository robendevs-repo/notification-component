// src/apiService.ts

import axios from 'axios';
import { MAKE_ALL_NOTIFICATIONS_SEEN_ENDPOINT, MAKE_NOTIFICATION_AS_READ_ENDPOINT, NOTIFICATION_COUNT_ENDPOINT, NOTIFICATION_LIST_ENDPOINT } from '../constants/constants';
import { AppConfiguration, CountResponse, NotificationListResponse, PaginatedNotifications } from '../pages/interfaces/Notifications';

export const fetchNotificationCount = async (appConfiguration: { apiKey: string; appId: string; host: string; userId: string }): Promise<number> => {
  try {
    const response = await axios.get<CountResponse>(`http://${appConfiguration.host}${NOTIFICATION_COUNT_ENDPOINT}/${appConfiguration.userId}`,
        {
            headers: {
                'x-api-key': appConfiguration.apiKey
            },
        }
    );
    return response.data.data.count;
  } catch (error) {
    console.error("Error fetching notification count:", error);
    throw error;
  }
};

export const fetchNotificationList = async (appConfiguration: { apiKey: string; appId: string; host: string; userId: string }, page: number = 1): Promise<PaginatedNotifications> => {
  try {
    const response = await axios.get<NotificationListResponse>(`http://${appConfiguration.host}${NOTIFICATION_LIST_ENDPOINT}/${appConfiguration.userId}?page=${page}`,
        {
            headers: {
                'x-api-key': appConfiguration.apiKey
            },
        }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationAsSeen = async (appConfiguration: { apiKey: string; appId: string; host: string; userId: string }): Promise<void> => {
    try {
        await axios.post(`http://${appConfiguration.host}${MAKE_ALL_NOTIFICATIONS_SEEN_ENDPOINT}/${appConfiguration.userId}`,
            {},
            {
                headers: {
                    'x-api-key': appConfiguration.apiKey
                },
            }
        );
    } catch (error) {
        console.error("Error marking notifications as seen:", error);
        throw error;
    }
};

export const markNotificationAsRead = async (appConfiguration: { apiKey: string; appId: string; host: string; userId: string }, notificationId: string): Promise<void> => {
    try {
        await axios.post(`http://${appConfiguration.host}${MAKE_NOTIFICATION_AS_READ_ENDPOINT}/${notificationId}`,
            {},
            {
                headers: {
                    'x-api-key': appConfiguration.apiKey
                },
            }
        );
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        throw error;
    }
}
