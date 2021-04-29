export class ClientModel {
    _id?: string;
    firstName: string;
    middleName?: string;
    lastName?: string;
    isActive: boolean;
    address?: string;
    pincode?: string;
    contactNumber?: string[];
    emailIds?: string[];
    status: string;
    comment?: string;
    documentCollected?: string[];
    payment: Payment;
    serviceProvided: ServiceProvided[];
    createdBy: string;
    createdAt: Date;
    constructor(input: ClientModel) {
        if (input._id)
            this._id = input._id;
        this.firstName = input.firstName;
        this.middleName = input.middleName;
        this.lastName = input.lastName;
        this.isActive = input.isActive ?? true;
        this.address = input.address;
        this.pincode = input.pincode;
        this.contactNumber = input.contactNumber ?? [];
        this.emailIds = input.emailIds ?? [];
        this.status = input.status ?? 'NEW';
        this.comment = this.comment;
        this.documentCollected = input.documentCollected;
        this.payment = new Payment(input.payment);
        this.createdAt= input.createdAt;
        this.createdBy = input.createdBy;
        this.serviceProvided = input?.serviceProvided?.length ? input.serviceProvided.map((serviceProvided: ServiceProvided) => new ServiceProvided(serviceProvided)) : [];
    }
}

export class ServiceProvided {
    serviceName: string;
    amount: number;
    discount: number;
    masterAmount: number;
    constructor(i: ServiceProvided) {
        this.serviceName = i.serviceName;
        this.amount = i.amount;
        this.discount = i.discount;
        this.masterAmount = i.masterAmount;
    }
}

export class Payment {
    constructor(input: Payment) {
        this.isPaid = input?.isPaid ?? false;
        this.discount = input?.discount ?? 0;
        this.feeTotal = input?.feeTotal ?? 0;
        this.masterAmount = input.masterAmount ?? 0
        this.feePaid = input?.feePaid ? input?.feePaid.map((feePaid: FeePaid) => new FeePaid(feePaid)) : [];
    }
    masterAmount?: number;
    isPaid: boolean;
    discount?: number;
    feeTotal: number;
    feePaid: FeePaid[]
}

export class FeePaid {
    constructor(input: FeePaid) {
        this.amount = input.amount;
        this.medium = input.medium;
        this.datePaid = input.datePaid;
    }
    amount: number;
    medium: string;
    datePaid: Date;
}
