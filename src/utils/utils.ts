export function removeId(data: any) {
    delete data['_id'];
    return data;
}

export function removePassword(data: any) {
    delete data['password'];
    return data;
}