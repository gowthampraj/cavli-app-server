import DbClient = require('../mongoclient');
import { removeId, removePassword } from '../utils/utils';
import { Cursor, ObjectID, ObjectId } from 'mongodb';
import logging from '../config/logging';
import { CourseModel } from '../models/course.model';

const NAMESPACE = 'COURSE';
const COLLECTION_NAME_COURSE = 'course';

export default class CourseTask {

    private mongoConnection: any;

    constructor() {
        this.mongoConnection = DbClient.getInstance();

    }


    create(data?: any) {
        /**
        * search for course name
        */
        return new Promise(async (resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject({ msg: 'Body is required' });
                return;
            }

            const course: CourseModel = new CourseModel(data);
            const isCourseNameExist = await this.search({ name: course.name }, true);
            if (isCourseNameExist) {
                reject({ code: "400", msg: "Course already Exist" });
                return;
            }


            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_COURSE).insertOne(
                            course,
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

    public search(fields: any, isBoolenRes?: boolean) {
        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_COURSE).find(fields,
                            function (err: any, users: Cursor) {
                                users.toArray().then(courseList => {
                                    resolve(isBoolenRes ? courseList?.length > 0 : courseList.map(course => new CourseModel(course)));
                                });
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });
    }

    public getAll(fields?: any) {

        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_COURSE).find({},
                            { sort: { name: 1 } },
                            function (err: any, course: Cursor) {
                                course?.toArray().then((courseList: any) => {
                                    resolve(courseList);
                                });
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    public delete(clientId?: any) {

        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_COURSE).deleteOne(
                            { _id: new ObjectId(clientId) }, function (err: any, users: any) {
                                console.log(users);
                                if (users.deletedCount) {
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

    public update(data: any) {

        return new Promise((resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required');
            }

            let payLoad: CourseModel = new CourseModel(data);

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_COURSE).updateOne(
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
