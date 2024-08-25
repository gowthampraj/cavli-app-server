import DbClient = require('../mongoclient');
import logging from '../config/logging';
import { invoiceModel, ActionModel } from '../models/invoice.model';
import { Cursor, ObjectID, ObjectId } from 'mongodb';

const NAMESPACE = 'INVOICE';
const COLLECTION_NAME_INVOICE = 'invoice';


export default class invoiceTask {

    private mongoConnection: any;

    constructor() {
        this.mongoConnection = DbClient.getInstance();
    }

    async create(data?: any) {
        const invoice: invoiceModel = new invoiceModel(data);
        return new Promise((resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject({ msg: 'Body is required' });
                return;
            }

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_INVOICE).insertOne(
                            { ...invoice },
                            function (err: any, res: any) {
                                if (res.insertedCount) {
                                    resolve(res.insertedCount)
                                }
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    };

    public getAll(fields?: any) {

        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_INVOICE).find(
                            {},
                            { sort: { name: 1 } },
                            function (err: any, invoice: Cursor) {
                                invoice.toArray().then((invoiceList: any) => {
                                    resolve(invoiceList);
                                });
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    async updateAction(invoiceId: string, action: ActionModel) {
        return new Promise((resolve, reject) => {
            if (!action || Object.keys(action).length === 0) {
                reject({ msg: 'Action data is required' });
                return;
            }
    
            this.mongoConnection.connect()
                .then(async (connection: any) => {
                    try {
                        const result = await connection.collection(COLLECTION_NAME_INVOICE).updateOne(
                            { _id: new ObjectId(invoiceId) },
                            { $push: { actions: action } }
                        );
    
                        if (result.modifiedCount === 1) {
                            logging.info('InvoiceTask.updateAction', `Action added to invoice ${invoiceId}`);
                            resolve({ success: true, message: 'Action added successfully' });
                        } else {
                            logging.warn('InvoiceTask.updateAction', `No invoice found with id ${invoiceId}`);
                            reject({ code: 404, msg: `Invoice not found with id ${invoiceId}` });
                        }
                    } catch (error) {
                        logging.error('InvoiceTask.updateAction', `Error updating action: ${error}`);
                        reject({ code: 500, msg: 'Internal Server Error' });
                    }
                })
                .catch((err: any) => {
                    logging.error('InvoiceTask.updateAction', `DB connection Error: ${err}`);
                    reject({ code: 500, msg: 'DB connection Error' });
                });
        });
    }

    async deleteInvoice(invoiceId: string) {

        return new Promise((resolve, reject) => {

            this.mongoConnection.connect()
            .then(async (connection: any) => {
                try {
                    const result = await connection.collection(COLLECTION_NAME_INVOICE).updateOne(
                        { _id: new ObjectId(invoiceId) },
                        { $set: { isDeleted: true } }
                        
                    );

                    if (result.modifiedCount === 1) {
                        logging.info('InvoiceTask.DeleteAction', `Invoice Deleted ${invoiceId}`);
                        resolve({ success: true, message: 'Action added successfully' });
                    } else {
                        logging.warn('InvoiceTask.DeleteAction', `No invoice found with id ${invoiceId}`);
                        reject({ code: 404, msg: `Invoice not found with id ${invoiceId}` });
                    }
                } catch (error) {
                    logging.error('InvoiceTask.DeleteAction', `Error deleting invoice: ${error}`);
                    reject({ code: 500, msg: 'Internal Server Error' });
                }
            })
            .catch((err: any) => {
                logging.error('InvoiceTask.DeleteAction', `DB connection Error: ${err}`);
                reject({ code: 500, msg: 'DB connection Error' });
            });
        })


    }
    

}