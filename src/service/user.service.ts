import { Request, Response } from "express";
import UserTask from "../task/user.task";
import { ResponseModel } from "../models/response.model";
import logging from "../config/logging";

const NAMESPACE = 'USER';
export default class UserService {
    private userTask: UserTask;
    constructor() {
        this.userTask = new UserTask();
    }

    public create(req: Request, res: Response) {

        const payLoad = req.body;

        this.userTask.create(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    message: "Created"
                }
                logging.info(NAMESPACE, 'UserService.create', JSON.stringify(responseData));
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: err.code ?? 500,
                    data: err?.msg ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, 'UserService.create', JSON.stringify(errorData));
                return res.status(500).json(errorData)
            });
    }

    public getAll(req: Request, res: Response) {
        this.userTask.getAll(req.query)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    data: response ?? [],
                    length: response?.length ?? 0
                }
                logging.info(NAMESPACE, 'UserService.getAll', JSON.stringify(responseData));
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.info(NAMESPACE, 'UserService.getAll', JSON.stringify(errorData));
                return res.status(500).json(errorData)
            });
    }
    public delete(req: Request, res: Response) {
        this.userTask.delete(req.params.userId)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 500,
                    message: response?.msg
                }
                logging.info(NAMESPACE, `userService.delete ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: err.status ?? 500,
                    data: err.msg ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, `userService.update ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }



    public update(req: Request, res: Response) {
        const payLoad = req.body;
        this.userTask.update(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 500,
                    message: response?.msg
                }
                logging.info(NAMESPACE, `userService.update ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `userService.update ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

}