import DbClient = require('../mongoclient');
import { Cursor, ObjectID } from 'mongodb';
import logging from '../config/logging';
import { removeId } from '../utils/utils';
import { NotificationModel } from '../models/notification.model';

const NAMESPACE = 'NOTIFICATION';
const COLLECTION_NAME_NOTIFICATION = 'notification';
export default class NotificationTask {

    private mongoConnection: any;

    constructor() {
        this.mongoConnection = DbClient.getInstance();
    }


    async create(data: any) {
        const notification: NotificationModel = new NotificationModel(data);
        return new Promise(async (resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject({ msg: 'Body is required' });
                return;
            }

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_NOTIFICATION).insertOne(
                            { ...notification },
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

    public getById(clientId: string) {

        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_NOTIFICATION).find(
                            { clientId },
                            function (err: any, notification: Cursor) {
                                notification.toArray().then((extraList: any) => {
                                    resolve(extraList);
                                });
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    public update(data: any) {

        return new Promise((resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required');
            }

            let payLoad: NotificationModel = new NotificationModel(data);

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_NOTIFICATION).updateOne(
                            { _id: new ObjectID(payLoad._id) },
                            { $set: removeId(JSON.parse(JSON.stringify(payLoad))) },
                            { upsert: false },
                            function (err: any, res: any) {
                                if (res.matchedCount) {
                                    if (res.matchedCount === res.modifiedCount) {
                                        resolve({ status: 200, msg: "Updated" });
                                    } else resolve({ status: 400, msg: "Nothing to update" });
                                } else {
                                    resolve({ status: 404, msg: 'No match found' });
                                }
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

}
