import DbClient = require('../mongoclient');
import { Cursor, ObjectID, ObjectId } from 'mongodb';
import logging from '../config/logging';
import { removeId } from '../utils/utils';
import { FollowUp } from '../models/follow-up';
import CommentTask from './comment.task';
import { CommentModel, CommentType } from '../models/comment.model';

const NAMESPACE = 'FOLLOW_UP';
const COLLECTION_NAME_FOLLOW_UP = 'follow-up';
export default class FollowUpTask {

    private mongoConnection: any;
    private commentTask: CommentTask;

    constructor() {
        this.mongoConnection = DbClient.getInstance();
        this.commentTask = new CommentTask();
    }


    async create(data?: any) {
        /**
        * search for followUp name
        */
        const self = this;

        const followUp: FollowUp = new FollowUp(data);
        const { createdBy, createdId, clientId } = followUp;

        return new Promise(async (resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject({ msg: 'Body is required' });
                return;
            }

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_FOLLOW_UP).insertOne(
                            { ...followUp },
                            async function (err: any, res: any) {
                                if (res.insertedCount) {

                                    const commentPayload = new CommentModel(
                                        {
                                            clientId: clientId,
                                            createdAt: new Date().toISOString(),
                                            createdBy: createdBy,
                                            type: CommentType.FOLLOW_UP_ADD,
                                            createdId: createdId,
                                            data: followUp
                                        }
                                    )
                                    self.createComment(commentPayload);
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


    public async dashboard(qParms: any) {
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
                        "followUpDate": { $eq: null }
                    }
                },
                {
                    '$sort': {
                        // 'doj': -1
                        'followUpScheduleDate': 1
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
                        followUpScheduleComment: 1,
                        followUpScheduleDate: 1,
                        createdBy: 1,
                        createdAt:1,
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
            const result = conn.collection(COLLECTION_NAME_FOLLOW_UP).aggregate(filter);
            return await result.toArray();
        } catch (error) {
            logging.error(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
        }

    }

    public getByClientId(clientId: string) {

        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_FOLLOW_UP).find({ clientId },
                            function (err: any, followUp: Cursor) {
                                followUp.toArray().then((followUpList: any) => {
                                    resolve(followUpList);
                                });
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    public delete(
        followUpId: any,
        clientId: string,
        followUp: FollowUp
    ) {
        const self = this;
        const { createdBy, createdId } = followUp;
        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_FOLLOW_UP).deleteOne(
                            { _id: new ObjectId(followUpId) }, function (err: any, country: any) {

                                if (country.deletedCount) {
                                    const commentPayload = new CommentModel(
                                        {
                                            clientId: new ObjectID(clientId).toString(),
                                            createdAt: new Date().toISOString(),
                                            createdBy: createdBy,
                                            type: CommentType.FOLLOW_UP_REMOVED,
                                            createdId: createdId,
                                            data: followUp
                                        }
                                    )
                                    self.createComment(commentPayload);
                                    resolve({ status: 200, msg: "Deleted" });
                                } else {
                                    reject({ status: 400, msg: "Something went wrong" })
                                }
                            }
                        )
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    public update(data: FollowUp) {
        const self = this;
        const { createdBy, createdId, clientId } = data;
        return new Promise((resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required');
            }

            let payLoad: FollowUp = new FollowUp(data);

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_FOLLOW_UP).updateOne(
                            { _id: new ObjectID(payLoad._id) },
                            { $set: removeId(JSON.parse(JSON.stringify(payLoad))) },
                            { upsert: false },
                            function (err: any, res: any) {
                                if (res.matchedCount) {
                                    if (res.matchedCount === res.modifiedCount) {

                                        const commentPayload = new CommentModel(
                                            {
                                                clientId: new ObjectID(clientId).toString(),
                                                createdAt: new Date().toISOString(),
                                                createdBy: createdBy,
                                                type: (payLoad.followUpDate)
                                                    ? CommentType.FOLLOW_UP_RESOLVED
                                                    : CommentType.FOLLOW_UP_UPDATE,
                                                createdId: createdId,
                                                data: payLoad
                                            }
                                        )
                                        self.createComment(commentPayload);;

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


    async createComment(comment: CommentModel) {
        await this.commentTask.create(comment)
    }
}
