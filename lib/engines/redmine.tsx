import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { Engine } from '../engine';
/**
 * Endpoint to make a query search one a mediawiki with a nodemw bot
 * Example of config :
 * - endpoint http://redmine/
 * - fieldname : title
 * - credential : <your api token>
 * - result to concat : 'url'
 */
export default class Redmine implements Engine {
    service: { url: string; credentials: string };

    constructor(service: { url: string; credentials: string }) {
        this.service = service;
    }

    request(clitentReq: NextApiRequest, clientRes: NextApiResponse): Promise<any> {
        const service = this.service;
        const keyword = JSON.parse(clitentReq.body.split('\n')[1]).query.bool.must[0].bool
            .must.bool.should[0].multi_match.query;

        return axios({
            url:
                service.url +
                '/search.json?key=' +
                service.credentials +
                '&q=' +
                encodeURI(keyword),
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then((results) => {
                clientRes.send({
                    responses: [
                        {
                            hits: {
                                total: { value: results.data.results.length },
                                hits: results.data.results.map((x) => {
                                    x.title =
                                        '#' +
                                        x.id +
                                        ' ' +
                                        x.title.substring(x.title.indexOf(':') + 1);
                                    x._source = Object.assign({}, x);
                                    return x;
                                })
                            }
                        }
                    ]
                });
            })
            .catch((err) => {
                let status = 500;
                if (err.response) {
                    status = err.response.status;
                }
                clientRes.status(status).send(err.toString());
            });
    }
}
