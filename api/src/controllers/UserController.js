const User = require('../models/User');

class UserController {
    async get(req, res) {
        try {
            const user = await User.model.find();

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao listar usuários', error });
        }
    }

    async create(req, res) {
        const { name, username, password } = req.body;

        try {
            const user = await User.create({ name, username, password });
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ mensagem: 'Erro ao criar usuário', error });
        }
    }

}

module.exports = new UserController();