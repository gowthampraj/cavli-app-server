import { Request, Response } from "express";
import { ResponseModel } from "../models/response.model";
import logging from "../config/logging";
import NotificationTask from "../task/notification.task";

const NAMESPACE = 'EXTRA';

export default class NotificationService {
    private notificationTask: NotificationTask;
    constructor() {
        this.notificationTask = new NotificationTask();
    }

    public create(req: Request, res: Response) {

        const payLoad = req?.body;

        this.notificationTask.create(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    message: "Created"
                }
                logging.info(NAMESPACE, 'NotificationService.create', JSON.stringify(responseData));
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: err.code ?? 500,
                    data: err?.msg ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, 'NotificationService.create', JSON.stringify(errorData));
                return res.status(500).json(errorData)
            });
    }

    public getById(req: Request, res: Response) {
        this.notificationTask.getById(req.params.id)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    data: response ?? [],
                    length: response?.length ?? 0
                }
                logging.info(NAMESPACE, 'NotificationService.getById', JSON.stringify(responseData));
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.info(NAMESPACE, 'NotificationService.getById', JSON.stringify(errorData));
                return res.status(500).json(errorData)
            });
    }

    public update(req: Request, res: Response) {
        const payLoad = req.body;
        this.notificationTask.update(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 500,
                    message: response?.msg
                }
                logging.info(NAMESPACE, `NotificationService.update ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `NotificationService.update ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }
}