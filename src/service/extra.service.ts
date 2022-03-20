import { Request, Response } from "express";
import ExtraTask from "../task/extra.task";
import { ResponseModel } from "../models/response.model";
import logging from "../config/logging";

const NAMESPACE = 'EXTRA';

export default class EXtraService {
    private extraTask: ExtraTask;
    constructor() {
        this.extraTask = new ExtraTask();
    }

    public create(req: Request, res: Response) {

        const payLoad = req?.body;

        this.extraTask.create(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    message: "Created"
                }
                logging.info(NAMESPACE, 'EXtraService.create', JSON.stringify(responseData));
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: err.code ?? 500,
                    data: err?.msg ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, 'EXtraService.create', JSON.stringify(errorData));
                return res.status(500).json(errorData)
            });
    }

    public getAll(req: Request, res: Response) {
        this.extraTask.getAll(req.query)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    data: response ?? [],
                    length: response?.length ?? 0
                }
                logging.info(NAMESPACE, 'EXtraService.getAll', JSON.stringify(responseData));
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.info(NAMESPACE, 'EXtraService.getAll', JSON.stringify(errorData));
                return res.status(500).json(errorData)
            });
    }

    public update(req: Request, res: Response) {
        const payLoad = req.body;
        this.extraTask.update(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 500,
                    message: response?.msg
                }
                logging.info(NAMESPACE, `EXtraService.update ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `EXtraService.update ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }
}