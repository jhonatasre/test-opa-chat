const { Router } = require('express');

const AuthController = require('./controllers/AuthController');
const ChatController = require('./controllers/ChatController');
const UserController = require('./controllers/UserController');

const authMiddleware = require('./middlewares/auth');

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);
router.get('/auth/profile', authMiddleware, AuthController.getProfile);

router.get('/user', authMiddleware, UserController.get);

router.get('/chat/:id', authMiddleware, ChatController.get);
router.post('/chat/:id/message', authMiddleware, ChatController.sendMessage);

module.exports = router;