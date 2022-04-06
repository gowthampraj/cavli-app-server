export class CommentModel {
    _id?: string;
    createdAt: Date;
    createdBy: string;
    comment?: string; // comment
    clientId: string;
    type: CommentType;
    createdId?: string;
    constructor(i: CommentModel) {
        if (i._id)
            this._id = i._id;
        if (i.comment)
            this.comment = i.comment;
        this.createdAt = i.createdAt ?? new Date();
        this.createdBy = i.createdBy ?? 'UN_KNOWN';
        this.clientId = i.clientId;
        this.type = i.type;
        this.createdId = i?.createdId;
    }
}
export enum CommentType {
    COMMENT = 'COMMENT',
    CREATE_NEW_CLIENT = 'CREATE_NEW_CLIENT',
    EDIT_CLIENT = 'EDIT_CLIENT',
    PROFILE_EDIT = 'PROFILE_EDIT',
    SERVICE_PROVIDED = 'SERVICE_PROVIDED',
    FEE_PAID = 'FEE_PAID',
    PAYMENT_TOGGLE = 'PAYMENT_TOGGLE',
    DOC_UN_COLLECT = 'DOC_UN_COLLECT',
    DOC_COLLECT = 'DOC_COLLECT',
    ADD_COURSE = 'ADD_COURSE',
    EDIT_COURSE = 'EDIT_COURSE',
    COURSE_REMOVED = 'COURSE_REMOVED',
    CHANGE_COURSE_STATUS = 'CHANGE_COURSE_STATUS',
    DOJ_CHANGE = 'DOJ_CHANGE'
}