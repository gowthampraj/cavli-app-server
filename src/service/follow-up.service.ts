import { Request, Response } from "express";
import { ResponseModel } from "../models/response.model";
import logging from "../config/logging";
import FollowUpTask from "../task/follow-up.task";

const NAMESPACE = 'FOLLOW_UP';

export default class FollowUpService {
    private followUpTask: FollowUpTask;
    constructor() {
        this.followUpTask = new FollowUpTask();
    }

    public create(req: Request, res: Response) {

        const payLoad = req?.body;

        this.followUpTask.create(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    message: "Created"
                }
                logging.info(NAMESPACE, 'FollowUpService.create', JSON.stringify(responseData));
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: err.code ?? 500,
                    data: err?.msg ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, 'FollowUpService.create', JSON.stringify(errorData));
                return res.status(500).json(errorData)
            });
    }

    public getByClientId(req: Request, res: Response) {
        const payLoad = req.params.clientId;
        this.followUpTask.getByClientId(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    data: response ?? [],
                    length: response?.length ?? 0
                }
                logging.info(NAMESPACE, 'FollowUpService.getAll', JSON.stringify(responseData));
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.info(NAMESPACE, 'FollowUpService.getAll', JSON.stringify(errorData));
                return res.status(500).json(errorData)
            });
    }

    public dashboard(req: Request, res: Response) {
        this.followUpTask.dashboard(req.query)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    data: response ?? [],
                    length: response?.length ?? 0
                }
                logging.info(NAMESPACE, 'FollowUpService.dashboard', JSON.stringify(responseData));
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.info(NAMESPACE, 'FollowUpService.dashboard', JSON.stringify(errorData));
                return res.status(500).json(errorData)
            });
    }

    public delete(req: Request, res: Response) {
        const { followUpId, clientId } = req.params;
        const payLoad = req?.body;
        this.followUpTask.delete(followUpId, clientId, payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 500,
                    message: response?.msg
                }
                logging.info(NAMESPACE, `UniversityService.delete ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: err.status ?? 500,
                    data: err.msg ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, `UniversityService.update ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

    public update(req: Request, res: Response) {
        const payLoad = req.body;
        this.followUpTask.update(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 500,
                    message: response?.msg
                }
                logging.info(NAMESPACE, `UniversityService.update ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `UniversityService.update ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }
}