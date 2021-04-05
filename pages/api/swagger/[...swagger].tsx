import createMiddleware from '@apidevtools/swagger-express-middleware';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import FileDataStore from '../../../lib/cypher-datastore';
import basicAuth from '../../../lib/middleware/basic-auth';
import contentRange from '../../../lib/middleware/content-range';
import expressMock, { useMiddleware } from '../../../lib/middleware/express-mock';
import filterMock from '../../../lib/middleware/filter-mock';
const myDB = new FileDataStore(process.cwd() + '/data');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<boolean> {
    return await new Promise(function (resolve, reject) {
        const swaggerFile = path.join(process.cwd(), '/definition/swagger.yaml');
        createMiddleware(swaggerFile, async function (err, swaggerMiddleware) {
            try {
                await useMiddleware(
                    [].concat(
                        [expressMock, basicAuth(myDB), contentRange, filterMock],
                        swaggerMiddleware.metadata(),
                        swaggerMiddleware.parseRequest(),
                        swaggerMiddleware.validateRequest(),
                        swaggerMiddleware.mock(myDB)
                    ),
                    req,
                    res
                );
                resolve(true);
            } catch (e) {
                reject(e);
            }
        });
    });
}
