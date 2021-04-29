import express from 'express';
import bodyParser from 'body-parser';

import { Request, Response } from 'express';
import ServerRoute from './server-route';

import mongoose from "mongoose";
import config from './config/config';
import logging from './config/logging';

const NAMESPACE = ' INDEX '
class Server {

    public expressApp = express();

    public documentProperties: any;
    public router = express.Router();
    constructor() {
        this.config();
        this.routes();
    }

    public config(): void {
        /** Parse the body of the request */
        this.expressApp.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));
        this.expressApp.use(bodyParser.json({ limit: '50mb' }));
        /** Rules of our API */
        this.expressApp.use((request: Request, response: Response, next) => {
            response.header('Access-Control-Allow-Origin', '*');
            response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            /**
             * Handle options
             */
            if (request.method == 'OPTIONS') {
                response.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, OPTIONS');
                return response.status(200).json({});
            }
            next();
        });
    }

    public routes(): void {

        // const config = {
        //     appVersion: "0.0.0"
        // }


        // /** Connect to Mongo */
        // mongoose
        //     .connect(config.mongo.url, config.mongo.options)
        //     .then((result) => {
        //         logging.info(NAMESPACE, 'Mongo Connected');
        //     })
        //     .catch((error) => {
        //         logging.error(NAMESPACE, error.message, error);
        //     });

        /**
         * Routes and Services
         */

        ServerRoute.getInstance().route(this.expressApp)

        this.expressApp.use(this.router);

        /** Error handling */
        this.expressApp.use((req, res, next) => {
            const error = new Error('Not found');

            res.status(404).json({
                message: error.message
            });
        });
    }
}

export default new Server().expressApp;