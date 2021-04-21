import { discover } from 'opensearch-browser';
import { NextApiRequest, NextApiResponse } from 'next';
import { Engine } from '../engine';
import { DOMParser } from 'xmldom';
export default class Opensearch implements Engine {
    service: { url: string; credentials: string; app: string };
    opensearch: any = null;

    constructor(service: { url: string; credentials: string; app: string }) {
        this.service = service;
    }

    async request(clitentReq: NextApiRequest, clientRes: NextApiResponse): Promise<any> {
        const service = this.service;
        const keyword = JSON.parse(clitentReq.body.split('\n')[1]).query.bool.must[0].bool
            .must.bool.should[0].multi_match.query;

        if (!this.opensearch) {
            global.DOMParser = DOMParser;
            this.opensearch = await discover(service.url);
        }
        const results = await this.opensearch
            .getSuggestions({ searchTerms: keyword })
            .then(function (suggestions) {
                return suggestions;
            })
            .catch((e) => {
                console.log(e.message);
                return [];
            });

        try {
            results.unshift({
                completion: '¤ Search on ' + this.service.app,
                ...this.opensearch.createSearchRequest(
                    {
                        searchTerms: keyword
                    },
                    'text/html'
                )
            });
        } catch (e) {
            console.log(e.message);
        }

        return clientRes.send({
            responses: [
                {
                    hits: {
                        total: { value: results.length },
                        hits: results.map((x) => {
                            x._source = Object.assign({}, x);
                            return x;
                        })
                    }
                }
            ]
        });
    }
}
