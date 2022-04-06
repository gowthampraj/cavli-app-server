import { Request, Router, Response } from "express";
import ServiceProvidedService from "../service/service-provided.service";

export default class ServiceProvidedRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const serviceProvidedService = new ServiceProvidedService();

        /**
         * create
         */
        this.router.post('/', (req: Request, res: Response) => {
            serviceProvidedService.create(req, res);
        });

        /**
         * get all service list
         */
        this.router.get('/', (req: Request, res: Response) => {
            serviceProvidedService.getAll(req, res);
        });

        /**
        * delete
        */
        this.router.delete('/:id', (req: Request, res: Response) => {
            serviceProvidedService.delete(req, res);
        });

        /**
        * update
        */
         this.router.put('/', (req: Request, res: Response) => {
            serviceProvidedService.update(req, res);
        });

    }
}