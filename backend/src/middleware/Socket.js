class Socket {
    async init(req, res, next) {
        const socket = req.app.get('socket');
        req.socket = socket;
        next();
    }
}

module.exports = new Socket();