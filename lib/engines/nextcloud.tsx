import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { Engine } from '../engine';
/**
 * Endpoint to make a search on a nextcloud search file provider
 * Example of config :
 * - endpoint https://nextcloud/
 * - fieldname : title
 * - credential : <generate a token for integration such as username:SECRET>
 * - result to concat : 'resourceUrl'
 */
export default class Nextcloud implements Engine {
    service: { url: string; credentials: string };

    constructor(service: { url: string; credentials: string }) {
        this.service = service;
    }

    request(clitentReq: NextApiRequest, clientRes: NextApiResponse): Promise<any> {
        const service = this.service;
        const keyword = JSON.parse(clitentReq.body.split('\n')[1]).query.bool.must[0].bool
            .must.bool.should[0].multi_match.query;
        const provider = 'search/providers/files/search';
        const from = 'megaxxlautocomplete';
        return axios({
            url: `${service.url}ocs/v2.php/${provider}?term=${keyword}&from=${from}`,
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            auth: {
                username: service.credentials.split(':')[0],
                password: service.credentials.split(':')[1]
            }
        })
            .then(({ data: { ocs: ocs } }) => {
                if (ocs.meta.status != 'ok') {
                    return clientRes.status(ocs.meta.statuscode).send(ocs.meta.message);
                }
                clientRes.send({
                    responses: [
                        {
                            hits: {
                                total: { value: ocs.data.entries.length },
                                hits: ocs.data.entries.map((element) => {
                                    element.title =
                                        '<div class="suggest-legend">' +
                                        //element.subline +
                                        '</div>' +
                                        element.title;
                                    element._source = Object.assign({}, element);
                                    return element;
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
