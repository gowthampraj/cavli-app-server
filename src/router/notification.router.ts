import { Request, Router, Response } from "express";
import NotificationService from "../service/notification.service";

export default class NotificationRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const notificationService = new NotificationService();

        /**
         * create
         */
        this.router.post('/', (req: Request, res: Response) => {
            notificationService.create(req, res);
        });

        /**
         * get by client Id
         */
        this.router.get('/:userId', (req: Request, res: Response) => {            
            notificationService.getById(req, res);
        });

        /**
         * delete
         */
        this.router.put('/', (req: Request, res: Response) => {
            notificationService.update(req, res);
        });

    }
}