export class Comment {
    createdAt: Date;
    createdBy: string;
    comment: string;
    clientId: string;
    constructor(i: Comment) {
        this.comment = i.comment;
        this.createdAt = i.createdAt ?? new Date();
        this.createdBy = i.createdBy ?? 'UN_KNOWN';
        this.clientId = i.clientId;
    }
}