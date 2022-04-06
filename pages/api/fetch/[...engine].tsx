// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import FileDataStore from '../../../lib/cypher-datastore';
import basicAuth from '../../../lib/middleware/basic-auth';
import axios from 'axios';
import { Service } from '../../../components/ReactAdmin/ServiceList/Interface/Service'

const myDB = new FileDataStore(process.cwd() + '/data');
/**
 * Proxy between the NextJs frontend and the remote endpoint which return the widget
 */
export default async (req: NextApiRequest, res: NextApiResponse): Promise<boolean> => {
    return await basicAuth(myDB)(req, res, async function () {
        const requestedServiceId = req.query.engine[0];
        const requestedService : {data:Service} = await new Promise(function (resolve, reject) {
            myDB.get(
                '/api/swagger/services/' + requestedServiceId,
                function callback(err, service) {
                    if (err) {
                        reject(err);
                    }
                    resolve(service);
                }
            );
        });

        return axios({
            url: requestedService.data.nice_url,
            responseType: 'stream'
        }).then((backendRes) => {
            res.setHeader('Content-Range', 'bytes : 0-9/*');
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            backendRes.data.pipe(res);
        });
    });
};
