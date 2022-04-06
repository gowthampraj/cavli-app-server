import DbClient = require('../mongoclient');
import { removeId, removePassword } from '../utils/utils';
import { Cursor, ObjectID, ObjectId } from 'mongodb';
import logging from '../config/logging';
import { UserModel } from '../models/user.model';
import { PasswordGenerator } from '../middleware/password-generater';

const NAMESPACE = 'USER';
const COLLECTION_NAME_USER = 'user';

export default class UserTask {

    private mongoConnection: any;

    constructor() {
        this.mongoConnection = DbClient.getInstance();
    }


    async create(data?: any) {
        /**
        * search for user name
        */
        const user: UserModel = new UserModel(data);
        const isUserNameExist = await this.search({ username: user.username }, true);
        if (!isUserNameExist)
            var bcryptjsHasedPassword = await new PasswordGenerator(user.password).generate();

        return new Promise((resolve, reject) => {
            if (isUserNameExist) {
                reject({ code: "400", msg: "User Name already Exist" });
                return;
            }
            if (!data || Object.keys(data).length === 0) {
                reject({ msg: 'Body is required' });
                return;
            }

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_USER).insertOne(
                            { ...user, password: bcryptjsHasedPassword },
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
                        connection.collection(COLLECTION_NAME_USER).find(fields,
                            function (err: any, users: Cursor) {
                                users.toArray().then(userList => {
                                    resolve(isBoolenRes ? userList?.length > 0 : userList.map(user => new UserModel(user)));
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
                        connection.collection(COLLECTION_NAME_USER).find(field,
                            function (err: any, users: Cursor) {
                                users.toArray().then((userList: any) => {
                                    userList.forEach((x: any) => {
                                        x = removePassword(x);
                                    })
                                    resolve(userList);
                                });
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    public getById(userId: any) {
        return new Promise((resolve, reject) => {
            if (!userId) {
                reject('User Id is required');
            }
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_USER).find({ _id: new ObjectID(userId) },
                            function (err: any, users: Cursor) {
                                users.toArray().then(userList => {
                                    if (userList[0]) {
                                        resolve(userList[0]);
                                    } else {
                                        reject(`No user found`);
                                    }
                                });
                            });
                    } catch (error) {
                        reject(JSON.stringify(error));
                        logging.error(NAMESPACE, 'UserTask.getById', JSON.stringify(error));
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
                        connection.collection(COLLECTION_NAME_USER).deleteOne(
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

    public update(data: any, isReLoginNeeded?: boolean) {

        return new Promise(async (resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required');
            }

            let payLoad: UserModel = new UserModel(data);
            payLoad.loginNeeded = isReLoginNeeded ?? true; /** Set as login needed again */
            if (payLoad.password) {
                const bcryptjsHasedPassword = await new PasswordGenerator(payLoad.password).generate();
                payLoad = { ...payLoad, password: bcryptjsHasedPassword }
            }

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_USER).updateOne(
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
