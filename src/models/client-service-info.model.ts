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
    company?: string;
    constructor(i: ClientServiceInfoModel) {
        if (i._id) this._id = i._id;
        this.clientId = i.clientId;
        this.documentCollected = i.documentCollected ?? [];
        this.payment = new Payment(i.payment);
        this.serviceProvided = i?.serviceProvided?.length ? i.serviceProvided.map((serviceProvided: ServiceProvided) => new ServiceProvided(serviceProvided)) : [];
        this.interestedCourse = i.interestedCourse?.length ? i.interestedCourse.map(x => new InterestedCourse(x)) : [];
        this.doj = i.doj;
        this.sourceOfFund = i.sourceOfFund;
        this.company =i.company;
    }
}
export class InterestedCourse {
    courseName?: string;
    status?: string;
    appliedCountry?: string;
    appliedUni?: string;
    intake?: string;
    comment?: string;
    dateApplied?: Date;
    ackNo?: String;
    constructor(i: InterestedCourse) {
        this.courseName = i.courseName;
        this.status = i.status;
        this.appliedCountry = i?.appliedCountry;
        this.appliedUni = i.appliedUni;
        this.intake = i?.intake;
        this.comment = i?.comment
        this.dateApplied = i?.dateApplied;
        this.ackNo = i?.ackNo;
    }
}

export class Payment {
    constructor(input: Payment) {
        this.isPaid = input?.isPaid ?? false;
        this.discount = input?.discount ?? 0;
        this.feeTotal = input?.feeTotal ?? 0;
        this.masterAmount = input.masterAmount ?? 0
        this.feePaid = input?.feePaid ? input?.feePaid.map((feePaid: FeePaid) => new FeePaid(feePaid)) : [];
        this.nextDueDate = input?.nextDueDate;
    }
    masterAmount?: number;
    isPaid: boolean;
    discount?: number;
    feeTotal: number;
    feePaid: FeePaid[];
    nextDueDate?: Date;
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
