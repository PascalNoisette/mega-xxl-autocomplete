import createMiddleware from '@apidevtools/swagger-express-middleware';
import path from 'path';
import FileDataStore from '../../../lib/cypher-datastore';
import basicAuth from '../../../lib/middleware/basic-auth';
import contentRange from '../../../lib/middleware/content-range';
import expressMock, { useMiddleware } from '../../../lib/middleware/express-mock';
const myDB = new FileDataStore(process.cwd() + '/data');

export default async function handler(req, res) {
    await new Promise(function (resolve, reject) {
        const swaggerFile = path.join(process.cwd(), '/definition/swagger.yaml');
        createMiddleware(swaggerFile, async function (err, swaggerMiddleware) {
            try {
                await useMiddleware(
                    [].concat(
                        [expressMock, basicAuth(myDB), contentRange],
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
