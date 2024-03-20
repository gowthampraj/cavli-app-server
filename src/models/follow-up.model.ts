export class FollowUp {
    _id?: string;
    company?: string;
    clientId: string;
    createdAt: string;
    createdBy: string;
    createdId?: string;
    modifiedAt?: string;
    modifiedBy?: string;
    modifiedId?: string;
    followUpScheduleComment?: string;
    followUpScheduleDate?: string; //Date
    followUpDate?: string; // Date;
    followUpComment?: string; // Date;
    followUpBy?: string;
    followUpId?: string;
    constructor(i: FollowUp) {
        if (i._id)
            this._id = i._id;
        this.company = i.company;
        this.clientId = i.clientId;
        this.createdAt = i.createdAt;
        this.createdBy = i.createdBy;
        this.createdId = i.createdId;
        this.followUpScheduleComment = i.followUpScheduleComment;
        this.followUpScheduleDate = i.followUpScheduleDate;
        this.followUpDate = i.followUpDate;
        this.followUpComment = i.followUpComment;
        this.modifiedAt = i.modifiedAt;
        this.modifiedBy = i.modifiedBy;
        this.modifiedId = i.modifiedId;
        this.followUpBy = i.followUpBy;
        this.followUpId = i.followUpId;
    }
}