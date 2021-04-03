import axios from 'axios';
import https from 'https';
import { NextApiRequest, NextApiResponse } from 'next';
import { Engine } from '../engine';

export default class Es implements Engine {
    service: { url: string; credentials: string };

    constructor(service: { url: string; credentials: string }) {
        this.service = service;
    }

    request(clitentReq: NextApiRequest, clientRes: NextApiResponse): Promise<any> {
        const service = this.service;
        delete clitentReq.headers.authorization;
        return axios({
            auth: {
                username: service.credentials.split(':')[0],
                password: service.credentials.split(':')[1]
            },
            headers: clitentReq.headers,
            method: 'POST',
            url: service.url + clitentReq.url.replace('/api/search/', '/'),
            responseType: 'stream',
            data: clitentReq.body,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
            .then((backendRes) => {
                backendRes.data.pipe(clientRes);
            })
            .catch((err) => {
                let code = 500;
                let message = err.errno;
                if (typeof err.response != 'undefined') {
                    code = err.response.status;
                    message = err.response.statusText;
                }
                clientRes.status(code).send(message);
            });
    }
}
