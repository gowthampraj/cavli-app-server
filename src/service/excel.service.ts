import { Request, Response } from "express";
import { ResponseModel } from "../models/response.model";
import logging from "../config/logging";
const xl = require('excel4node');
import ClientTask from "../task/client.task";

const NAMESPACE = 'EXCEL';

export default class ExcelService {
    private clientTask: ClientTask;
    constructor() {
        this.clientTask = new ClientTask();
    }

    public exportPDF(req: Request, res: Response) {
        try {
            this.clientTask.getAll(req.query)
                .then(async (response: any) => {
                    try {
                        const excelBuffer = await this.generateExcel(response.data);
                        res.write(excelBuffer, 'binary');
                        return res.end(null, 'binary');

                    } catch (error) {
                        console.log('xxxxxx', error);

                    }
                })
                .catch((err: any) => {
                    const errorData: ResponseModel = {
                        status: 'Fail',
                        code: 500,
                        data: err ?? 'Internal Server error',
                    }
                    logging.warn(NAMESPACE, `ClientService.getAll ${JSON.stringify(err)}`);
                    return res.status(500).json(errorData)
                });
        } catch (error) {

        }


    }

    public async generateExcel(datas: any[]) {
        try {


            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Worksheet Name');
            const data = [
                {
                    "name": "Shadab Shaikh",
                    "email": "shadab@gmail.com",
                    "mobile": "1234567890"
                }
            ]
            const headingColumnNames = [
                "Name",
                "Email",
                "Mobile",
            ]
            //Write Column Title in Excel file
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            //Write Data in Excel file
            let rowIndex = 2;
            data.forEach((record: { [x: string]: any; }) => {
                let columnIndex = 1;
                Object.keys(record).forEach(columnName => {
                    ws.cell(rowIndex, columnIndex++)
                        .string(record[columnName])
                });
                rowIndex++;
            });
            // wb.write('data.xlsx');
            const x = await wb.writeToBuffer('data.xlsx');
            return x
        } catch (error) {
            console.log('yyyyyyyyyyyy', error);

            // logging.warn(NAMESPACE, `ClientService.getAll ${JSON.stringify(error)}`);

        }

    }
}