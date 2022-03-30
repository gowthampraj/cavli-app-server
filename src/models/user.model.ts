export class UserModel {
    _id?: string
    username?: string;
    company: string;
    password: string;
    name?: string;
    isActive?: boolean;
    userRole?: UserRoles[];
    permission: Permission;
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
    constructor(i: Permission) {
        this.login = i?.login;
        this.manage = i?.manage;
        this.changeStatus = i?.changeStatus;
    }
}