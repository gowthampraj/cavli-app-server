import { Cursor, ObjectID } from 'mongodb';
import DbClient = require('../mongoclient');
import { removeId } from '../utils/utils';
import logging from '../config/logging';
import { ClientServiceInfoModel } from '../models/client-service-info.model';
const NAMESPACE = 'CLIENT SERVICE INFO';
const COLLECTION_NAME_CLIENT_SERVICE_INFO = 'client-service-info';

export default class ClientServiceInfoTask {

    private mongoConnection: any;

    constructor() {
        this.mongoConnection = DbClient.getInstance();

    }
    create(data: any) {
        return new Promise((resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required')
            }

            const payLoad: ClientServiceInfoModel = new ClientServiceInfoModel(data.payLoad);
            logging.info(NAMESPACE, `ClientServiceInfoTask.create`, payLoad);
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT_SERVICE_INFO)
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
                        connection.collection(COLLECTION_NAME_CLIENT_SERVICE_INFO).find({},
                            function (err: any, users: Cursor) {
                                users.toArray().then(userList => {
                                    resolve(userList);
                                });
                            });
                    } catch (error) {
                        reject(JSON.stringify(error));
                        logging.error(NAMESPACE, 'ClientServiceInfoTask.getAll', JSON.stringify(error));
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
                        connection.collection(COLLECTION_NAME_CLIENT_SERVICE_INFO)
                            .find({ clientId },
                                function (err: any, users: Cursor) {
                                    users.toArray().then(list => {
                                        if (list[0]) {
                                            resolve(list[0]);
                                        } else {
                                            reject({ code: 404, msg: `No details found` });
                                        }
                                    });
                                });
                    } catch (error) {
                        reject(JSON.stringify(error));
                        logging.error(NAMESPACE, 'ClientServiceInfoTask.getAll', JSON.stringify(error));
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

            const payLoad: ClientServiceInfoModel = new ClientServiceInfoModel(data.payLoad);
            logging.info(NAMESPACE, `ClientServiceInfoTask.update`, JSON.stringify(payLoad));

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT_SERVICE_INFO)
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
            logging.info(NAMESPACE, `ClientServiceInfoTask.delete`, `Client Id : ${clientId}`);

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT_SERVICE_INFO).deleteOne(
                            { clientId },
                            function (err: any, res: any) {
                                if (res.matchedCount) {
                                    if (res.matchedCount === res.modifiedCount) {
                                        logging.info(NAMESPACE, `ClientServiceInfoTask.delete`, `Change status to Client Id : ${clientId}`);

                                        resolve({ status: 200, msg: "Deleted" });
                                    } else resolve({ status: 400, msg: "Nothing to update" });
                                } else {
                                    resolve({ status: 404, msg: 'No match found' });
                                }
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `ClientServiceInfoTask.delete`, error);
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    /**
     * Dash board
     */

    async clientByPayment(qParms: any) {
        try {

            let match: any = {};

            const fieldArray = ['company'];
            fieldArray.forEach(x => {
                if (qParms[x]) {
                    match[x] = qParms[x];
                }
            });


            const filter = [
                {
                    '$match': {
                        ...match,
                        'payment.isPaid': false,
                        'payment.feeTotal': { $gt: 0 }
                    }
                },
                {
                    '$sort': {
                        // 'doj': -1
                        'payment.nextDueDate': 1
                    }
                },
                {
                    '$lookup': {
                        from: 'client',
                        let: { 'clientId': '$clientId' },
                        pipeline: [
                            { "$addFields": { "articleId": { "$toString": "$_id" } } },
                            { "$match": { "$expr": { "$eq": ["$articleId", "$$clientId"] } } },
                            { "$project": { 'firstName': 1, 'lastName': 1, 'middleName': 1, 'isActive': 1 } }
                        ],
                        as: 'clientInfo'
                    }
                },
                {
                    '$project': {
                        clientId: 1,
                        _id: -1,
                        payment: 1,
                        doj: 1,
                        clientInfo: { $first: "$clientInfo" }
                    }
                },
                {
                    '$match': {
                        'clientInfo.isActive': true
                    }
                }
            ];
            const conn = await this.mongoConnection.connect();
            const result = conn.collection(COLLECTION_NAME_CLIENT_SERVICE_INFO).aggregate(filter);
            return await result.toArray();
        } catch (error) {
            logging.error(NAMESPACE, 'UserService.clientByPayment', JSON.stringify(error));
            throw error;
        }
    }

}