import { Request, Router, Response } from "express";
import UserService from "../service/user.service";

export default class UserRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const userService = new UserService();

        /**
         * create
         */
        this.router.post('/', (req: Request, res: Response) => {
            userService.create(req, res);
        });

        /**
         * get all users list
         */
        this.router.get('/', (req: Request, res: Response) => {
            userService.getAll(req, res);
        });

        /**
        * delete
        */
        this.router.delete('/:userId', (req: Request, res: Response) => {
            userService.delete(req, res);
        });

        /**
        * update
        */
         this.router.put('/', (req: Request, res: Response) => {
            userService.update(req, res);
        });

    }
}