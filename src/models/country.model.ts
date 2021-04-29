export class CountryModel {
    _id?: string;
    name: string;
    constructor(i: CountryModel) {
        if (i._id)
            this._id = i._id;
        this.name = i.name;
    }
}