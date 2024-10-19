const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Chat = require('./models/Chat');
const { Server } = require('socket.io');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-streams-adapter');

class SocketServer {
    constructor(server) {
        this.redisClient = createClient({ url: "redis://redis:6379" });
        this.redisClient.connect().catch(err => {
            console.log('!!! Erro ao conectar ao Redis:', err);
        });

        this.io = new Server(server, {
            adapter: createAdapter(this.redisClient),
            cors: {
                origin: "*",
                credentials: true,
                allowedHeaders: ['Authorization'],
            }
        });

        this.io.use(this.authenticateSocket);
        this.initialize();
    }

    authenticateSocket(socket, next) {
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
                    const participantSocketId = await this.getParticipantSocketId(otherParticipantId);

                    if (participantSocketId) {
                        this.io.to(participantSocketId).emit('notificationNewMessage', {
                            sender: socket.user.id,
                            title: socket.user.name,
                            content
                        });
                    }
                }
            });

            socket.on('login', async () => {
                if (!this.redisClient) {
                    console.error('!!! --- redisClient não está definido.');
                    return;
                }

                await this.redisClient.sAdd('activeUsers', socket.user.id);
                await this.redisClient.hSet('sessionsUsers', socket.user.id, socket.id);

                const activeUsers = await this.getActiveUsers();
                this.io.emit('activeUsers', activeUsers);
            });

            socket.on('error', () => this.disconnectUser(socket));
            socket.on('logout', () => this.disconnectUser(socket));
            socket.on('disconnecting', () => this.disconnectUser(socket));
            socket.on('connect_error', (err) => this.disconnectUser(socket, `Erro na conexão (${err.message})`));
        });
    }

    async getParticipantSocketId(participantId) {
        try {
            const socketId = await this.redisClient.hGet('sessionsUsers', participantId);
            return socketId;
        } catch (error) {
            console.error('Erro ao obter socketId do participante:', error);
            return null;
        }
    }

    async getActiveUsers() {
        const users = await this.redisClient.sMembers('activeUsers');
        return users;
    }

    async disconnectUser(socket, message = 'Cliente desconectado') {
        console.log(`-- ${message}: ${socket.id}`);

        await this.redisClient.sRem('activeUsers', socket.user.id);
        await this.redisClient.hDel('sessionsUsers', socket.user.id);

        const activeUsers = await this.getActiveUsers();
        this.io.emit('activeUsers', activeUsers);
    }

    getIO() {
        return this.io;
    }
}

module.exports = SocketServer;
