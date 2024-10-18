const User = require('../models/User');

class AuthController {
    async register(req, res) {
        const { name, username, password } = req.body;

        try {
            const existingUser = await User.model.findOne({ username });

            if (existingUser) {
                return res.status(400).json({ message: 'Usuário já existe' });
            }

            const newUser = new User.create({ name, username, password });
            const token = newUser.generateJWT();
            res.status(201).json({ token });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao registrar usuário', error: err.message });
        }
    }

    async login(req, res) {
        const { username, password } = req.body;

        try {
            const user = await User.model.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: 'Usuário e/ou senha está(ão) incorreto(s).' });
            }

            const isMatch = User.comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(404).json({ message: 'Usuário e/ou senha está(ão) incorreto(s).' });
            }

            const token = User.generateJWT(user);
            res.status(200).json({ token });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao fazer login', error: err.message });
        }
    }

    async getProfile(req, res) {
        res.status(200).json({ user: req.user });
    }
}

module.exports = new AuthController();
