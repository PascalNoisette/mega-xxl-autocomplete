import axios from 'axios';
import https from 'https';
import { NextApiRequest, NextApiResponse } from 'next';
import { Engine } from '../engine';
/**
 * Endpoint to pipe request to a elasticsearch engine
 * Example of config :
 * - endpoint https://elasticsearch:9200/notes/
 * - fieldname : Title
 * - credential : <login:basicPassword>
 * - url to concat https://leanote.netpascal.site/note/
 * - result to concat : '_id'
 */
export default class Es implements Engine {
    service: { url: string; credentials: string };

    constructor(service: { url: string; credentials: string }) {
        this.service = service;
    }

    request(clitentReq: NextApiRequest, clientRes: NextApiResponse): Promise<any> {
        const service = this.service;
        delete clitentReq.headers.authorization;
        delete clitentReq.headers.cookie;
        return axios({
            auth: {
                username: service.credentials.split(':')[0],
                password: service.credentials.split(':')[1]
            },
            headers: clitentReq.headers,
            method: 'POST',
            url: service.url + clitentReq.url.replace(/\/api\/search\/\d+\//, ''),
            responseType: 'stream',
            data: clitentReq.body,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
            .then((backendRes) => {
                console.log(backendRes);
                backendRes.data.pipe(clientRes);
            })
            .catch((err) => {
                console.log(err);
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
