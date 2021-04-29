import { Request, Router, Response } from "express";
import CountryService from "../service/country.service";

export default class CountryRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const countryService = new CountryService();

        /**
         * create
         */
        this.router.post('/', (req: Request, res: Response) => {
            countryService.create(req, res);
        });

        /**
         * get all countries list
         */
        this.router.get('/', (req: Request, res: Response) => {
            countryService.getAll(req, res);
        });

        /**
        * delete
        */
        this.router.delete('/:countryId', (req: Request, res: Response) => {
            countryService.delete(req, res);
        });


    }
}