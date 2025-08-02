import jsonServer from 'json-server';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const server  = jsonServer.create();
const router  = jsonServer.router(join(__dirname, 'db.json'));
const middleware = jsonServer.defaults();

server.use(middleware);
server.use(jsonServer.bodyParser);

// Lee routes.json vía ES6
const routes = JSON.parse(
  readFileSync(join(__dirname, 'routes.json'), 'utf-8')
);

// Endpoint personalizado
server.get('/mapping/save', (req, res) => {
  const { hotelid1, hotelid2 } = req.query;
  const db = router.db;
  db.get('mappings')
    .push({ hotelid1, hotelid2, date: new Date().toISOString() })
    .write();
  res.json({ ok: true });
});

server.use(jsonServer.rewriter(routes));
server.use(router);

server.listen(4000, () =>
  console.log('Mock API running at http://localhost:4000')
);