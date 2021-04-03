import { NextApiRequest, NextApiResponse } from 'next';
import { NextFunctionReturn, NextFunction } from '../middleware';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextFunction
): NextFunctionReturn {
    res.setHeader('Content-Range', 'bytes : 0-9/*');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    return next(req, res);
}
