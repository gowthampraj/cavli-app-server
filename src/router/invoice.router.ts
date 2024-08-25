import { Request, Router, Response } from "express";
import InvoiceService from "../service/invoice.service";

export default class invoiceRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const invoiceService = new InvoiceService();

        /**
         * create
         */
        this.router.post('/', (req: Request, res: Response) => {
            invoiceService.create(req, res);
        });

         /**
         * get all invoice list
         */
    
        this.router.get('/', (req: Request, res: Response) => {
            invoiceService.getAll(req, res);
        });
        


        this.router.patch('/updateaction/:invoiceId', (req: Request, res: Response) => {
           invoiceService.updateAction(req, res);
        });

        this.router.delete('/:invoiceId', (req: Request, res: Response) => {
           invoiceService.deleteInvoice(req,res);
        });
    }
}