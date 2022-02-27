import { Request, Router, Response } from "express";
import CompanyService from "../service/company.service";

export default class CompanyRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const companyService = new CompanyService();

        /**
         * create
         */
        this.router.post('/', (req: Request, res: Response) => {
            companyService.create(req, res);
        });

        /**
         * get all countries list
         */
        this.router.get('/', (req: Request, res: Response) => {
            companyService.getAll(req, res);
        });

        /**
        * delete
        */
        this.router.delete('/:companyId', (req: Request, res: Response) => {
            companyService.delete(req, res);
        });

        /**
         * delete
         */
        this.router.put('/', (req: Request, res: Response) => {
            companyService.update(req, res);
        });

    }
}