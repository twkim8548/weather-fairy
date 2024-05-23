import axios from 'axios';
export const useApi = (method: string, route: string, query?: any, body?: any, headers?: any) => {
    return new Promise((resolve) => {
        axios.request({
            method: method,
            url: route,
            data: body,
            params: query,
            headers: headers
        }).then(res => {
            return resolve(res);
        });
    });
};

