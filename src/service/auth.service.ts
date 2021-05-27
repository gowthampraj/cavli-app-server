import { Request, Response } from "express";
import AuthTask from "../task/auth.task";
import { ResponseModel } from "../models/response.model";
import logging from "../config/logging";
const NAMESPACE = 'Auth'
export default class AuthService {
    private authTask: AuthTask;
    constructor() {
        this.authTask = new AuthTask();
    }

    public login(req: Request, res: Response) {

        const payLoad = req.body;

        this.authTask.login(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response.code ?? 200,
                    token: response.token,
                    data: { username: response.data.username, userRole: response.data.userRole, _id: response.data._id }
                }
                logging.info(NAMESPACE, 'UserService.login', responseData);
                return res.status(response.code ?? 200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: err.code ?? 500,
                    data: err.msg ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, 'UserService.login', errorData);
                return res.status(err.code ?? 500).json(errorData)
            });
    }
}