import { Express } from 'express'
import extractJWT from './middleware/extractJWT';
import AuthRouter from './router/auth.router';
import ClientRouter from './router/client.router';
import CommentRouter from './router/comment.router';
import UserRouter from './router/user.router';

export default class ServerRoute {
    private static instance: ServerRoute

    private clientRouter: ClientRouter;
    private userRouter: UserRouter;
    private authRouter: AuthRouter;
    private commentRouter: CommentRouter;

    private constructor() {
        this.clientRouter = new ClientRouter();
        this.userRouter = new UserRouter();
        this.authRouter = new AuthRouter();
        this.commentRouter = new CommentRouter();
    }

    public static getInstance(): ServerRoute {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
    public route(expressApp: Express, appVersion?: any): void {
        /**
         * @todo import app config
         * 
         */

        expressApp.use('/client', extractJWT, this.clientRouter.router);
        expressApp.use('/user', extractJWT, this.userRouter.router);
        expressApp.use('/comment', extractJWT, this.commentRouter.router);
        expressApp.use('/auth', this.authRouter.router);
    }
}