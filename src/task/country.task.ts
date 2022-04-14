import DbClient = require('../mongoclient');
import { removeId, removePassword } from '../utils/utils';
import bcryptjs from 'bcryptjs';
import { Cursor, ObjectID, ObjectId } from 'mongodb';
import logging from '../config/logging';
// import { UserModel } from '../models/user.model';
import { CountryModel } from '../models/country.model';

const NAMESPACE = 'COUNTRY';
const COLLECTION_NAME_COUNTRY = 'country';
export default class CountryTask {

    private mongoConnection: any;

    constructor() {
        this.mongoConnection = DbClient.getInstance();
    }


    async create(data?: any) {
        /**
        * search for country name
        */
        const country: CountryModel = new CountryModel(data);
        const isUserNameExist = await this.search({ name: country.name }, true);
        return new Promise((resolve, reject) => {
            if (isUserNameExist) {
                reject({ code: "400", msg: "Country already exist" });
                return;
            }
            if (!data || Object.keys(data).length === 0) {
                reject({ msg: 'Body is required' });
                return;
            }

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_COUNTRY).insertOne(
                            { ...country },
                            function (err: any, res: any) {
                                if (res.insertedCount) {
                                    resolve(res.insertedCount)
                                }
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    };

    /**
     * Search 
     * @param fields 
     * @param isBoolenRes search result as boolean
     * @returns 
     */
    public search(fields: any, isBoolenRes?: boolean) {
        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_COUNTRY).find(
                            { name: { $regex: new RegExp("^" + fields.name.toLowerCase(), "i") } },
                            function (err: any, country: Cursor) {
                                country.toArray().then(countryList => {
                                    resolve(isBoolenRes ? countryList?.length > 0 : countryList.map(user => new CountryModel(user)));
                                });
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });
    }

    public getAll(fields?: any) {

        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_COUNTRY).find(
                            {},
                            { sort: { name: 1 } },
                            function (err: any, country: Cursor) {
                                country.toArray().then((countryList: any) => {
                                    resolve(countryList);
                                });
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    public delete(countryId?: any) {

        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_COUNTRY).deleteOne(
                            { _id: new ObjectId(countryId) }, function (err: any, country: any) {
                                if (country.deletedCount) {
                                    resolve({ status: 200, msg: "Deleted" });
                                } else {
                                    reject({ status: 400, msg: "Something went wrong" })
                                }
                            }
                        )
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    public update(data: any) {

        return new Promise((resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject('Body is required');
            }

            let payLoad: CountryModel = new CountryModel(data);

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_COUNTRY).updateOne(
                            { _id: new ObjectID(payLoad._id) },
                            { $set: removeId(JSON.parse(JSON.stringify(payLoad))) },
                            { upsert: false },
                            function (err: any, res: any) {
                                if (res.matchedCount) {
                                    if (res.matchedCount === res.modifiedCount) {
                                        resolve({ status: 200, msg: "Updated" });
                                    } else resolve({ status: 400, msg: "Nothing to update" });
                                } else {
                                    resolve({ status: 404, msg: 'No match found' });
                                }
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

}
