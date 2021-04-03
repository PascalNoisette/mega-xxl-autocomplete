import { NextApiRequest, NextApiResponse } from 'next';
export type NextFunctionReturn = any;
export type NextFunction = (
    req: NextApiRequest,
    res: NextApiResponse,
    next?: NextFunction
) => NextFunctionReturn;
