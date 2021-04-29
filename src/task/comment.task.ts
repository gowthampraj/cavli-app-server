
import { Cursor, ObjectID } from 'mongodb';
import DbClient = require('../mongoclient');
import { removeId } from '../utils/utils';
import { ClientModel } from '../models/client.model';
import { Comment } from '../models/comment.model';
import mongoose from "mongoose";
import { json } from 'body-parser';

export default class CommentTask {
    constructor() {
    }

    create(data: any) {
        return new Promise((resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required')
            }

            let payLoad: Comment = new Comment(data);
            console.log('[Payload] CommentTask.createComments :' + JSON.stringify(payLoad));

            DbClient.connect()
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
                .catch(err => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }


    getCommentsById(clientId?: any) {
        const payload = JSON.parse(JSON.stringify({ "clientId": clientId }));
        return new Promise((resolve, reject) => {
            DbClient.connect()
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
                .catch(err => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }
}