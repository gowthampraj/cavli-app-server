import { Request, Router, Response } from "express";
import FollowUpService from "../service/follow-up.service";

export default class FollowUpRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const followUpService = new FollowUpService();

        /**
         * create
         */
        this.router.post('/', (req: Request, res: Response) => {
            followUpService.create(req, res);
        });

        this.router.get('/dashboard', (req: Request, res: Response) => {
            followUpService.dashboard(req, res);
        });


        /**
         * get all for a client
         */
        this.router.get('/:clientId', (req: Request, res: Response) => {
            followUpService.getByClientId(req, res);
        });

        /**
        * delete
        */
        this.router.post('/remove/:followUpId/client-id/:clientId', (req: Request, res: Response) => {
            followUpService.delete(req, res);
        });

        this.router.put('/', (req: Request, res: Response) => {
            followUpService.update(req, res);
        });

    }
}