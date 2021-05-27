// import { Cursor, ObjectID } from 'mongodb';
import { removeId } from '../utils/utils';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';
import signJWT from '../middleware/signJTW';
import UserTask from './user.task';
import { UserModel } from '../models/user.model';

const NAMESPACE = 'AUTH';

export default class AuthTask {
    private userTask = new UserTask()
    constructor() {
    }

    async login(data: any) {
        const isUserNameExist: any = await this.userTask.search({ username: data.username });
        const userList: UserModel[] = isUserNameExist.map((user: any) => new UserModel(user));

        return new Promise((resolve, reject) => {
            if (!userList?.length) {
                reject({ code: 400, msg: "No user found" });
                return
            };
            if (!userList[0].isActive) {
                reject({ code: 400, msg: "User is not active" });
                return
            };
            if (!userList[0].permission?.login) {
                reject({ code: 400, msg: "Login is not vaild" });
                return
            };
            bcryptjs.compare(data.password, userList[0].password)
                .then((isPasswordMatch: boolean) => {
                    if (!isPasswordMatch) {
                        reject({ code: 401, msg: "UserName / Password Mismatch" });
                    } else {
                        signJWT(isUserNameExist[0], (_error, token) => {
                            if (_error) {
                                logging.info(NAMESPACE, `Attempting to sign token for ${_error}`);
                                reject({ code: 400, msg: "Something went wrong!" });
                            } else if (token) {
                                logging.info(NAMESPACE, `token for [${isUserNameExist[0]._id}] is [${token}]`);
                                resolve({ code: 200, token: token, data: { ...isUserNameExist[0] } })
                            }
                        });
                    }
                }).catch(x => {
                    reject({ code: 400, msg: "Something went wrong!" });
                });
        });
    }
}
