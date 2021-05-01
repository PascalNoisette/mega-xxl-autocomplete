import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
/**
 * Endpoint to make a search grok instance
 * Example of config :
 * - endpoint http://grok:8180/api/v1/search?field=full&defs=&refs=&path=&hist=&type=&maxresults=10&full=
 * - fieldname : title
 * - url to concat https://gitea/
 * - result to concat : 'file'
 */
export default class Opengrok {
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
                encodeURI('"' + keyword.replace(/[":+-]/g, (m) => '\\' + m) + '"'),
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
                                total: { value: results.data.resultCount },
                                hits: Object.keys(results.data.results).reduce(
                                    (hits, file) => {
                                        results.data.results[file].forEach((element) => {
                                            element.file =
                                                file + '#L' + element.lineNumber;
                                            element.title =
                                                '<div class="suggest-legend">' +
                                                file
                                                    .split('/')
                                                    .filter((x) => x)
                                                    .splice(0, 2)
                                                    .join('/') +
                                                '</div>' +
                                                element.line;
                                            element._source = Object.assign({}, element);
                                            hits.push(element);
                                        });
                                        return hits;
                                    },
                                    []
                                )
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
