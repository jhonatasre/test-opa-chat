const { Router } = require('express');
require('express-group-routes');

const UserController = require('./controllers/UserController');

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

router.get('/user', UserController.get);
router.post('/user', UserController.create);

// const Socket = require('./middlewares/Socket');

// routes.group("/", (routes) => {
//     routes.use(Socket.init);

//     routes.get('/', (req, res) => {
//         res.status(200).json({ status: 'ok' });
//     });
// });

module.exports = router;