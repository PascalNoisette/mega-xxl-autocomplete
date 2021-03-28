export default (myDb) => (req, res, next) => {
    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    // Server must be requested with basic auth
    if (login && password) {
        myDb.setPassword(password);
        return next();
    }
    res.setHeader('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
};
