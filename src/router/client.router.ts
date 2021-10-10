import { Request, Router, Response } from "express";
import ClientService from "../service/client.service";

export default class ClientRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const clientService = new ClientService();

        /**
         * create
         */
        this.router.post('/', (req: Request, res: Response) => {
            clientService.create(req, res);
        });

        /**
         * get all client list ?isActive=true/false
         */
        this.router.get('/', (req: Request, res: Response) => {
            clientService.getAll(req, res);
        });

        /**
        * get client by ID
        */
        this.router.get('/:clientId', (req: Request, res: Response) => {
            clientService.getById(req, res);
        });

        /**
         * Update Fields
         */
        this.router.put('/', (req: Request, res: Response) => {
            clientService.update(req, res);
        });

        /**
         * Update Fields
         */
        this.router.delete('/:clientId', (req: Request, res: Response) => {
            clientService.delete(req, res);
        });

    }
}