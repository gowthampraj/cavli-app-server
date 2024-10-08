import mongoose from "mongoose";
import AppConstant from "./constants";
import logging from "./config/logging";
const NAMESPACE = 'MONGO'
class DbClient {
    /**
     * https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#find
     */
    private static instance: DbClient;

    private mongooseConnection: any;

    constructor() {
        try {
            this.mongooseConnection = mongoose.connect(
                `${AppConstant.MONGO_URL}/${AppConstant.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true }
            );
            logging.info(NAMESPACE, 'Server is listening on port');
        } catch (e) {
            console.log(`DB connection error ${e}`);
        }
    }
    public connect() {
        return new Promise((resolve, reject) => {
            this.mongooseConnection.then(() => {
                // mongoose.connection.collection("x").find({},).l
                resolve(mongoose.connection);
            })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });
    }

    public getInstance(): DbClient {
        if (!DbClient.instance) {
            DbClient.instance = new DbClient();
        }
        return DbClient.instance;
    }
}

export = new DbClient();
