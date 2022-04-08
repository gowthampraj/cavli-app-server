export function removeId(data: any) {
    delete data['_id'];
    return data;
}

export function removePassword(data: any) {
    delete data['password'];
    return data;
}

export function promiseToAllSettlePolyfill(promiseArray: Promise<any>[]) {
    return Promise.all(
        promiseArray.map(
            p => p
                .then(value => ({ status: UtilsConst.FULLFILLLED, value }))
                .catch(error => ({ status: UtilsConst.REJECTED, error }))
        )
    )
}

export function extractDataFromPromiseToAllSettlePolyfill(data: { [key: string]: any }) {
    let extractedData: any;
    const status = data?.status;
    if (status === UtilsConst.FULLFILLLED) {
        extractedData = data.value;
    } else if (status === UtilsConst.REJECTED) {
        extractedData = null;
    }
    return extractedData;
}

export class UtilsConst {
    static FULLFILLLED = "fulfilled";
    static REJECTED = "rejected"
}