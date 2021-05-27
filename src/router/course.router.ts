import { Request, Router, Response } from "express";
import CourseService from "../service/course.service";

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
        const courseService = new CourseService();

        /**
         * create
         */
        this.router.post('/', (req: Request, res: Response) => {
            courseService.create(req, res);
        });

        /**
         * get all course course
         */
        this.router.get('/', (req: Request, res: Response) => {
            courseService.getAll(req, res);
        });

        /**
        * delete
        */
        this.router.delete('/:courseId', (req: Request, res: Response) => {
            courseService.delete(req, res);
        });

        /**
         * Update
         */
        this.router.put('/', (req: Request, res: Response) => {
            courseService.update(req, res);
        });
    }
}