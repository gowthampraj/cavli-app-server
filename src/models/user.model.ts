export class UserModel {
    _id?: string
    username?: string;
    company: string;
    password: string;
    name?: string;
    isActive?: boolean;
    userRole?: UserRoles[];
    permission: Permission;
    loginNeeded: boolean;
    constructor(i: UserModel) {
        if (i._id)
            this._id = i._id;
        this.username = i.username;
        this.password = i.password;
        this.name = i.name;
        this.isActive = i.isActive ?? true;
        this.userRole = i.userRole;
        this.permission = new Permission(i?.permission);
        this.company = i.company;
        this.loginNeeded = i.loginNeeded;
    }
}

export enum UserRoles {
    ADMIN = 'ADMIN',
    NORMAL = 'NORMAL',
    STAFF = 'STAFF',
}

export class Permission {
    login?: boolean;
    manage?: boolean;
    changeStatus?: boolean;
    extra?: boolean;
    company?: boolean;
    service?: boolean;
    course?: boolean;
    country?: boolean;
    university?: boolean;
    exportExcel?: boolean;
    searchCourse?: boolean;
    constructor(i: Permission) {
        this.login = i?.login;
        this.manage = i?.manage;
        this.changeStatus = i?.changeStatus;
        this.extra = i?.extra;
        this.company = i?.company;
        this.service = i?.service;
        this.course = i?.course;
        this.country = i?.country;
        this.university = i?.university;
        this.exportExcel = i.exportExcel;
        this.searchCourse = i?.searchCourse;
    }
}