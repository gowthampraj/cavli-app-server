import { Request, Response } from "express";
import ClientServiceInfoTask from "../task/client-service-info.task";
import { ResponseModel } from "../models/response.model";
import logging from "../config/logging";

const NAMESPACE = 'CLIENT SERVICE INFO'
export default class ClientServiceInfoService {
    private clientServiceInfoTask: ClientServiceInfoTask;
    constructor() {
        this.clientServiceInfoTask = new ClientServiceInfoTask();
    }

    public create(req: Request, res: Response) {
        const payLoad = req.body;
        this.clientServiceInfoTask.create(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    message: "Created",
                    data: response.insertedId ?? ''
                }
                logging.info(NAMESPACE, `ClientServiceInfoService.create ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `ClientServiceInfoService.create ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

    public getAll(req: Request, res: Response) {
        this.clientServiceInfoTask.getAll(req.query)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    data: response ?? [],
                    length: response?.length ?? 0
                }
                logging.info(NAMESPACE, `ClientServiceInfoService.getAll ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `ClientServiceInfoService.getAll ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

    public getById(req: Request, res: Response) {
        this.clientServiceInfoTask.getById(req.params.clientId)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    data: response ?? [],
                    length: response?.length ?? 0
                }
                logging.info(NAMESPACE, `ClientServiceInfoService.getById ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: err?.code ?? 500,
                    data: err.msg ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, `ClientServiceInfoService.getById ${JSON.stringify(err)}`);
                return res.status(err?.code ?? 500).json(errorData)
            });
    }

    public update(req: Request, res: Response) {
        const payLoad = req.body;
        this.clientServiceInfoTask.update(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 500,
                    message: response?.msg,
                    data: response?.id
                }
                logging.info(NAMESPACE, `ClientServiceInfoService.update ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `ClientServiceInfoService.update ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

    public delete(req: Request, res: Response) {
        this.clientServiceInfoTask.delete(req.params.clientId)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 200,
                    message: response?.msg
                }
                logging.info(NAMESPACE, `ClientServiceInfoService.delete ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, `ClientServiceInfoService.update ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

}