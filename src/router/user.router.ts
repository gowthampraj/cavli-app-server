import { Request, Router, Response } from "express";
import extractJWT from "../middleware/extractJWT";
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
         * get all users list ?isActive=true/false
         */
        this.router.get('/', (req: Request, res: Response) => {
            userService.getAll(req, res);
        });

    }
}