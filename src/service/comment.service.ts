import { Request, Response } from "express";
import CommentTask from "../task/comment.task";
import { ResponseModel } from "../models/response.model";
import logging from "../config/logging";

const NAMESPACE = 'COMMENT'
export default class CommentService {
    private commentTask: CommentTask;
    constructor() {
        this.commentTask = new CommentTask();
    }

    public create(req: Request, res: Response) {
        const payLoad = req.body;
        this.commentTask.create(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    message: "Created"
                }
                logging.info(NAMESPACE, 'CommentService.create', JSON.stringify(responseData));
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, 'CommentService.create', JSON.stringify(errorData));
                return res.status(500).json(errorData)
            });
    }

    public getCommentsById(req: Request, res: Response) {
        const payLoad = req.params.clientId;
        this.commentTask.getCommentsById(payLoad)
            .then((response: any) => {
                const responseData: ResponseModel = {
                    status: 'Success',
                    code: 200,
                    data: response ?? [],
                    length: response?.length ?? 0
                }
                logging.info(NAMESPACE, 'CommentService.getCommentsById', JSON.stringify(responseData));
                return res.status(200).json(responseData)
            })
            .catch((err: any) => {
                const errorData: ResponseModel = {
                    status: 'Fail',
                    code: 500,
                    data: err ?? 'Internal Server error',
                }
                logging.error(NAMESPACE, 'CommentService.getCommentsById', JSON.stringify(errorData));
                return res.status(500).json(errorData)
            });
    }
}