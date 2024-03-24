import { Request, Response } from "express";
import ClientTask from "../task/client.task";
import { ResponseModel } from "../models/response.model";
import logging from "../config/logging";

const NAMESPACE = 'CLIENT'
export default class ClientService {
    private clientTask: ClientTask;
    constructor() {
        this.clientTask = new ClientTask();
    }

    public create(req: Request, res: Response) {
        const payLoad = req.body;
        this.clientTask.create(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    message: "Created",
                    data: response.insertedId ?? ''
                }
                // logging.info(NAMESPACE, `ClientService.create ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `ClientService.create ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

    public getAll(req: Request, res: Response) {
        this.clientTask.getAll(req.query)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    data: response?.data ?? [],
                    page: response.page
                }
                // logging.info(NAMESPACE, `ClientService.getAll ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `ClientService.getAll ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

    public getAllEnquiry(req: Request, res: Response) {
        this.clientTask.getAllEnquiry(req.query)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    data: response?.data ?? [],
                    page: response.page
                }
                // logging.info(NAMESPACE, `ClientService.getAll ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `ClientService.getAll ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

    public getById(req: Request, res: Response) {
        this.clientTask.getById(req.params.clientId)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    data: response ?? [],
                    length: response?.length ?? 0
                }
                // logging.info(NAMESPACE, `ClientService.getById ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, `ClientService.getById ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

    public update(req: Request, res: Response) {
        const payLoad = req.body;
        this.clientTask.update(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 500,
                    message: response?.msg,
                    data: response?.id
                }
                // logging.info(NAMESPACE, `ClientService.update ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.warn(NAMESPACE, `ClientService.update ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

    public delete(req: Request, res: Response) {
        this.clientTask.delete(req.params.clientId)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 200,
                    message: response?.msg
                }
                // logging.info(NAMESPACE, `ClientService.delete ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, `ClientService.delete ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }


    public changeTypeToClient(req: Request, res: Response) {
        this.clientTask.changeTypeToClient(req.body)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 200,
                    message: response?.msg
                }
                // logging.info(NAMESPACE, `ClientService.delete ${JSON.stringify(responseData)}`);
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, `ClientService.delete ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }


    /**
     * getDashboard
     */
    public getDashboard(req: Request, res: Response) {
        this.clientTask.getDashboard(req.query)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 200,
                    data: response,
                    message: response?.msg
                }
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, `ClientService.getDashboard ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

    public clientCount(req: Request, res: Response) {
        this.clientTask.clientCount(req.query)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: response?.status ?? 200,
                    data: response,
                    message: response?.msg
                }
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, `ClientService.clientCount ${JSON.stringify(err)}`);
                return res.status(500).json(errorData)
            });
    }

}