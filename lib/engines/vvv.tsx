import Firebird, { Options } from 'node-firebird';
import { NextApiRequest, NextApiResponse } from 'next';
import util from 'util';

export default class Vvv {
    service: { url: string; credentials: string };

    constructor(service: { url: string; credentials: string }) {
        this.service = service;
    }

    async request(req: NextApiRequest, res: NextApiResponse): Promise<any> {
        const service = this.service;
        const keyword = JSON.parse(req.body.split('\n')[1]).query.bool.must[0].bool.must
            .bool.should[0].multi_match.query;
        const options: Options = {
            host: service.url.split(':')[0],
            port: Number(service.url.split(':')[1]),
            database: service.url.split(':')[2],
            user: service.credentials.split(':')[0],
            password: service.credentials.split(':')[1]
        };

        try {
            const pool = Firebird.pool(10, options);
            const db = await util.promisify(pool.get.bind(pool))();
            const result = await util.promisify(db.query.bind(db))(
                'SELECT FIRST 100 FILE_NAME, FILE_ID as ID, PATH_ID, FILE_SIZE, FILE_EXT, FILE_DATETIME FROM FILES WHERE UPPER(FILE_NAME) like ' +
                    Firebird.escape('%' + keyword.toUpperCase() + '%', 13) +
                    ' ORDER BY PATH_FILE_ID DESC'
            );
            db.detach();
            await Promise.all(
                result.map(async (element) => {
                    const db = await util.promisify(pool.get.bind(pool))();
                    const { FULL_PATH } = await util.promisify(
                        db.query.bind(db)
                    )("EXECUTE PROCEDURE SP_GET_FULL_PATH\n ?, '/';", [
                        element['PATH_ID']
                    ]);
                    element['FULL_PATH'] = FULL_PATH;
                    element['FILE_SIZE'] = ((bytes, si = false, dp = 1) => {
                        const thresh = si ? 1000 : 1024;

                        if (Math.abs(bytes) < thresh) {
                            return bytes + ' B';
                        }

                        const units = si
                            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
                            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
                        let u = -1;
                        const r = 10 ** dp;

                        do {
                            bytes /= thresh;
                            ++u;
                        } while (
                            Math.round(Math.abs(bytes) * r) / r >= thresh &&
                            u < units.length - 1
                        );
                        return bytes.toFixed(dp) + ' ' + units[u];
                    })(element['FILE_SIZE']);
                    element.title =
                        '<div class="suggest-legend">' +
                        element['FULL_PATH'] +
                        ' (' +
                        element['FILE_SIZE'] +
                        ')' +
                        '</div>' +
                        element['FILE_NAME'];
                    element._source = Object.assign({}, element);
                    db.detach();
                })
            );
            pool.destroy();
            res.status(200).json({
                responses: [
                    {
                        hits: {
                            total: { value: result.length },
                            hits: result
                        }
                    }
                ]
            });
        } catch (e) {
            res.status(500).send(e.message);
        }
    }
}
