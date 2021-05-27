import { Request, Router, Response } from "express";
import ClientProfileService from "../service/client-profile.service";

export default class ClientProfileRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const clientProfileService = new ClientProfileService();

        /**
         * create
         */
        this.router.post('/', (req: Request, res: Response) => {
            clientProfileService.create(req, res);
        });

        /**
         * get 
         */
        this.router.get('/', (req: Request, res: Response) => {
            clientProfileService.getAll(req, res);
        });

        /**
        * get all 
        */
        this.router.get('/:clientId', (req: Request, res: Response) => {
            clientProfileService.getById(req, res);
        });

        /**
         * Update Fields
         */
        this.router.put('/', (req: Request, res: Response) => {
            clientProfileService.update(req, res);
        });

        /**
         * delete
         */
        this.router.delete('/:clientId', (req: Request, res: Response) => {
            clientProfileService.delete(req, res);
        });

    }
}