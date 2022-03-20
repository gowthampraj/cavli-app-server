import { Request, Router, Response } from "express";
import EXtraService from "../service/extra.service";

export default class ExtraRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const extraService = new EXtraService();

        /**
         * create
         */
        this.router.post('/', (req: Request, res: Response) => {
            extraService.create(req, res);
        });

        /**
         * get all countries list
         */
        this.router.get('/', (req: Request, res: Response) => {
            extraService.getAll(req, res);
        });

        /**
         * delete
         */
        this.router.put('/', (req: Request, res: Response) => {
            extraService.update(req, res);
        });

    }
}