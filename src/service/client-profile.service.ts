import { Request, Response } from "express";
import { ResponseModel } from "../models/response.model";
import logging from "../config/logging";
import ClientProfileTask from "../task/client-profile.task";

const NAMESPACE = 'CLIENT PROFILE SERVICE INFO'
export default class ClientProfileService {
    private clientProfileTask: ClientProfileTask;
    constructor() {
        this.clientProfileTask = new ClientProfileTask();
    }

    public create(req: Request, res: Response) {
        const payLoad = req.body;
        this.clientProfileTask.create(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    message: "Created",
                    data: response.insertedId ?? ''
                }
                logging.info(NAMESPACE, `ClientProfileService.create ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `ClientProfileService.create ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

    public getAll(req: Request, res: Response) {
        this.clientProfileTask.getAll(req.query)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    data: response ?? [],
                    length: response?.length ?? 0
                }
                logging.info(NAMESPACE, `ClientProfileService.getAll ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `ClientProfileService.getAll ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

    public getById(req: Request, res: Response) {
        this.clientProfileTask.getById(req.params.clientId)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    data: response ?? [],
                    length: response?.length ?? 0
                }
                logging.info(NAMESPACE, `ClientProfileService.getById ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: err?.code ?? 500,
                    data: err.msg ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, `ClientProfileService.getById ${JSON.stringify(err)}`);
                return res.status(err?.code ?? 500).json(errorData)
            });
    }

    public update(req: Request, res: Response) {
        const payLoad = req.body;
        this.clientProfileTask.update(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 500,
                    message: response?.msg,
                    data: response?.id
                }
                logging.info(NAMESPACE, `ClientProfileService.update ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `ClientProfileService.update ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

    public delete(req: Request, res: Response) {
        this.clientProfileTask.delete(req.params.clientId)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 200,
                    message: response?.msg
                }
                logging.info(NAMESPACE, `ClientProfileService.delete ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, `ClientProfileService.update ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

}