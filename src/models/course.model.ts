export class CourseModel {
    _id?: string;
    name: string;
    country?: string[];
    uni?: string[]; // universities
    intakes?: string[];
    constructor(i: CourseModel) {
        if (i._id) this._id = i._id;
        this.name = i.name;
        this.country = i?.country ?? [];
        this.uni = i.uni ?? [];
        this.intakes = i?.intakes ?? [];
    }
}