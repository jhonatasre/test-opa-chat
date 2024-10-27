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
router.post('/auth/update-password', authMiddleware, AuthController.updatePassword);

router.get('/user', authMiddleware, UserController.get);

router.get('/chat/:id', authMiddleware, ChatController.get);

module.exports = router;