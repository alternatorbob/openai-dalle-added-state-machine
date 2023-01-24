FormData.prototype.getHeaders = () => {
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    return headers;
};
