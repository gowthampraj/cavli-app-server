import DbClient = require('../mongoclient');
import { Cursor, ObjectID, ObjectId } from 'mongodb';
import logging from '../config/logging';
import { UniversityModel } from '../models/university.model';
import { removeId } from '../utils/utils';

const NAMESPACE = 'UNIVERSITY';
const COLLECTION_NAME_UNIVERSITY = 'university';
export default class UniversityTask {

    private mongoConnection: any;

    constructor() {
        this.mongoConnection = DbClient.getInstance();
    }


    async create(data?: any) {
        /**
        * search for university name
        */
        const university: UniversityModel = new UniversityModel(data);
        return new Promise(async (resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject({ msg: 'Body is required' });
                return;
            }

            const isUserNameExist = await this.search({ name: university.name, country: university.country }, true);

            if (isUserNameExist) {
                reject({ code: "400", msg: `${university.name} already exist in ${university.country}` });
                return;
            }


            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_UNIVERSITY).insertOne(
                            { ...university },
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
    public search(fields: UniversityModel, isBoolenRes?: boolean) {
        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_UNIVERSITY).find(
                            {
                                name: { $regex: new RegExp("^" + fields.name.toLowerCase(), "i") }
                            },
                            function (err: any, country: Cursor) {
                                country.toArray().then(countryList => {
                                    resolve(isBoolenRes ? countryList?.length > 0 : countryList.map(user => new UniversityModel(user)));
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
                        connection.collection(COLLECTION_NAME_UNIVERSITY).find(
                            {},
                            { sort: { name: 1 } },
                            function (err: any, university: Cursor) {
                                university.toArray().then((universityList: any) => {
                                    resolve(universityList);
                                });
                            });
                    } catch (error) {
                        logging.info(NAMESPACE, `Unable to connect to db :`, JSON.stringify(error));
                    }
                })
                .catch((err: any) => reject(`DB connection Error : ${JSON.stringify(err)}`));
        });

    }

    public delete(universityId?: any) {

        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_UNIVERSITY).deleteOne(
                            { _id: new ObjectId(universityId) }, function (err: any, country: any) {

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

            let payLoad: UniversityModel = new UniversityModel(data);

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_UNIVERSITY).updateOne(
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
