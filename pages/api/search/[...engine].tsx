// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import requireGlob from 'require-glob';
import FileDataStore from '../../../lib/cypher-datastore';
import basicAuth from '../../../lib/middleware/basic-auth';

let myDB = new FileDataStore(process.cwd() + '/data');
const Engines = requireGlob.sync(['lib/engines/*.js'], {cwd:process.cwd()});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await basicAuth(myDB)(req, res, async function() {
    const requestedService = req.query.engine[0];
    await new Promise(function (resolve, reject) {
      // TODO refacto in tsx
      // @ts-ignore
      myDB.getCollection("/api/swagger/services", async function callback(err, services) {
        const service = services.filter((x) => x.data.app == requestedService).pop().data;
        await Engines[service.engine](service).request(req, res);
        resolve(true);
      });
    });
  });
}

