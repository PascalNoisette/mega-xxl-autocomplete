import vary from 'vary';
import accepts from 'accepts';
import async from 'async';
import typeis from 'type-is';

/* Adapter for NextApiRequest and NextApiResponse to work like Express */
export default (req, res, next) => {
    req.path = req.url.split('?')[0];
    req.baseUrl = '';
    res.body = false;
    res.location = (url) => {
        res.set('Location', url);
        res.status(302);
    };
    req.is = (consumes) => typeis(req, consumes);
    req.get = (name) => req.headers?.[name];
    req.set = (name, value) => (req.headers[name] = value);
    res.set = (name, value) => {
        console.log([name, value]);
        res.setHeader(name, value);
    };
    res.get = (name) => {
        res.headers?.[name];
    };
    res.type = (ct) => {
        res.set('Content-Type', ct);
    };
    res.vary = (value) => vary(res, value);
    req.accepts = accepts.bind(res);
    req.send;
    next();
};

export const useMiddleware = (swaggerMiddlewares, req, res) => {
    return async.series(
        swaggerMiddlewares.map((middleware) => (resolve: () => void) => {
            if (['jsonParser', 'mockResponseBody'].indexOf(middleware.name) != -1) {
                const oldmiddleware = middleware;
                middleware = function (req, res, next) {
                    oldmiddleware(req, res, () => 0);
                    next();
                };
            }
            middleware(req, res, function next() {
                resolve();
            });
        })
    );
};
