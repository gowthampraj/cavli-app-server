export class UserModel {
    _id?: string
    username?: string;
    password: string;
    name?: string;
    isActive?: boolean;
    constructor(i: UserModel) {
        if (this._id)
            this._id = i._id;
        this.username = i.username;
        this.password = i.password;
        this.name = i.name;
        this.isActive = i?.isActive ?? true;
    }
}