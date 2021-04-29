
import { Cursor } from 'mongodb';
import DbClient = require('../mongoclient');
import { Comment } from '../models/comment.model';

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
            console.log('[Payload] CommentTask.createComments :' + JSON.stringify(payLoad));

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection('comments').insertOne(payLoad, function (err: any, res: any) {
                            if (res.insertedCount) {
                                resolve(res.insertedCount)
                            }
                        });
                    } catch (error) {
                        console.log("Unable to connect to db : " + JSON.stringify(error));
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
                        connection.collection('comments').find(payload,
                            function (err: any, comments: Cursor) {
                                comments.toArray().then(commentList => {
                                    resolve(commentList);
                                });
                            });
                    } catch (error) {
                        console.log("Unable to connect to db : " + JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }
}