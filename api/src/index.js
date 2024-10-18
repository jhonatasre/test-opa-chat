const http = require('http');
const cors = require('cors');
const express = require('express');
const passport = require('passport');

const routes = require('./routes');
const SocketServer = require('./socket');
const Database = require('./config/database');


const port = process.env.PORT || 3000;

new class App {
    constructor() {
        Database.conn();

        this.app = express();
        this.server = http.createServer(this.app);
        this.app.set('socket', new SocketServer(this.server));

        this.middlewares();
        this.routes();

        this.run();
    }

    routes() {
        this.app.use('/', routes);
    }

    middlewares() {
        this.app.use(express.json({ type: 'application/json' }));
        this.app.use(cors({ origin: true, credentials: true }));

        this.app.use(passport.initialize());
        require('./config/passport')(passport);
    }

    run() {
        this.server.listen(port, function () {
            console.log(`--- Servidor inicializado`);
        });
    }
}

