import { Message } from './../../../node_modules/@mui/icons-material/index.d';
export interface CountResponse {
    status: boolean;
    data: {
        count: number;
    };
    message: string;
    code: number;
};

export interface AppConfiguration {
    appConfiguration: {
        host: string;
        apiKey: string;
        userId: string;
        appId: string;
    }
   
};

export interface NotificationListResponse {
    status: boolean;
    data: PaginatedNotifications;
    message: string;
    code: number;
};

export interface PaginatedNotifications {
    total_pages: number;
    current_page: number;
    data: Notification[];
    total_items: number;
}

export interface Notification {
    inapp_notification_id: string;
    user_id: string;
    app_id: string;
    is_seen: boolean;
    is_read: boolean;
    title: string;
    body: string;
    image_url: string;
    link_uri: string;
    actor_name: string;
    actor_image: string;
    meta: unknown;
    scheduled_at: string;
    analytics_id: string;
    created_at: string;
    updated_at: string;
    expired_at: string;
}

export interface SocketEventData {
    data: unknown;
    user: string;
    type: string;
    status: boolean;
  }