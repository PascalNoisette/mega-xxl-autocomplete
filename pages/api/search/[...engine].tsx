// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import FileDataStore from '../../../lib/cypher-datastore';
import basicAuth from '../../../lib/middleware/basic-auth';

const myDB = new FileDataStore(process.cwd() + '/data');
const Engines = {};
const AppData = {};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<boolean> => {
    return await basicAuth(myDB)(req, res, async function () {
        const requestedService = req.query.engine[0];
        const user = req.headers.authorization || '';
        if (typeof AppData[user] == 'undefined') {
            AppData[user] = {};
        }
        if (typeof AppData[user][requestedService] == 'undefined') {
            await new Promise(function (resolve, reject) {
                myDB.getCollection(
                    '/api/swagger/services',
                    function callback(err, services) {
                        if (err) {
                            reject(err);
                        }
                        services.map((x) => {
                            if (typeof Engines[x.data.engine] == 'undefined') {
                                // eslint-disable-next-line  @typescript-eslint/no-var-requires
                                Engines[x.data.engine] = require('../../../lib/engines/' +
                                    x.data.engine +
                                    '.tsx').default;
                            }
                            AppData[user][x.data.app] = new Engines[x.data.engine](
                                x.data
                            );
                        });
                        resolve(true);
                    }
                );
            });
        }
        await AppData[user][requestedService].request(req, res);
    });
};
