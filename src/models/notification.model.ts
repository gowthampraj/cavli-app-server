export class NotificationModel {
    _id?: string;
    userId?: string;
    clientId?: string;
    metaData?: string;
    message?: string;
    isRead?: boolean;
    createdAt?: Date;
    createdBy?: string;
    createdId?: string;
    constructor(i: NotificationModel) {
        if (i._id)
            this._id = i._id;
        this.userId = i.userId;
        this.clientId = i.clientId;
        this.metaData = i.metaData;
        this.message = i.message;
        this.isRead = i.isRead;
        this.createdAt = i.createdAt;
        this.createdBy = i.createdBy;
        this.createdId = i.createdId;
    }
}