export enum NotificationStatus {
    UNREAD = 'unread',
    READ = 'read',
}

export interface NotificationUser {

    id: string;

    firstname: string;

    lastname: string;

    photo?: string;

}

export interface SavedNotification {

    id: string;
    created :string;

    status: NotificationStatus;

    title: string;

    message: string;

    entityType: string;

    entityId: string;

    action: string;

    users: NotificationUser[];

}