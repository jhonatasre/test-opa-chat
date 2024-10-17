const { Router } = require('express');
require('express-group-routes');

const routes = Router();

const Socket = require('./middleware/Socket');

routes.group("/", (routes) => {
    routes.use(Socket.init);

    routes.get('/', (req, res) => {
        res.status(200).json({ status: 'ok' });
    });
});

module.exports = routes;