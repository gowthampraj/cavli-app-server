import { Request, Response } from "express";
import { ResponseModel } from "../models/response.model";
import logging from "../config/logging";
const xl = require('excel4node');
import ClientTask from "../task/client.task";
import * as fs from "fs";

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
                    const excel = await this.generateExcel(response.data);
                    excel.write(`Client details ${new Date().toISOString()}.xlsx`, res)
                })
                .catch((err: any) => {
                    const errorData: ResponseModel = {
                        status: 'Fail',
                        code: 500,
                        data: err ?? 'Internal Server error',
                    }
                    console.log(err);

                    logging.warn(NAMESPACE, `ClientService.getAll ${JSON.stringify(err)}`);
                    return res.status(500).json(errorData)
                });
        } catch (error: any) {
            const errorData: ResponseModel = {
                status: 'Fail',
                code: 500,
                data: error ?? 'Internal Server error',
            }
            console.log(error);

            logging.warn(NAMESPACE, `ClientService.getAll ${JSON.stringify(error)}`);
            return res.status(500).json(errorData)
        }


    }

    public async generateExcel(data: any[], SheetName?: string) {
        try {

            console.log(data);

            const colWidth = 10;
            /**
             * Create Excel bugger
             */
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Sheet 1');

            /** I. get config */
            const jsonToExcelMapper: any[] = this._getJSONFile();

            /** II. Generate Excel */
            if (jsonToExcelMapper?.length && data?.length) {

                /** 1. Write Column Title in Excel file */
                this._setHeadingColumnWidth(jsonToExcelMapper, ws, wb, colWidth);

                /** 2. Write Data in Excel file */
                this._mapJsonToExcel(data, jsonToExcelMapper, ws);
            } else {
                /**
                 * @todo handle error
                 */
            }

            /** III. Rerurn work book */
            return wb;

        } catch (error) {
            logging.warn(NAMESPACE, `ClientService.getAll ${JSON.stringify(error)}`);
        }

    }

    private _getJSONFile(): any[] {
        // const file = fs.readFileSync('../../assets/excel-template-mapper.json');
        return [
            { "name": "Created On", "space": 1, "order": 2, "mapper": [{ "key": "createdAt", "action": "DATE" }], "type": "DATE" },
            { "name": "First Name", "space": 1.2, "order": 1, "mapper": [{ "key": "firstName", "action": "STR" }] },
            { "name": "Middle Name", "space": 1.2, "order": 2, "mapper": [{ "key": "middleName", "action": "STR" }] },
            { "name": "Last Name", "space": 1.2, "order": 2, "mapper": [{ "key": "lastName", "action": "STR" }] },
            { "name": "Status", "space": 1.2, "order": 2, "mapper": [{ "key": "status", "action": "STR" }] },
            { "name": "Permanent Address", "space": 3, "order": 2, "mapper": [{ "key": "permanentAddress", "action": "OBJ_ALL" }] },
            { "name": "Contact Number", "space": 2, "order": 2, "mapper": [{ "key": "contactNumber", "action": "ARRAY_COMMA" }] },
            { "name": "Email Id", "space": 2, "order": 2, "mapper": [{ "key": "emailIds", "action": "ARRAY_COMMA" }] },
            { "name": "Gender", "space": 1, "order": 2, "mapper": [{ "key": "gender", "action": "STR" }] },
            // { "name": "Service Provided", "space": 3, "order": 2, "mapper": [{ "key": "serviceInfo.serviceName", "action": "STR" }] }
        ];
    }

    /**
     * _mapJsonToExcel
     * @param data 
     * @param jsonToExcelMapper 
     * @param ws 
     */
    private _mapJsonToExcel(data: any[], jsonToExcelMapper: any[], ws: any) {
        let rowIndex = 2;
        data.forEach((row: { [x: string]: any; }) => {
            let columnIndex = 1;
            jsonToExcelMapper.forEach(column => {
                /** a) Generate Cell Value */
                const data = this._generateCellValue(column.mapper, row);
                /** b) Add value to cell */
                /** c) how the excel looks */
                if (column.type === 'DATE' && data) {
                    ws.cell(rowIndex, columnIndex++).date(new Date(data)).style({ numberFormat: 'dd-mm-yyyy' });;
                } else {
                    ws.cell(rowIndex, columnIndex++).string(data || '');
                }
            });

            rowIndex++;
        });
    }

    /**
     * 
     * @param jsonToExcelMapper 
     * @param ws 
     * @param colWidth 
     */
    private _setHeadingColumnWidth(jsonToExcelMapper: any[], ws: any, wb: any, colWidth: number) {
        const headColStyle = wb.createStyle({
            fill: {
                type: 'pattern',
                fgColor: '#274db1',
                patternType: 'solid',
            },
            font: {
                bold: true,
                color: '#ffffff',
            },
        });
        let headingColumnIndex = 1;
        jsonToExcelMapper.forEach((heading, index) => {
            /** set header */
            ws.cell(1, headingColumnIndex++)
                .string(heading.name)
                .style(headColStyle);
            // .style({ font: { color: '#FFF' } });
            ws.column(index + 1).setWidth(colWidth * heading.space);
        });
    }

    /**
     * 
     * @param mapper 
     * @param row 
     * @returns 
     */
    private _generateCellValue(mapper: any, row: any) {
        let data = '';

        mapper.forEach((mapperObj: any) => {
            switch (mapperObj?.action) {
                case 'STR':
                    data += `${row?.[mapperObj?.key] || ''} `;
                    break;
                case 'ARRAY_COMMA':
                    data += row?.[mapperObj?.key]?.join(', ') || '';
                    break;
                case 'ARRAY':
                    data += row?.[mapperObj?.key]?.join(' ') || '';
                    break;
                case 'OBJ_ALL':
                    Object.keys(row?.[mapperObj?.key])
                        .forEach((val: any) => {
                            const field = row[mapperObj.key]?.[val];
                            data += field ? `${field} ` : '';
                        });
                    break;
                case 'DATE':
                    data = row?.[mapperObj?.key] || null;
                    break;
            }
        })

        return data;
    }

    private _getPropByString(obj: any, propString: string) {
        if (!propString)
            return obj;

        var prop, props = propString.split('.');

        for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
            prop = props[i];

            var candidate = obj[prop];
            if (candidate !== undefined) {
                obj = candidate;
            } else {
                break;
            }
        }
        return obj[props[i]];
    }
}