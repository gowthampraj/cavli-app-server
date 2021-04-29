// import http = require('http');
import logging from './config/logging';
import expressApp from './index'
import http from 'http';
const app_port = 3002;
let server: any = {}
const NAMESPACE = 'SERVER'
server = http.createServer(expressApp);
server.listen(app_port, function () {
    logging.info(NAMESPACE, 'Server is listening on port', app_port);
    server.on('error', () => {
        logging.info(NAMESPACE, 'ERROR ON', app_port);
    });
    server.on('listening', () => {
        logging.info(NAMESPACE, 'Server is listening on port', app_port);
    });
});