import { NextApiRequest, NextApiResponse } from 'next';
import Xray from 'x-ray';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import mkdirp from 'mkdirp';
import nodeFetch from 'node-fetch';
/**
 * Download remote file into 'cache' directory
 * (Usefull to request everything from the same domain afterwards)
 */
const downloadFile = (url): Promise<string> => {
    const hashUrl = crypto.createHash('md5').update(url).digest('hex');
    const cleanExt =
        path
            .extname(url)
            .split(/[^a-zA-Z]/g)
            .filter((x) => x)[0] ?? '';
    const hashName = hashUrl + '.' + cleanExt;
    const cacheDir = '/data/cache/';
    const filename = process.cwd() + cacheDir + hashName;
    if (fs.existsSync(filename)) {
        return Promise.resolve(hashName);
    }
    mkdirp.sync(process.cwd() + cacheDir);
    return nodeFetch(url)
        .then((res) => res.body.pipe(fs.createWriteStream(filename)))
        .then(() => hashName);
};
/**
 * Search for title, favicon and opensearch on a given homepage
 */
export default async function (req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const x = Xray();
    const url = JSON.parse(req.body).nice_url;
    const discovery = await x(url, {
        title: 'title',
        links: x(['link'], { rel: '@rel', type: '@type', href: '@href' })
    });

    const result = { logo_alt: discovery.title };
    discovery.links.rel.map(async (rel, i) => {
        if (typeof discovery.links.href[i] != 'undefined') {
            if ((rel ?? '').includes('icon')) {
                result['logo'] = await downloadFile(discovery.links.href[i]);
            }
            if ((discovery.links.type[i] ?? '').includes('opensearch')) {
                result['opensearch'] = await downloadFile(discovery.links.href[i]);
                result['opensearch_upload'] = '';
            }
        }
    });

    if (!result['logo']) {
        result['logo'] = await downloadFile(`${url}/favicon.ico`);
    }

    res.json(result);
}
