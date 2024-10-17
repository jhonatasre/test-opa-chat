const http = require('http');
const cors = require('cors');
const express = require('express');

const SocketServer = require('./socket');

const port = process.env.PORT || 3000;

new class App {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.app.set('socket', new SocketServer(this.server));

        // const db = new DB(this.app);
        // db.init();

        this.middlewares();
        this.routes();

        // this.app.set("cron", new Cron(this.app));
        this.run();
    }

    routes() {
        // this.app.use('/', routes);
    }

    middlewares() {
        this.app.use(express.json({ type: 'application/json' }));
        this.app.use(cors({ origin: true, credentials: true }));
    }

    run() {
        this.app.listen(port, function () {
            console.log(`--- Servidor inicializado`);
        });
    }
}

