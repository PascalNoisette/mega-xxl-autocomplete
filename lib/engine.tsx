import { NextApiRequest, NextApiResponse } from 'next';
/**
 * Typedef
 *
 * You can add your own engine into lib/engine by implementing this interface
 * ReactiveSearch perform a elasticsearch-like query and expect a elasticsearch-like answer
 */
export interface Engine {
    request(clitentReq: NextApiRequest, clientRes: NextApiResponse): Promise<any>;
}
