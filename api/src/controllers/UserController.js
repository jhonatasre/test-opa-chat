const User = require('../models/User');

class UserController {
    async get(req, res) {
        try {
            const user = await User.model.find({ _id: { $ne: req.user.id } });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao listar usuários', error });
        }
    }
}

module.exports = new UserController();