import { Cursor, ObjectID } from 'mongodb';
import DbClient = require('../mongoclient');
import { removeId } from '../utils/utils';
import { ClientModel } from '../models/client.model';
import logging from '../config/logging';
import { CommentModel, CommentType } from '../models/comment.model';
import CommentTask from './comment.task';
const NAMESPACE = 'CLIENT';
const COLLECTION_NAME_CLIENT = 'client';

export default class ClientTask {

    private mongoConnection: any;
    private commentTask: CommentTask;

    constructor() {
        this.mongoConnection = DbClient.getInstance();
        this.commentTask = new CommentTask();
    }
    create(data: any) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required')
            }

            let payLoad: ClientModel = new ClientModel(data);
            logging.info(NAMESPACE, `ClientTask.create`, payLoad);
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT).insertOne(payLoad, function (err: any, res: any) {
                            if (res.insertedCount) {
                                resolve({ insertedId: res.insertedId });
                                /**
                                * Create Comment
                                */
                                if (new ObjectID(res.insertedId).toString()) {
                                    const commentPayload = new CommentModel(
                                        {
                                            clientId: new ObjectID(res.insertedId).toString(),
                                            createdAt: payLoad.createdAt ?? new Date(),
                                            createdBy: payLoad.createdBy ?? 'UNKOWN',
                                            type: CommentType.CREATE_NEW_CLIENT,
                                        }
                                    )
                                    self.createComment(commentPayload);
                                }
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
        /**
         * { isActive : boolean }
         */
        let field = fields?.isActive
            ? { isActive: fields?.isActive == true || fields?.isActive == 'true' }
            : {}
        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT).find(field,
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
                        connection.collection(COLLECTION_NAME_CLIENT).find({ _id: new ObjectID(clientId) },
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
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    update(data: any) {

        return new Promise((resolve, reject) => {
            const self = this;
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required');
            }

            let payLoad: ClientModel = new ClientModel(data);
            logging.info(NAMESPACE, `ClientTask.delete`, JSON.stringify(payLoad));

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT).updateOne(
                            { _id: new ObjectID(payLoad._id) },
                            { $set: removeId(JSON.parse(JSON.stringify(payLoad))) },
                            { upsert: false }
                            ,
                            function (err: any, res: any) {
                                if (res.matchedCount) {
                                    if (res.matchedCount === res.modifiedCount) {
                                        resolve({ status: 200, msg: "Updated", id: payLoad._id });
                                        /**
                                         * edit Comment
                                         */
                                        if (payLoad._id) {
                                            const commentPayload = new CommentModel(
                                                {
                                                    clientId: payLoad._id,
                                                    createdAt: payLoad.createdAt ?? new Date(),
                                                    createdBy: payLoad.createdBy ?? 'UNKNOWN',
                                                    type: CommentType.EDIT_CLIENT,
                                                }
                                            )
                                            self.createComment(commentPayload);
                                        }

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
            logging.info(NAMESPACE, `ClientTask.delete`, `Client Id : ${clientId}`);

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT).updateOne(
                            { _id: new ObjectID(clientId) },
                            { $set: { isActive: false } },
                            { upsert: false },
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
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    createComment(comment: CommentModel) {
        this.commentTask.create(comment)
    }

}