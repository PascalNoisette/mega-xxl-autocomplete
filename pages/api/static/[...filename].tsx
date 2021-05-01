import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    await fs
        .readFile(
            process.cwd() + '/data/cache/' + req.query.filename[0].replace(/\.\./, '')
        )
        .catch((err) => {
            res.writeHead(404);
            res.end(JSON.stringify(err));
        })
        .then((data) => {
            res.writeHead(200);
            res.end(data);
        });
}
