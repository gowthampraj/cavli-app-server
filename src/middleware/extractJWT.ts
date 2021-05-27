import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';
import UserTask from '../task/user.task';
import { Cursor, ObjectID, ObjectId } from 'mongodb';


const NAMESPACE = 'AUTH';

const extractJWT = async (req: Request, res: Response, next: NextFunction) => {
    let userTask: UserTask = new UserTask();

    const token = req.headers.authorization;
    const userId = req.headers.userid;

    logging.info(NAMESPACE, `Validating token of user [${userId}]`);
    
    const isValid = userId ? ObjectID.isValid(userId.toString()) : false;

    if (!userId || !isValid) {
        return res.status(401).json({
            message: 'Invalid user'
        });
    }
    /**
     * get user from db
     */
    const user: any = await userTask.getById(userId);
    if (!user?.isActive) {
        return res.status(401).json({
            message: 'User is not active please contact admin'
        });
    }
    if (!user?.permission?.login) {
        return res.status(401).json({
            message: 'User is invalid'
        });
    }
    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
                return res.status(404).json({
                    message: error,
                    error
                });
            } else {
                res.locals.jwt = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

export default extractJWT;