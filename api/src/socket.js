const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Chat = require('./models/Chat');
const { Server } = require('socket.io');

const authenticateSocket = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Autenticação necessária.'));
    }

    jwt.verify(token, (process.env.JWT_SECRET || 'my-secret-jwt-token'), async (err, decoded) => {
        if (err) {
            return next(new Error('Token inválido.'));
        }

        try {
            const user = await User.model.findById(decoded.id);
            if (!user) {
                return next(new Error('Usuário não encontrado.'));
            }

            socket.user = user;
            next();
        } catch (error) {
            return next(new Error('Erro ao buscar usuário.'));
        }
    });
};

class SocketServer {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                credentials: true
            }
        });

        this.io.use(authenticateSocket);
        this.initialize();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log(`-- Cliente conectado: ${socket.id}`);

            socket.on('joinChat', async (chatId) => {
                const chat = await Chat.model.findById(chatId);

                if (chat && chat.participants.includes(socket.user.id)) {
                    const rooms = socket.rooms;
                    rooms.forEach((room) => {
                        if (room !== socket.id) {
                            socket.leave(room);
                        }
                    });

                    socket.join(chatId);
                }
            });

            socket.on('sendMessage', async ({ chatId, content }) => {
                const chat = await Chat.model.findById(chatId);

                if (chat && chat.participants.includes(socket.user.id)) {
                    chat.messages.push({
                        sender: socket.user.id,
                        content: content
                    });

                    await chat.save();

                    console.log('chatId', chatId);

                    this.io.to(chatId).emit('newMessage', {
                        sender: socket.user.id,
                        content,
                        timestamp: Date.now()
                    });
                }
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
