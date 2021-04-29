export interface ResponseModel {
    status: string,
    code: number,
    data?: any[] | {} | string,
    length?: number,
    token?: string;
    message?: string;
}