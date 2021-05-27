export class ServiceProvided {
    _id?: string;
    serviceName: string;
    amount?: number;
    discount?: number;
    masterAmount?: number;
    staffAllocated?: string[];
    timeSlot?: string[];
    constructor(i: ServiceProvided) {
        if (i._id) this._id = i._id;
        this.serviceName = i.serviceName;
        this.amount = i.amount;
        this.discount = i.discount;
        this.masterAmount = i.masterAmount;
        this.staffAllocated = i.staffAllocated ?? [];
        this.timeSlot = i.timeSlot ?? [];
    }
}