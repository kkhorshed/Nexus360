import { NotificationProvider, useNotification } from './context/NotificationContext';

export {
    NotificationProvider,
    useNotification
};

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
}
