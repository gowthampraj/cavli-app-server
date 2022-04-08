const schedule = require('node-schedule');
import logging from "./config/logging";
const NAMESPACE = 'SCHEDULER';

export class Scheduler {

    execute() {
        schedule.scheduleJob(SchedulerConstant.EVERY_x_AM, function () {
            logging.info(NAMESPACE, 'Job', new Date());
        });
    }
}

export class SchedulerConstant {
    static EVERY_SEC = '* * * ? * *';
    static EVERY_6_AM = '0 0 6 * * ?';
    static EVERY_x_AM = '0 36 13 * * ?';
}