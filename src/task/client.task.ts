import { Cursor, ObjectID } from 'mongodb';
import DbClient = require('../mongoclient');
import { removeId } from '../utils/utils';
import { ClientModel } from '../models/client.model';
import logging from '../config/logging';
const NAMESPACE = 'CLIENT'
export default class ClientTask {
    constructor() {
    }

    create(data: any) {
        return new Promise((resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required')
            }

            let payLoad: ClientModel = new ClientModel(data);
            logging.info(NAMESPACE, `ClientTask.create`, payLoad);
            DbClient.connect()
                .then((connection: any) => {
                    try {
                        connection.collection('client').insertOne(payLoad, function (err: any, res: any) {
                            if (res.insertedCount) {
                                resolve(res.insertedCount)
                            }
                        });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db`, error);
                        resolve(error)
                    }
                })
                .catch(err => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    getAll(fields?: any) {
        /**
         * { isActive : boolean }
         */
        let field = fields?.isActive
            ? { isActive: fields?.isActive == true || fields?.isActive == 'true' }
            : {}
        return new Promise((resolve, reject) => {
            DbClient.connect()
                .then((connection: any) => {
                    try {
                        connection.collection('client').find(field,
                            function (err: any, users: Cursor) {
                                users.toArray().then(userList => {
                                    resolve(userList);
                                });
                            });
                    } catch (error) {
                        reject(JSON.stringify(error));
                        logging.error(NAMESPACE, 'UserService.getAll', JSON.stringify(error));
                    }
                })
                .catch(err => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    getById(clientId: string) {
        return new Promise((resolve, reject) => {
            if (!clientId) {
                reject('Client Id is required');
            }
            DbClient.connect()
                .then((connection: any) => {
                    try {
                        connection.collection('client').find({ _id: new ObjectID(clientId) },
                            function (err: any, users: Cursor) {
                                users.toArray().then(userList => {
                                    if (userList[0]) {
                                        resolve(userList[0]);
                                    } else {
                                        reject(`No Client Id found`);
                                    }
                                });
                            });
                    } catch (error) {
                        reject(JSON.stringify(error));
                        logging.error(NAMESPACE, 'UserService.getAll', JSON.stringify(error));
                    }
                })
                .catch(err => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    update(data: any) {

        return new Promise((resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required');
            }

            let payLoad: ClientModel = new ClientModel(data);
            logging.info(NAMESPACE, `ClientTask.delete`, JSON.stringify(payLoad));

            DbClient.connect()
                .then((connection: any) => {
                    try {
                        connection.collection('client').updateOne(
                            { _id: new ObjectID(payLoad._id) },
                            { $set: removeId(payLoad) },
                            { upsert: true }
                            ,
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
                .catch(err => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    delete(clientId: any) {

        return new Promise((resolve, reject) => {
            if (!clientId) reject('Client Id is required');
            logging.info(NAMESPACE, `ClientTask.delete`, `Client Id : ${clientId}`);

            DbClient.connect()
                .then((connection: any) => {
                    try {
                        connection.collection('client').updateOne(
                            { _id: new ObjectID(clientId) },
                            { $set: { isActive: false } },
                            { upsert: true },
                            function (err: any, res: any) {
                                if (res.matchedCount) {
                                    if (res.matchedCount === res.modifiedCount) {
                                        logging.info(NAMESPACE, `ClientTask.delete`, `Change status to Client Id : ${clientId}`);

                                        resolve({ status: 200, msg: "Deleted" });
                                    } else resolve({ status: 400, msg: "Nothing to update" });
                                } else {
                                    resolve({ status: 404, msg: 'No match found' });
                                }
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `ClientTask.delete`, error);
                    }
                })
                .catch(err => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

}