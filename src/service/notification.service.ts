import { Request, Response } from "express";
import { ResponseModel } from "../models/response.model";
import logging from "../config/logging";
import NotificationTask from "../task/notification.task";
import { NotificationModel } from "../models/notification.model";
import { CommentModel, CommentType } from "../models/comment.model";
import ClientTask from "../task/client.task";
import ClientServiceInfoTask from "../task/client-service-info.task";
import { ServiceProvided } from "../models/service-provided.model";
import { extractDataFromPromiseToAllSettlePolyfill, promiseToAllSettlePolyfill } from "../utils/utils";

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
        this.notificationTask.getById(req.params.userId, req.query)
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

    /**
     * createNotificationFromComment
     */
    public async createNotificationFromComment(comment: CommentModel) {
        try {
            const clientId = comment.clientId;
            let userIds: string[] | any = [];
            /** Create notification datas */
            // 1. get client and client info
            const clientTask = new ClientTask();
            const clientServiceInfoTask = new ClientServiceInfoTask();

            const result = await promiseToAllSettlePolyfill([
                clientTask.getById(clientId),
                clientServiceInfoTask.getById(clientId)
            ])
            // 2. filter out userId
            const userData = extractDataFromPromiseToAllSettlePolyfill(result[0]);
            if (userData?.createdId)
                userIds.push(userData.createdId);
            const serviceInfo = extractDataFromPromiseToAllSettlePolyfill(result[1]);
            serviceInfo?.serviceProvided.forEach((s: ServiceProvided) => { userIds.push(...s.staffAllocated || []) });
            /** remove Undefined */
            userIds = userIds.filter((x: string) => !!x);
            /** Remove duplicates */
            userIds = Array.from(new Set(userIds));

            const notificationPromise: any[] = userIds.map((user: string) =>
                this.notificationTask.create({
                    userId: user,
                    clientId: comment.clientId,
                    metaData: comment.type,
                    message: comment.comment,
                    isRead: false,
                    createdAt: comment.createdAt,
                    createdBy: comment.createdBy,
                    createdId: comment.createdId
                }));

            await Promise.all(notificationPromise);
        } catch (error) {
            logging.error(NAMESPACE, `NotificationService.createNotification ${JSON.stringify(error)}`);
        }
    }
}