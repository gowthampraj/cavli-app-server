import DbClient = require('../mongoclient');
import { removeId, removePassword } from '../utils/utils';
import bcryptjs from 'bcryptjs';
import { Cursor, ObjectId } from 'mongodb';
import logging from '../config/logging';
import { UserModel } from '../models/user.model';

const NAMESPACE = 'USER';

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
            var bcryptjsHasedPassword = await bcryptjs.hash(user.password, 1)

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
                        connection.collection('user').insertOne(
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
                        connection.collection('user').find(fields,
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
                        connection.collection('user').find(field,
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

    public delete(clientId?: any) {

        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection('user').deleteOne(
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
}
