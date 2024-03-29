import { NextApiRequest, NextApiResponse } from 'next';
import CypherDataStore from '../cypher-datastore';
import { NextFunction, NextFunctionReturn } from '../middleware';
/**
 * Middleware to ask for a login/password.
 */
export default (myDb: CypherDataStore) => (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextFunction
): NextFunctionReturn => {
    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    // Server must be requested with basic auth
    if (req.headers['user-agent'].match(/CrKey/) || (login && password)) {
        myDb.setPassword(password || '');
        return next(req, res);
    }
    res.setHeader('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
};
