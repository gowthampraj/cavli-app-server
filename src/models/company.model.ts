export class CompanyModel {
    name: string;
    _id?: string;
    address: string;
    isActive?: boolean;
    constructor(i: CompanyModel) {
        if (i._id)
            this._id = i._id;
        this.name = i.name;
        this.address = i.address;
        this.isActive = i.isActive ?? true;
    }
}