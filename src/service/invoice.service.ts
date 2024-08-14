import { Request, Response } from "express";
import invoiceTask from "../task/invoice.task";
import { ResponseModel } from "../models/response.model";
import logging from "../config/logging";


const NAMESPACE = 'INVOICE';

export default class InvoiceService {

    private invoiceTask: invoiceTask;
    constructor() {
        this.invoiceTask = new invoiceTask();
    }

    public create(req: Request, res: Response) {

        const payLoad = req?.body;

        this.invoiceTask.create(payLoad)
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
        this.invoiceTask.getAll(req.query)
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

    public updateAction(req: Request, res: Response) {
        const invoiceId = req.params.invoiceId;
        const action = req.body;
        this.invoiceTask.updateAction(invoiceId, action)
        .then((response: any) => {
            const responseData: ResponseModel = {
                status: 'Success',
                code: 200,
                data: response ?? [],
                message: 'Action updated successfully'
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
    
    public deleteInvoice(req: Request, res: Response) {
        const invoiceId = req.params.invoiceId;
        this.invoiceTask.deleteInvoice(invoiceId)
        .then((response: any) => {
            const responseData: ResponseModel = {
                status: 'Success',
                code: 200,
                data: response ?? [],
                message: 'Invoice Deleted successfully'
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
}  
