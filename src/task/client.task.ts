import { Cursor, ObjectID } from 'mongodb';
import DbClient = require('../mongoclient');
import { removeId } from '../utils/utils';
import { ClientModel } from '../models/client.model';
import logging from '../config/logging';
import { CommentModel, CommentType } from '../models/comment.model';
import CommentTask from './comment.task';
import { AggregationCursor } from 'mongoose';
import { URLSearchParams } from 'url';
import ClientServiceInfoTask from './client-service-info.task';
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

    getAll(fields?: any, isExport?: boolean) {

        const extraProj = isExport ? { permanentAddress: 1, mailingAddress: 1, ackNo: 1, gender: 1, status: 1, passport: 1, nationality: 1, emergencyContact: 1, lastContacted: 1 } : {}
        const extraProj2 = isExport ? {
            "serviceInfo.interestedCourse": 1,
            "serviceInfo.payment": 1,
            "serviceInfo.serviceProvided": 1,
            "serviceInfo.doj": 1,
            "serviceInfo.sourceOfFund": 1,
            "serviceInfo.documentCollected": 1,
        } : {}
        const field: { [key: string]: any } = {};

        if (fields?.isActive) {
            field.isActive = fields?.isActive == true || fields?.isActive == 'true'
        }

        /**
         * give direct field only
         */
        const fieldArray = ['company', 'status'];

        fieldArray.forEach(x => {
            if (fields[x]) {
                field[x] = fields[x];
            }
        });

        const { size = 10, page = 1 } = fields;
        const skip = (page - 1) * size;
        const createdAt = JSON.parse(fields.createdAt);

        let createdAtQuery = {}
        if (createdAt.startDate && createdAt.endDate) {
            createdAtQuery = {
                "createdAt": { $gte: createdAt.startDate, $lte: createdAt.endDate }
            }
        }
        const query = [
            // { $match: field },
            { $match: { ...createdAtQuery, ...field } },
            { $sort: { createdAt: -1 } },
            // { $match: { "firstName": { $regex: "Arun" } } },
            // { $match: { "createdAt": { $gte: "2021-10-10T06:00:23.305Z" } } },
            // { $match: { "createdAt": { $gte: "2021-10-03T18:30:00.000Z" } } },
            {
                $project: {
                    "_id": {
                        "$toString": "$_id"
                    },
                    firstName: 1,
                    middleName: 1,
                    lastName: 1,
                    emailIds: 1,
                    contactNumber: 1,
                    isActive: 1,
                    createdAt: 1,
                    ...extraProj
                }
            },
            {
                $lookup: {
                    from: 'client-service-info',
                    localField: '_id',
                    foreignField: 'clientId',
                    as: 'serviceInfo'
                }
            },
            {
                $project: {
                    firstName: 1,
                    middleName: 1,
                    lastName: 1,
                    emailIds: 1,
                    contactNumber: 1,
                    isActive: 1,
                    createdAt: 1,
                    ...extraProj,
                    serviceInfo: { $first: "$serviceInfo" }
                }
            },
            {
                $project: {
                    firstName: 1,
                    middleName: 1,
                    lastName: 1,
                    emailIds: 1,
                    contactNumber: 1,
                    isActive: 1,
                    createdAt: 1,
                    ...extraProj,
                    ...extraProj2
                }
            },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: parseInt(size) }],
                    total: [
                        {
                            $count: 'total'
                        }
                    ]
                }
            }
        ];

        /** Find search keys and push into the query */
        const searchParams = new URLSearchParams(fields);
        const searchKeys = ['firstName', 'middleName', 'lastName', 'emailIds', 'contactNumber'];
        const filter: any = {};
        searchKeys.forEach(key => {
            const hasValue = searchParams.has(key);
            if (hasValue) {
                const value = searchParams.get(key);
                filter[key] = { $regex: value, $options: 'i' }
            }
        });
        if (Object.keys(filter).length) {
            query.splice(3, 0, { $match: filter })
        }

        /** Course status */
        const courseStatus = fields.courseStatus.split(",");
        const courseName = fields?.courseName?.split(",");
        const appliedCountry = fields?.appliedCountry?.split(",");
        const intake = fields?.intake?.split(",");

        if (courseStatus?.length && fields.courseStatus) {
            const courseStatusQuery: any = {
                '$match': {
                    'serviceInfo.interestedCourse.status': {
                        '$in': courseStatus
                    }
                }
            }
            query.splice(query.length - 1, 0, courseStatusQuery)
        }

        if (courseName?.length && fields.courseName) {
            const courseNameQuery: any = {
                '$match': {
                    'serviceInfo.interestedCourse.courseName': {
                        '$in': courseName
                    }
                }
            }
            query.splice(query.length - 1, 0, courseNameQuery)
        }

        if (appliedCountry?.length && fields.appliedCountry) {
            const countryQuery: any = {
                '$match': {
                    'serviceInfo.interestedCourse.appliedCountry': {
                        '$in': appliedCountry
                    }
                }
            }
            query.splice(query.length - 1, 0, countryQuery)
        }

        if (intake?.length && fields.intake) {
            const intakeQuery: any = {
                '$match': {
                    'serviceInfo.interestedCourse.intake': {
                        '$in': intake
                    }
                }
            }
            query.splice(query.length - 1, 0, intakeQuery)
        }

        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT).aggregate(
                            query
                            , async (err: any, data: AggregationCursor) => {
                                if (err) {
                                    reject(JSON.stringify(err));
                                } else {
                                    const result = await data.next();
                                    result.page = result?.total[0] || { total: 0 };
                                    result.page.size = parseInt(size);
                                    result.page.page = parseInt(page);
                                    resolve(result);
                                }
                            }
                        )
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

            let payLoad: ClientModel = new ClientModel(data?.data);
            logging.info(NAMESPACE, `ClientTask.update`, JSON.stringify(payLoad));

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
                                                    createdAt: payLoad?.modifiedAt ?? new Date(),
                                                    createdBy: payLoad.modifiedBy ?? 'UNKNOWN',
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


                        connection.collection(COLLECTION_NAME_CLIENT).deleteOne(
                            { _id: new ObjectID(clientId) }, function (err: any, client: any) {
                                if (client.deletedCount) {
                                    try {
                                        const clientServiceInfoTask: ClientServiceInfoTask = new ClientServiceInfoTask();
                                        const commentTask: CommentTask = new CommentTask();
                                        commentTask.delete(clientId)
                                        clientServiceInfoTask.delete(clientId);
                                    } catch (error) {

                                    }
                                    resolve({ status: 200, msg: "Deleted" });
                                } else {
                                    reject({ status: 400, msg: "Something went wrong" })
                                }
                            }
                        );
                    } catch (error) {
                        logging.info(NAMESPACE, `ClientTask.delete`, error);
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    /**
     * getDashboard
     */
    public getDashboard(fields?: any) {
        const createdAt = JSON.parse(fields?.createdAt || '{}');

        let createdAtQuery = {}
        if (createdAt.startDate && createdAt.endDate) {
            createdAtQuery = {
                "createdAt": { $gte: createdAt.startDate, $lte: createdAt.endDate }
            }
        }
        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_CLIENT)
                            .find(
                                {
                                    ...createdAtQuery
                                },
                                {
                                    projection: {
                                        firstName: 1,
                                        middleName: 1,
                                        lastName: 1,
                                        createdAt: 1
                                    },
                                    sort: { createdAt: -1 }
                                },
                                function (err: any, clients: Cursor) {
                                    clients.toArray().then(clientsList => {
                                        resolve(clientsList);
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


    createComment(comment: CommentModel) {
        this.commentTask.create(comment)
    }

}