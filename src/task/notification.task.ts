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

    public async getById(userId: string, queyParams: any) {
        const readAll = queyParams.all === 'true'

        const query: any = [
            {
                '$match': {
                    ...(!readAll ? { 'isRead': false } : {}),
                    // 'isRead': false,
                    'userId': userId
                }
            },
            { '$sort': { 'createdAt': -1 } },
            ...(readAll ? [{ '$limit': 1000 }] : []),
            {
                '$lookup': {
                    from: 'client',
                    let: { 'clientId': '$clientId' },
                    pipeline: [
                        { "$addFields": { "articleId": { "$toString": "$_id" } } },
                        { "$match": { "$expr": { "$eq": ["$articleId", "$$clientId"] } } }
                        , { "$project": { 'firstName': 1, 'lastName': 1, 'middleName': 1, 'isActive': 1 } }
                    ],
                    as: 'clientInfo'
                }
            },
            {
                '$project': {
                    clientId: 1,
                    _id: -1,
                    createdAt: 1,
                    company: 1,
                    createdBy: 1,
                    createdId: 1,
                    isRead: 1,
                    message: 1,
                    metaData: 1,
                    userId: 1,
                    clientInfo: { $first: "$clientInfo" }
                }
            }
        ];

        const conn = await this.mongoConnection.connect();
        const result = conn.collection(COLLECTION_NAME_NOTIFICATION).aggregate(query);
        return await result.toArray();

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
