import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';
import UserTask from '../task/user.task';
import { ObjectID } from 'mongodb';
import { UserModel } from '../models/user.model';


const NAMESPACE = 'AUTH';

const extractJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
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

        /**
         * Relogin needed
         */
        if (user?.loginNeeded) {
            return res.status(401).json({
                message: 'Re login needed'
            });
        }

        /**
         * Check isActive
         */
        if (!user?.isActive) {
            return res.status(401).json({
                message: 'User is not active please contact admin'
            });
        }

        /**
         * Check login permission
         */
        if (!user?.permission?.login) {
            return res.status(401).json({
                message: 'User is invalid'
            });
        }

        /**
         * Permission from req.body.action
         */
        const hasPermission = manageUserPermissions(user, req);
        if (!hasPermission) {
            return res.status(403).json({
                message: 'User has no permission'
            });
        }

        /**
         * Validated token 
         */
        if (token) {
            jwt.verify(token, config.server.token.secret, (error, decoded) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Re login needed'
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
    } catch (error) {
        logging.info(NAMESPACE, `Validating token of user [${error}]`);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

function manageUserPermissions(user: UserModel, req: Request): boolean {
    const action: string = req.body?.action;
    let hasPermission = false;
    switch (action) {
        case 'CLIENT_STATUS_CHANGE':
            hasPermission = checkPermission(user, PermissionObj.CHANGE_CLIENT_STATUS)
            break;

        default:
            hasPermission = true;
            break;
    }
    return hasPermission;
}

function checkPermission(user: UserModel, type: PermissionObj): boolean {
    /** If user is ADMIN or has permission */
    return user.username === 'admin' || !!user.permission?.[type];
}
// export 

export enum PermissionObj {
    CHANGE_CLIENT_STATUS = 'changeStatus',
    EDIT_SERVICE_AMT = 'serviceAmount',
    LOGIN = 'login',
    MANAGE_USER = 'manage',
    EXTRA_DATA = 'extra',
    COMPANY = 'company',
    SERVICE_PROVIDED = 'service',
    COURSE = 'course',
    COUNTRY = 'country',
    UNIVERSITY = 'university',
    EXPORT_EXCEL = 'exportExcel',
    SEARCH_COURSE = 'searchCourse'
}

export default extractJWT;