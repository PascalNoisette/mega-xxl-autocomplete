import glob from 'glob';
import { NextApiRequest, NextApiResponse } from 'next';
import { basename } from 'path';
import contentRange from '../../lib/middleware/content-range';

export default (req: NextApiRequest, res: NextApiResponse) => {
    contentRange(req, res, () => 0);
    const Engines = glob.sync('lib/engines/*.tsx').map((path) => basename(path, '.tsx')); //process.cwd()
    res.json(Engines);
};
