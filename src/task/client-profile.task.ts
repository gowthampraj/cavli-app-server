import { Cursor, ObjectID } from 'mongodb';
import DbClient = require('../mongoclient');
import { removeId } from '../utils/utils';
import logging from '../config/logging';
import { ClientProfileModel } from '../models/client-profile.model';
const NAMESPACE = 'CLIENT PROFILE';
const COLLECTION_NAME_CLIENT_PROFILE_INFO = 'client-profile';

export default class ClientProfileTask {

    private mongoConnection: any;

    constructor() {
        this.mongoConnection = DbClient.getInstance();

    }
    create(data: any) {
        return new Promise((resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required')
            }

            const payLoad: ClientProfileModel = new ClientProfileModel(data.payLoad);
            logging.info(NAMESPACE, `ClientProfileTask.create`, payLoad);
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT_PROFILE_INFO)
                            .insertOne(payLoad, function (err: any, res: any) {
                                if (res.insertedCount) {
                                    resolve({ insertedId: res.insertedId })
                                }
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db`, error);
                        resolve(error)
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    getAll(fields?: any) {

        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT_PROFILE_INFO).find({},
                            function (err: any, users: Cursor) {
                                users.toArray().then(userList => {
                                    resolve(userList);
                                });
                            });
                    } catch (error) {
                        reject(JSON.stringify(error));
                        logging.error(NAMESPACE, 'ClientProfileTask.getAll', JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    getById(clientId: string) {
        return new Promise((resolve, reject) => {
            if (!clientId) {
                reject('Client Id is required');
            }
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT_PROFILE_INFO)
                            .find({ clientId },
                                function (err: any, data: Cursor) {
                                    data.toArray().then(list => {
                                        if (list[0]) {
                                            resolve(list[0]);
                                        } else {
                                            reject({ code: 404, msg: `No details found` });
                                        }
                                    });
                                });
                    } catch (error) {
                        reject(JSON.stringify(error));
                        logging.error(NAMESPACE, 'ClientProfileTask.getAll', JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    update(data: any) {

        return new Promise((resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required');
            }

            const payLoad: ClientProfileModel = new ClientProfileModel(data.payLoad);
            logging.info(NAMESPACE, `ClientProfileTask.update`, JSON.stringify(payLoad));

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT_PROFILE_INFO)
                            .updateOne(
                                { _id: new ObjectID(payLoad._id) },
                                { $set: removeId(JSON.parse(JSON.stringify(payLoad))) },
                                { upsert: false }
                                ,
                                function (err: any, res: any) {
                                    if (res.matchedCount) {
                                        if (res.matchedCount === res.modifiedCount) {
                                            resolve({ status: 200, msg: "Updated", id: payLoad._id });
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

    delete(clientId: any) {

        return new Promise((resolve, reject) => {
            if (!clientId) reject('Client Id is required');
            logging.info(NAMESPACE, `ClientProfileTask.delete`, `Client Id : ${clientId}`);

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT_PROFILE_INFO).updateOne(
                            { _id: new ObjectID(clientId) },
                            { $set: { isActive: false } },
                            { upsert: false },
                            function (err: any, res: any) {
                                if (res.matchedCount) {
                                    if (res.matchedCount === res.modifiedCount) {
                                        logging.info(NAMESPACE, `ClientProfileTask.delete`, `Change status to Client Id : ${clientId}`);

                                        resolve({ status: 200, msg: "Deleted" });
                                    } else resolve({ status: 400, msg: "Nothing to update" });
                                } else {
                                    resolve({ status: 404, msg: 'No match found' });
                                }
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `ClientProfileTask.delete`, error);
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

}