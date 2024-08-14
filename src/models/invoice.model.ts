export class invoiceModel {
    _id?: string;
    invoiceNum: string;
    invoiceDate: Date;
    invoiceDueDate: Date;
    recipientName: string;
    recipientAddress: string;
    terms: string;
    items: ItemModel[];
    amountPaid: string;
    actions: ActionModel[];
    isDeleted:boolean
  
    constructor(data: invoiceModel) {
      this._id = data._id;
      this.invoiceNum = data.invoiceNum;
      this.invoiceDate = new Date(data.invoiceDate);
      this.invoiceDueDate = new Date(data.invoiceDueDate);
      this.recipientName = data.recipientName;
      this.recipientAddress = data.recipientAddress;
      this.terms = data.terms;
      this.amountPaid = data.amountPaid;
      this.items = data.items.map((item: any) => new ItemModel(item));
      this.actions = data.actions.map((action: any) => new ActionModel(action));
      this.isDeleted = data.isDeleted;
    }
  }
  
  export class ItemModel {
    name: string;
    qty: number;
    rate: number;
    amount: number;
    sgst: number;
    cgst: number;
  
    constructor(data: any) {
      this.name = data.name || '';
      this.qty = data.qty || 0;
      this.rate = data.rate || 0;
      this.amount = data.amount || 0;
      this.sgst = data.sgst || 0;
      this.cgst = data.cgst || 0;
    }
  }
  
  export class ActionModel {
    action: string;
    actionBy: string;
    actionAt: Date;
  
    constructor(data: any) {
      this.action = data.action || '';
      this.actionBy = data.actionBy || '';
      this.actionAt = new Date(data.actionAt);
    }
  }
  