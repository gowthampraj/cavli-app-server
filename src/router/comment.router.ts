import { Request, Router, Response } from "express";
import CommentService from "../service/comment.service";

export default class CommentRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    /**
     * name
     */
    private routes() {
        const commentService = new CommentService();

        /**
        * login
        */
        this.router.post('/', (req: Request, res: Response) => {
            commentService.create(req, res);
        });


        /**
        * login
        */
        this.router.get('/:commentId', (req: Request, res: Response) => {
            commentService.getCommentsById(req, res);
        });
    }
}