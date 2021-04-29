// import { Cursor, ObjectID } from 'mongodb';
import { removeId } from '../utils/utils';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';
import signJWT from '../middleware/signJTW';
import UserTask from './user.task';

const NAMESPACE = 'AUTH';

export default class AuthTask {
    private userTask = new UserTask()
    constructor() {
    }

    async login(data: any) {
        const isUserNameExist: any = await this.userTask.search({ username: data.username });

        return new Promise((resolve, reject) => {

            bcryptjs.compare(data.password, isUserNameExist[0]['password'])
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
                                resolve({ code: 200, token: token, data: { ...removeId(isUserNameExist[0]) } })
                            }
                        });
                    }
                }).catch(x => {
                    reject({ code: 400, msg: "Something went wrong!" });
                });
        });
    }
}
