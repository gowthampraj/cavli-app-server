import { Express } from 'express'
import extractJWT from './middleware/extractJWT';
import AuthRouter from './router/auth.router';
import ClientRouter from './router/client.router';
import CommentRouter from './router/comment.router';
import CountryRouter from './router/country.router';
import UniversityRouter from './router/university.router';
import UserRouter from './router/user.router';
import CourseRouter from './router/course.router';
import ServiceProvidedRouter from './router/service-provided.router';
import ClientServiceInfoRouter from './router/client-service-info.router';
import ClientProfileRouter from './router/client-profile.router';

export default class ServerRoute {
    private static instance: ServerRoute

    private static BASE = '/api/'

    private clientRouter: ClientRouter;
    private clientServiceInfoRouter: ClientServiceInfoRouter;
    private clientProfileRouter: ClientProfileRouter;
    private userRouter: UserRouter;
    private authRouter: AuthRouter;
    private commentRouter: CommentRouter;
    private countryRouter: CountryRouter;
    private universityRouter: UniversityRouter;
    private courseRouter: CourseRouter;
    private serviceRouter: ServiceProvidedRouter;

    private constructor() {
        this.clientRouter = new ClientRouter();
        this.clientServiceInfoRouter = new ClientServiceInfoRouter();
        this.clientProfileRouter = new ClientProfileRouter();
        this.userRouter = new UserRouter();
        this.authRouter = new AuthRouter();
        this.commentRouter = new CommentRouter();
        this.countryRouter = new CountryRouter();
        this.universityRouter = new UniversityRouter();
        this.courseRouter = new CourseRouter();
        this.serviceRouter = new ServiceProvidedRouter();
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
         */


        /**
         * Login
         */
        expressApp.use(ServerRoute.BASE + '/auth', this.authRouter.router);
        expressApp.use(ServerRoute.BASE + '/user', extractJWT, this.userRouter.router);

        /**
         * Manage data
         */
        expressApp.use(ServerRoute.BASE + '/client', extractJWT, this.clientRouter.router);
        expressApp.use(ServerRoute.BASE + '/client-service-info', extractJWT, this.clientServiceInfoRouter.router);
        expressApp.use(ServerRoute.BASE + '/client-profile', extractJWT, this.clientProfileRouter.router);
        expressApp.use(ServerRoute.BASE + '/comment', extractJWT, this.commentRouter.router);

        /**
         * Config / Helper 
         */
        expressApp.use(ServerRoute.BASE + '/country', extractJWT, this.countryRouter.router);
        expressApp.use(ServerRoute.BASE + '/university', extractJWT, this.universityRouter.router);
        expressApp.use(ServerRoute.BASE + '/course', extractJWT, this.courseRouter.router);
        expressApp.use(ServerRoute.BASE + '/service-provided', extractJWT, this.serviceRouter.router);
    }
}