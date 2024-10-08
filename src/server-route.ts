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
import CompanyRouter from './router/company.router';
import ExportRouter from './router/export.router';
import ExtraRouter from './router/extra.router';
import NotificationRouter from './router/notification.router';
import FollowUpRouter from './router/follow-up.router';
import invoiceRouter from './router/invoice.router'
export default class ServerRoute {
    private static instance: ServerRoute

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
    private companyRouter: CompanyRouter;
    private exportRouter: ExportRouter;
    private extraRouter: ExtraRouter;
    private notificationRouter: NotificationRouter;
    private followUpRouter: FollowUpRouter;
    private invoiceRouter : invoiceRouter;
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
        this.companyRouter = new CompanyRouter();
        this.exportRouter = new ExportRouter();
        this.extraRouter = new ExtraRouter();
        this.notificationRouter = new NotificationRouter();
        this.followUpRouter = new FollowUpRouter();
        this.invoiceRouter = new invoiceRouter();
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
        expressApp.use('/auth', this.authRouter.router);
        expressApp.use('/user', extractJWT, this.userRouter.router);

        /**
         * Manage data
         */
        expressApp.use('/client', extractJWT, this.clientRouter.router);
        expressApp.use('/client-service-info', extractJWT, this.clientServiceInfoRouter.router);
        expressApp.use('/client-profile', extractJWT, this.clientProfileRouter.router);
        expressApp.use('/comment', extractJWT, this.commentRouter.router);
        expressApp.use('/notification', extractJWT, this.notificationRouter.router);
        expressApp.use('/follow-up', extractJWT, this.followUpRouter.router);

        /**
         * Config / Helper 
         */
        expressApp.use('/country', extractJWT, this.countryRouter.router);
        expressApp.use('/university', extractJWT, this.universityRouter.router);
        expressApp.use('/course', extractJWT, this.courseRouter.router);
        expressApp.use('/service-provided', extractJWT, this.serviceRouter.router);
        expressApp.use('/company', extractJWT, this.companyRouter.router);
        expressApp.use('/extra', extractJWT, this.extraRouter.router);

        /**
         * Import / Export
         */
        expressApp.use('/export', this.exportRouter.router);

        /**
         * Invoice
         */

        expressApp.use('/invoice', this.invoiceRouter.router);
    }
}