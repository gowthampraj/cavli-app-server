export class UniversityModel {
    _id?: string;
    country?: string[];
    name: string;
    description?: string;
    constructor(i: UniversityModel) {
        if (i._id)
            this._id = i._id;
        if (i?.country?.length)
            this.country = i?.country?.length ? i.country : [];
        this.name = i.name;
        if (i.description)
            this.description = i.description;

    }
}