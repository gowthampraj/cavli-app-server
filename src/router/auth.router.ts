import { Request, Router, Response } from "express";
import AuthService from "../service/auth.service";

export default class AuthRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const userService = new AuthService();

        /**
        * login
        */
        this.router.post('/login', (req: Request, res: Response) => {
            userService.login(req, res);
        });

    }
}