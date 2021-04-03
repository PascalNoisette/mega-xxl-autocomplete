import { NextApiRequest, NextApiResponse } from 'next';

export interface Engine {
    request(clitentReq: NextApiRequest, clientRes: NextApiResponse): Promise<any>;
}
