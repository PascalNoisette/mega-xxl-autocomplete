import Bot from 'nodemw';
import { NextApiRequest, NextApiResponse } from 'next';
import { Engine } from '../engine';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

if (typeof fs.existsSync == 'undefined') {
    fs.existsSync = () => {
        // emulate function on web
    };
}
/**
 * Endpoint to make a query search one a mediawiki with a nodemw bot
 * Example of config :
 * - endpoint http://wiki/
 * - fieldname : title
 * - credential : <generate a token for bot such as username@Bot>
 * - url to concat https://wiki.netpascal.site/index.php?curid=
 * - result to concat : 'pageid'
 */
export default class Mediawiki implements Engine {
    service: { url: string; credentials: string };

    mediawikibot;

    constructor(service: { url: string; credentials: string }) {
        this.service = service;
    }

    request(clitentReq: NextApiRequest, clientRes: NextApiResponse): Promise<any> {
        return new Promise((resolve, turnDown) => {
            try {
                this.loginRequest(() =>
                    this.searchRequest(clitentReq, clientRes, resolve)
                );
            } catch (err) {
                let status = 500;
                if (err.response) {
                    status = err.response.status;
                }
                clientRes.status(status).send(err.toString());
                turnDown(err);
            }
        });
    }

    loginRequest(callback: () => void): void {
        if (this.mediawikibot != null) {
            return callback();
        }
        const service = this.service;
        const conf: any = {
            protocol: 'https', // default to 'http'
            server: service.url.split('://')[1], // host name of MediaWiki-powered site
            path: '', // path to api.php script
            debug: true, // is more verbose when set to true
            userAgent: 'MegaXXlAutocomplete', // define custom bot's user agent
            concurrency: 3 // how many API requests can be run in parallel (defaults to 3)
        };
        if (service.credentials) {
            conf.username = service.credentials.split(':')[0]; // account to be used when logIn is called (optional)
            conf.password = service.credentials.split(':')[1]; // password to be used when logIn is called (optional)
        }
        this.mediawikibot = new Bot(conf);
        if (service.credentials) {
            this.mediawikibot.logIn(function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                callback();
            });
        } else {
            callback();
        }
    }

    searchRequest(
        clitentReq: NextApiRequest,
        clientRes: NextApiResponse,
        callback: (status: boolean) => void
    ): void {
        const keyword = JSON.parse(clitentReq.body.split('\n')[1]).query.bool.must[0].bool
            .must.bool.should[0].multi_match.query;

        this.mediawikibot.api.call(
            {
                action: 'query',
                list: 'search',
                srwhat: 'text',
                srsearch: keyword
            },
            (err, results) => {
                if (err) {
                    clientRes.send(err);
                    return callback(true);
                }
                clientRes.send({
                    responses: [
                        {
                            hits: {
                                total: { value: results.searchinfo.totalhits },
                                hits: results.search.map((x) => {
                                    x._source = Object.assign({}, x);
                                    return x;
                                })
                            }
                        }
                    ]
                });
                return callback(true);
            }
        );
    }
}
