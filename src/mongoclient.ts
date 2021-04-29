import mongoose from "mongoose";
import AppConstant from "./constants";
class DbClient {
    private static instance: DbClient;

    private mongooseConnection: any;
    
    constructor() {
        this.mongooseConnection = mongoose.connect(
            `${AppConstant.MONGO_URL}/${AppConstant.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true }
        );
    }
    public connect() {
        return new Promise((resolve, reject) => {
            this.mongooseConnection.then(() => {
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