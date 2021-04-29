// import { Cursor, ObjectID } from 'mongodb';
import DbClient = require('../mongoclient');
import { removeId, removePassword } from '../utils/utils';
// import IUser from '../models/IUser';
import bcryptjs from 'bcryptjs';
import { Cursor } from 'mongodb';
import logging from '../config/logging';
import User from '../models/user';
import signJWT from '../middleware/signJTW';
import { UserModel } from '../models/user.model';

const NAMESPACE = 'USER';

export default class UserTask {
    constructor() {
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
                reject("User Name already Exist");
                return;
            }
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required');
                return;
            }

            DbClient.connect()
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
                .catch(err => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    };

    public search(fields: any, isBoolenRes?: boolean) {
        return new Promise((resolve, reject) => {
            DbClient.connect()
                .then((connection: any) => {
                    try {
                        connection.collection('user').find(fields,
                            function (err: any, users: Cursor) {
                                users.toArray().then(userList => {
                                    resolve(isBoolenRes ? userList?.length > 0 : userList);
                                });
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch(err => reject(`DB connection Error : ${JSON.stringify(err)}`));
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
            DbClient.connect()
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
                .catch(err => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

}
