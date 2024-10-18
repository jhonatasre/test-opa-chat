const Chat = require('../models/Chat');

class ChatController {
    async get(req, res) {
        try {
            const id = req.params.id;
            const userId = req.user.id;

            let chat = await Chat.model.findOne({
                participants: { $all: [id, userId] }
            });

            if (!chat) {
                chat = await Chat.model({
                    participants: [id, userId]
                });

                chat = await chat.save();
            }

            res.status(200).json(chat);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao carregar chat:', error });
        }
    }

    async sendMessage(req, res) {
        try {
            const id = req.params.id;
            const userId = req.user.id;

            const content = req.body.message;

            let chat = await Chat.model.findOne({
                participants: { $all: [id, userId] }
            });

            if (!chat) {
                return res.status(404).json({ mensagem: 'Chat não encontrado' });
            }

            chat.messages.push({
                sender: userId,
                content: content
            });

            await chat.save();

            res.status(200).json(chat);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao carregar chat:', error });
        }
    }
}

module.exports = new ChatController();