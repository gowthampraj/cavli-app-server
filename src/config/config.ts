import dotenv from 'dotenv';

dotenv.config();

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: true
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'superuser';
const MONGO_PASSWORD = process.env.MONGO_USERNAME || 'supersecretpassword1';
const MONGO_HOST = process.env.MONGO_URL || `mongodb://localhost:27017`;

const MONGO = {
    host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    url: `mongodb://localhost:27017`
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 1337;
const SERVER_TOKEN_EXPIRETIME_IN_HR = process.env.SERVER_TOKEN_EXPIRETIME_IN_HR || 8;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || '60847c48867f820398a6e47e';
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || '60847c48867f820398a6e47e11';

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTimeInHr: SERVER_TOKEN_EXPIRETIME_IN_HR,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};

const config = {
    mongo: MONGO,
    server: SERVER
};

export default config;