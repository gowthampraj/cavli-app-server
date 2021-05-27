import { ServiceProvided } from "./service-provided.model";

export class ClientServiceInfoModel {
    _id?: string
    clientId: string
    documentCollected?: string[];
    payment: Payment;
    serviceProvided: ServiceProvided[];
    interestedCourse: InterestedCourse[];
    doj: Date;
    sourceOfFund: string;
    constructor(i: ClientServiceInfoModel) {
        if (i._id) this._id = i._id;
        this.clientId = i.clientId;
        this.documentCollected = i.documentCollected ?? [];
        this.payment = new Payment(i.payment);
        this.serviceProvided = i?.serviceProvided?.length ? i.serviceProvided.map((serviceProvided: ServiceProvided) => new ServiceProvided(serviceProvided)) : [];
        this.interestedCourse = i.interestedCourse?.length ? i.interestedCourse.map(x => new InterestedCourse(x)) : [];
        this.doj = i.doj;
        this.sourceOfFund = i.sourceOfFund;
    }
}
export class InterestedCourse {
    courseName?: string;
    status?: string;
    appliedCountry?: string;
    appliedUni?: string;
    intake?: string;
    comment?: string
    constructor(i: InterestedCourse) {
        this.courseName = i.courseName;
        this.status = i.status;
        this.appliedCountry = i?.appliedCountry;
        this.appliedUni = i.appliedUni;
        this.intake = i?.intake;
        this.comment = i.comment
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
        this.description = input.description;
    }
    amount: number;
    medium: string;
    datePaid: Date;
    description?: string;
}
