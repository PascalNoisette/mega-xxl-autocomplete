import { fromXml } from 'opensearch-browser';
import { NextApiRequest, NextApiResponse } from 'next';
import { Engine } from '../engine';
import { DOMParser } from 'xmldom';
import fs from 'fs';
export default class Opensearch implements Engine {
    service: { url: string; credentials: string; logo_alt: string; opensearch: string };
    opensearch: any = null;

    constructor(service: {
        url: string;
        credentials: string;
        logo_alt: string;
        opensearch: string;
    }) {
        this.service = service;
    }

    async request(clitentReq: NextApiRequest, clientRes: NextApiResponse): Promise<any> {
        const service = this.service;
        const keyword = JSON.parse(clitentReq.body.split('\n')[1]).query.bool.must[0].bool
            .must.bool.should[0].multi_match.query;

        if (!this.opensearch) {
            global.DOMParser = DOMParser;
            const cacheDir = '/data/cache/';
            const filename = process.cwd() + cacheDir + service.opensearch;
            const xml = fs.readFileSync(filename, 'utf8');
            this.opensearch = fromXml(xml);
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
                completion: '¤ Search on ' + this.service.logo_alt,
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
