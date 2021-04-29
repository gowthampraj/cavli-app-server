import mongoose from "mongoose";
import AppConstant from "./constants";
class DbClient {

    constructor() {

    }
    public connect() {
        const dbName = 'lodestareduinternational'
        return new Promise((resolve, reject) => {
            mongoose.connect(
                `${AppConstant.mongoUrl}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true }
            )
                .then(() => {
                    resolve(mongoose.connection);
                })
                .catch(err => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });
    }
}

export = new DbClient();