
import { Cursor } from 'mongodb';
import DbClient = require('../mongoclient');
import { CommentModel } from '../models/comment.model';
import logging from '../config/logging';

const NAMESPACE = 'COMMENTS';
const COLLECTION_NAME_COMMENT = 'comments';
export default class CommentTask {
    private mongoConnection: any;

    constructor() {
        this.mongoConnection = DbClient.getInstance();

    }

    create(data: any) {
        return new Promise((resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required')
            }

            let payLoad: CommentModel = new CommentModel(data);
            logging.info(NAMESPACE, `CommentTask.create`, payLoad);

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_COMMENT).insertOne(payLoad, function (err: any, res: any) {
                            if (res.insertedCount) {
                                resolve(res.insertedCount)
                            }
                        });
                    } catch (error) {
                        logging.info(NAMESPACE, `CommentTask.create`, error);
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }


    getCommentsById(clientId?: any) {
        const payload = JSON.parse(JSON.stringify({ "clientId": clientId }));
        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_COMMENT)
                            .find(payload,
                                { sort: { createdAt: -1 } },
                                function (err: any, comments: Cursor) {
                                    comments.toArray().then(commentList => {
                                        resolve(commentList);
                                    });
                                });
                    } catch (error) {
                        logging.info(NAMESPACE, `CommentTask.create`, error);
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });
    }

    delete(clientId: any) {

        return new Promise((resolve, reject) => {
            if (!clientId) reject('Client Id is required');
            logging.info(NAMESPACE, `CommentTask.delete`, `Client Id : ${clientId}`);

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_COMMENT).deleteMany(
                            { clientId },
                            function (err: any, res: any) {
                                if (res.matchedCount) {
                                    if (res.matchedCount === res.modifiedCount) {
                                        logging.info(NAMESPACE, `CommentTask.delete`, `Change status to Client Id : ${clientId}`);

                                        resolve({ status: 200, msg: "Deleted" });
                                    } else resolve({ status: 400, msg: "Nothing to update" });
                                } else {
                                    resolve({ status: 404, msg: 'No match found' });
                                }
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `CommentTask.delete`, error);
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }
}