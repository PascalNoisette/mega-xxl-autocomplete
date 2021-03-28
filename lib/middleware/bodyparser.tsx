const bodyParser = require('body-parser');
const handler = bodyParser.text({ type: 'application/x-ndjson' });
export default handler;
