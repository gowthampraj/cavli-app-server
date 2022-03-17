import { Request, Router, Response } from "express";
import ExcelService from "../service/excel.service";

export default class ExportRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const excelService = new ExcelService();

        /**
         * create
         */
        this.router.get('/', (req: Request, res: Response) => {
            switch (req.query?.type) {
                case 'PDF':
                    excelService.exportPDF(req, res);
                    break;

                default:
                    break;
            }

        });

    }
}