
import { Cursor } from 'mongodb';
import DbClient = require('../mongoclient');
import { Comment } from '../models/comment.model';
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

            let payLoad: Comment = new Comment(data);
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
                        connection.collection(COLLECTION_NAME_COMMENT).find(payload,
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
}