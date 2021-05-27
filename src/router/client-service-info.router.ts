import { Request, Router, Response } from "express";
import ClientServiceInfoService from "../service/client-service-info.service";

export default class ClientServiceInfoRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const clientServiceInfoService = new ClientServiceInfoService();

        /**
         * create
         */
        this.router.post('/', (req: Request, res: Response) => {
            clientServiceInfoService.create(req, res);
        });

        /**
         * get all client list ?isActive=true/false
         */
        this.router.get('/', (req: Request, res: Response) => {
            clientServiceInfoService.getAll(req, res);
        });

        /**
        * get all client list ?isActive=true/false
        */
        this.router.get('/:clientId', (req: Request, res: Response) => {
            clientServiceInfoService.getById(req, res);
        });

        /**
         * Update Fields
         */
        this.router.put('/', (req: Request, res: Response) => {
            clientServiceInfoService.update(req, res);
        });

        /**
         * Update Fields
         */
        this.router.delete('/:clientId', (req: Request, res: Response) => {
            clientServiceInfoService.delete(req, res);
        });

    }
}