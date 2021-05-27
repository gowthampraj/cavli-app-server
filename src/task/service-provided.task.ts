import DbClient = require('../mongoclient');
import { Cursor, ObjectID, ObjectId } from 'mongodb';
import logging from '../config/logging';
import { UniversityModel } from '../models/university.model';
import { ServiceProvided } from '../models/service-provided.model';
import { removeId } from '../utils/utils';

const NAMESPACE = 'SERVICE_PROVIDED';
const COLLECTION_NAME_SERVICE_PROVIDED = 'service-provided';
export default class ServiceProvidedTask {

    private mongoConnection: any;

    constructor() {
        this.mongoConnection = DbClient.getInstance();
    }


    async create(data?: any) {
        /**
        * search for service name
        */
        const serviceProvided: ServiceProvided = new ServiceProvided(data);
        return new Promise(async (resolve, reject) => {
            if (!data || Object.keys(data).length === 0) {
                reject({ msg: 'Body is required' });
                return;
            }

            const isUserNameExist = await this.search({ serviceName: serviceProvided.serviceName }, true);

            if (isUserNameExist) {
                reject({ code: "400", msg: `${serviceProvided.serviceName} already exist` });
                return;
            }


            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_SERVICE_PROVIDED).insertOne(
                            { ...serviceProvided },
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
    public search(fields: ServiceProvided, isBoolenRes?: boolean) {
        return new Promise((resolve, reject) => {
            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_SERVICE_PROVIDED).find(
                            {
                                serviceName: { $regex: new RegExp("^" + fields.serviceName.toLowerCase(), "i") }
                            },
                            function (err: any, serviceList: Cursor) {
                                serviceList.toArray().then(serviceListA => {
                                    resolve(isBoolenRes ? serviceListA?.length > 0 : serviceListA.map(user => new UniversityModel(user)));
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
                        connection.collection(COLLECTION_NAME_SERVICE_PROVIDED).find({},
                            function (err: any, country: Cursor) {
                                country.toArray().then((universityList: any) => {
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
                        connection.collection(COLLECTION_NAME_SERVICE_PROVIDED).deleteOne(
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

            let payLoad: ServiceProvided = new ServiceProvided(data);

            this.mongoConnection.connect()
                .then((connection: any) => {
                    try {
                        connection.collection(COLLECTION_NAME_SERVICE_PROVIDED).updateOne(
                            { _id: new ObjectID(payLoad._id) },
                            { $set: removeId(JSON.parse(JSON.stringify(payLoad))) },
                            { upsert: true }
                            ,
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
