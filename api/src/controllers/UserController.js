const User = require('../models/User');

class UserController {
    async get(req, res) {
        try {
            const user = await User.model.find({ _id: { $ne: req.user.id } });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ message: `Erro ao enviar mesagem: ${err.message}.` });
        }
    }
}

module.exports = new UserController();