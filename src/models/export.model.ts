export class ExtraModel {
    _id?: string;
    clientStatus?: string[];
    courseStatus?: string[];
    constructor(i: ExtraModel) {
        if (i._id)
            this._id = i._id;
        this.clientStatus = i?.clientStatus || [];
        this.courseStatus = i?.courseStatus || [];
    }
}