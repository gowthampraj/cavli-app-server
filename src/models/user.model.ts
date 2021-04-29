export class UserModel {
    _id?: string
    username?: string;
    password: string;
    name?: string;
    isActive?: boolean;
    userRole?: UserRoles
    constructor(i: UserModel) {
        if (this._id)
            this._id = i._id;
        this.username = i.username;
        this.password = i.password;
        this.name = i.name;
        this.isActive = i?.isActive ?? true;
        this.userRole = i.userRole
    }
}

export enum UserRoles {
    ADMIN, NORMAL,
}