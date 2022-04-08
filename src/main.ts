// import http = require('http');
import logging from './config/logging';
import expressApp from './index'
import http from 'http';
import { PasswordGenerator } from './middleware/password-generater';
import { Scheduler } from './scheduler';
const app_port = 4000;
let server: any = {}
const NAMESPACE = 'SERVER'
server = http.createServer(expressApp);
server.listen(app_port, function () {
    logging.info(NAMESPACE, 'Server is listening on port', app_port);
    // new Scheduler().execute();
    server.on('error', () => {
        logging.info(NAMESPACE, 'ERROR ON', app_port);
    });
    server.on('listening', () => {
        logging.info(NAMESPACE, 'Server is listening on port', app_port);        
    });
});

// async function passwordGenerator() {
//     const x = await new PasswordGenerator("123")
//     console.log(await x.generate());

//     console.log(await
//         x.compare('$2a$04$o4Y8OtDYDrWwZIh59KFdROsvkxCSz2mfE73mC9GV9qLe7cXOnhxre')
//     );

// }
// passwordGenerator();