import { Request, Router, Response } from "express";
import UniversityService from "../service/university.service";

export default class UniversityRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const universityService = new UniversityService();

        /**
         * create
         */
        this.router.post('/', (req: Request, res: Response) => {
            universityService.create(req, res);
        });

        /**
         * get all countries list
         */
        this.router.get('/', (req: Request, res: Response) => {
            universityService.getAll(req, res);
        });

        /**
        * delete
        */
        this.router.delete('/:universityId', (req: Request, res: Response) => {
            universityService.delete(req, res);
        });

        /**
         * delete
         */
        this.router.put('/', (req: Request, res: Response) => {
            universityService.update(req, res);
        });

    }
}