export class Comment {
    _id: string;
    createdAt: Date;
    createdBy: string;
    comment: string;
    clientId: string;
    type: CommentType
    constructor(i: Comment) {
        this._id = i._id;
        this.comment = i.comment;
        this.createdAt = i.createdAt ?? new Date();
        this.createdBy = i.createdBy ?? 'UN_KNOWN';
        this.clientId = i.clientId;
        this.type = i.type
    }
}
enum CommentType {
    PROFILE_EDIT = 'PROFILE_EDIT',
    COMMENT = 'COMMENT'
}