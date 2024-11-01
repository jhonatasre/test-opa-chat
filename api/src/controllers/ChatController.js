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
        } catch (err) {
            res.status(500).json({ message: `Erro ao carregar chat: ${err.message}.` });
        }
    }
}

module.exports = new ChatController();