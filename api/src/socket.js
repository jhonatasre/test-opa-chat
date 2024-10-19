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
        this.activeUsers = {};
        this.sessionsUsers = {};
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

                    const lastMessage = chat.messages[chat.messages.length - 1];

                    this.io.to(chatId).emit('newMessage', {
                        _id: lastMessage._id,
                        sender: socket.user.id,
                        content,
                        timestamp: Date.now()
                    });

                    let otherParticipantId = chat.participants.filter(p => !p._id.equals(socket.user.id));
                    otherParticipantId = otherParticipantId[0]._id.toString();

                    if (this.sessionsUsers[otherParticipantId]) {
                        this.sessionsUsers[otherParticipantId].emit('notificationNewMessage', {
                            sender: socket.user.id,
                            title: socket.user.name,
                            content
                        });
                    }
                }
            });

            socket.on('login', async () => {
                this.activeUsers[socket.user.id] = socket.user.id;
                this.sessionsUsers[socket.user.id] = socket;

                this.io.emit('activeUsers', Object.values(this.activeUsers));
            });

            socket.on('error', () => this._disconectUser(socket));
            socket.on('logout', () => this._disconectUser(socket));
            socket.on('disconnecting', () => this._disconectUser(socket));
            socket.on('connect_error', (err) => this._disconectUser(socket, `Erro na conexão (${err.message})`));
        });
    }

    _disconectUser(socket, message = 'Cliente desconectado') {
        console.log(`-- ${message}: ${socket.id}`);

        delete this.activeUsers[socket.user.id];
        delete this.sessionsUsers[socket.user.id];

        this.io.emit('activeUsers', Object.values(this.activeUsers));
    }

    getIO() {
        return this.io;
    }
}

module.exports = SocketServer;
