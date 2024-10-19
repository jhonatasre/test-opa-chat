const User = require('../models/User');

class AuthController {
    async register(req, res) {
        let newUser;

        const { name, username, password } = req.body;

        try {
            const existingUser = await User.model.findOne({ username });

            if (existingUser) {
                return res.status(400).json({ message: 'Erro ao registrar usuário: Usuário já existe.' });
            }

            newUser = await User.model({ name, username, password });
            newUser = await newUser.save();

            req.app.get('socket').io.emit('addListUser', {
                id: newUser.id,
                name: name,
                username: username
            });

            const token = User.generateJWT(newUser);
            res.status(201).json({ token });
        } catch (err) {
            res.status(500).json({ message: `Erro ao registrar usuário: ${err.message}.` });
        }
    }

    async login(req, res) {
        const { username, password } = req.body;

        try {
            const user = await User.model.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: 'Usuário e/ou senha está(ão) incorreto(s).' });
            }

            const isMatch = await User.comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(404).json({ message: 'Usuário e/ou senha está(ão) incorreto(s).' });
            }

            const token = User.generateJWT(user);
            res.status(200).json({ token });
        } catch (err) {
            res.status(500).json({ message: `Erro ao registrar usuário: ${err.message}.` });
        }
    }

    async getProfile(req, res) {
        res.status(200).json({ user: req.user });
    }
}

module.exports = new AuthController();
