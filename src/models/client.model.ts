export class ClientModel {
    _id?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    address?: string;
    pincode?: string;
    contactNumber?: string[];
    emailIds?: string[];
    dob?: Date;
    maritalStatus?: string;

    status?: string;
    isActive?: boolean;

    comment?: string;
    createdBy?: string;
    createdAt?: Date;
    lastContacted?: Date;
    constructor(input: ClientModel) {
        if (input._id)
            this._id = input._id;
        this.firstName = input.firstName;
        this.middleName = input.middleName;
        this.lastName = input.lastName;
        this.address = input.address;
        this.pincode = input.pincode;
        this.contactNumber = input.contactNumber ?? [];
        this.emailIds = input.emailIds ?? [];
        this.dob = input.dob;
        this.maritalStatus = input.maritalStatus;
        this.isActive = input.isActive ?? true;
        this.status = input.status ?? 'NEW';
        this.comment = input.comment;
        this.createdAt = input.createdAt;
        this.createdBy = input.createdBy;
        this.lastContacted = input.lastContacted;
    }
}
