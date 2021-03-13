import requireGlob from 'require-glob';
import { NextApiRequest, NextApiResponse } from 'next'
import contentRange from '../../lib/middleware/content-range';


export default (req: NextApiRequest, res: NextApiResponse) => {

  contentRange(req, res, ()=>0);
  const Engines = requireGlob.sync(['lib/engines/*.js'], {cwd:process.cwd()});
  res.json(Object.keys(Engines));
}
