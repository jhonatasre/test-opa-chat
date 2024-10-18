const { Server } = require('socket.io');

class SocketServer {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                credentials: true
            }
        });
        this.initialize();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log(`-- Cliente conectado: ${socket.id}`);

            socket.on('registerConnection', (data) => {
                // Lógica para registrar a conexão
            });

            socket.on('disconnecting', () => {
                console.log(`-- Cliente desconectado: ${socket.id}`);
            });

            socket.on('error', () => {
                console.log(`-- Cliente desconectado: ${socket.id}`);
            });

            socket.on('connect_error', (err) => {
                console.log(`-- Erro de conexão devido a ${err.message}`);
            });
        });
    }

    getIO() {
        return this.io;
    }
}

module.exports = SocketServer;
