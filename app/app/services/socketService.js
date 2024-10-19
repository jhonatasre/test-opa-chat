import io from 'socket.io-client';
import * as Icon from 'react-bootstrap-icons';

const socket = io('http://localhost:3001', {
    auth: {
        token: localStorage.getItem('token')
    },
    transports: ['websocket', 'polling'],
});

export const initSocketListeners = (setListMessages, setUsers, setActiveUsers, userActive, showToast) => {
    socket.on('newMessage', (message) => {
        setListMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('notificationNewMessage', (message) => {
        const { title, content, sender } = message;
        if (sender !== userActive.id) {
            showToast({
                title,
                message: content,
                type: 'info',
                icon: <Icon.PersonFill className="me-2" />
            });
        }
    });

    socket.on('addListUser', (user) => {
        setUsers((prevUsers) => [...prevUsers, user]);
    });

    socket.on('activeUsers', (users) => {
        setActiveUsers(users);
    });
};

export const emitLogin = () => {
    socket.emit('login');
};

export const emitLogout = () => {
    socket.emit('logout');
};

export const joinChat = (chatId) => {
    socket.emit('joinChat', chatId);
};

export const sendMessage = (messageData) => {
    socket.emit('sendMessage', messageData);
};

export const cleanupListeners = () => {
    socket.off('newMessage');
    socket.off('addListUser');
    socket.off('activeUsers');
    socket.off('notificationNewMessage');
};
