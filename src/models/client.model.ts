export class ClientModel {
    _id?: string;
    ackNo?: string;
    company?:string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    permanentAddress: Address;
    mailingAddress: Address;
    contactNumber?: string[];
    emailIds?: string[];
    dob?: Date;
    maritalStatus?: string;
    gender?: string;
    status?: string;
    isActive?: boolean;
    passport: Passport;
    nationality: Nationality;
    comment?: string;
    createdBy?: string;
    createdAt?: Date;
    modifiedBy?: string;
    modifiedAt?: Date;
    lastContacted?: Date;
    emergencyContact: Contact;
    constructor(input: ClientModel) {
        if (input._id)
            this._id = input._id;
        this.ackNo = input.ackNo;
        this.company = input.company;
        this.firstName = input.firstName;
        this.middleName = input.middleName;
        this.lastName = input.lastName;
        this.permanentAddress = new Address(input?.permanentAddress);
        this.mailingAddress = new Address(input?.mailingAddress);
        this.contactNumber = input.contactNumber ?? [];
        this.emailIds = input.emailIds ?? [];
        this.dob = input.dob;
        this.maritalStatus = input.maritalStatus;
        this.gender = input.gender;
        this.isActive = input.isActive ?? true;
        this.passport = new Passport(input?.passport);
        this.nationality = new Nationality(input?.nationality)
        this.status = input.status ?? 'NEW';
        this.comment = input.comment;
        this.createdAt = input.createdAt;
        this.createdBy = input.createdBy;
        this.modifiedAt = input.modifiedAt;
        this.modifiedBy = input.modifiedBy;
        this.lastContacted = input.lastContacted;
        this.emergencyContact = new Contact(input?.emergencyContact)
    }
}

export class Address {
    lane1: string;
    lane2: string;
    country: string;
    state: string;
    city: string;
    pincode: string;
    constructor(i: Address) {
        this.lane1 = i?.lane1;
        this.lane2 = i?.lane2;
        this.country = i?.country;
        this.state = i?.state;
        this.city = i?.city;
        this.pincode = i?.pincode;
    }
}

export class Passport {
    passportNo: string;
    issueDate: Date;
    expDate: Date;
    issueCountry: Date;
    cityOfBirth: string;
    countryOfBirth: string;
    constructor(i: Passport) {
        this.passportNo = i?.passportNo;
        this.issueDate = i?.issueDate;
        this.expDate = i?.expDate;
        this.issueCountry = i?.issueCountry;
        this.cityOfBirth = i?.cityOfBirth;
        this.countryOfBirth = i?.countryOfBirth;
    }
}

export class Nationality {
    nationality: string;
    citizenship: string;
    constructor(i: Nationality) {
        this.nationality = i?.nationality;
        this.citizenship = i?.citizenship;
    }
}

export class Contact {
    name: string;
    email: string[];
    relation: string;
    phoneNo: string[];
    constructor(i: Contact) {
        this.name = i?.name;
        this.email = i?.email;
        this.relation = i?.relation;
        this.phoneNo = i?.phoneNo;
    }
}
