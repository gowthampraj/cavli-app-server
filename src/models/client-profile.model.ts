export class ClientProfileModel {
    _id: string;
    clientId: string;
    academic: Academic[];
    workExperience: Experience[];
    constructor(i: ClientProfileModel) {
        this._id = i._id;
        this.clientId = i.clientId;
        this.academic = i.academic?.length ? i.academic.map((x: Academic) => new Academic(x)) : [];
        this.workExperience = i.workExperience?.length ? i.workExperience.map((x: Experience) => new Experience(x)) : [];
    }
}

export class Academic {
    school?: string;
    degree?: string;
    board?: string;
    startDate?: Date;
    endDate?: Date;
    marks?: number
    gradeType?: string; // 'PERCENTAGE' | 'MARKS';
    fieldOfStudy?: string;
    studying?: boolean; // currenty studying
    constructor(i: Academic) {
        this.studying = i.studying;
        this.school = i.school;
        this.degree = i.degree;
        this.board = i.board;
        this.startDate = i.startDate;
        this.endDate = i.endDate;
        this.marks = i.marks;
        this.gradeType = i.gradeType;
        this.fieldOfStudy = i.fieldOfStudy;
    }
}
export class Experience {
    company?: string;
    address?: string;
    startDate?: Date;
    endDate?: Date;
    profile?: string; // Job Title
    emptype?: string; // full time - part time etc
    salary?: number;
    working?: boolean; // currenty working
    constructor(i: Experience) {
        this.company = i.company;
        this.address = i.address;
        this.startDate = i.startDate;
        this.endDate = i.endDate;
        this.profile = i.profile;
        this.emptype = i.emptype;
        this.salary = i.salary;
        this.working = i.working;
    }
}
