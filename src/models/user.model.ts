export class UserModel {
    _id?: string
    username?: string;
    company: string;
    password: string;
    name?: string;
    isActive?: boolean;
    userRole?: UserRoles;
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

class Permission {
    login?: boolean;
    manage?: boolean;
    constructor(i: Permission) {
        this.login = i?.login || false;
        this.manage = i?.manage || false;
    }
}