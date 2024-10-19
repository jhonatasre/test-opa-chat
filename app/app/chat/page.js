'use client';

import md5 from 'md5';
import moment from 'moment';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useEffect, useState, useRef } from 'react';
import PrivateRoute from '../components/PrivateRoute';

import * as Icon from 'react-bootstrap-icons';
import { Form, Button, Row, Container, Card, Col, ListGroup, InputGroup, Image } from 'react-bootstrap';

const socket = io('http://localhost:3001', {
    auth: {
        token: localStorage.getItem('token')
    }
});

export default function Chat() {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [chatLogged, setChatLogged] = useState('');
    const [activeUsers, setActiveUsers] = useState([]);
    const [listMessages, setListMessages] = useState([]);
    const [userActive, setUserActive] = useState({ id: '', name: '', username: '' });

    const { showToast } = useToast();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.on('newMessage', (message) => {
            setListMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('activeUsers', (users) => {
            setActiveUsers(users);
        });

        socket.emit('login');

        fetchUsers();

        return () => {
            socket.off('newMessage');
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [listMessages]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:3001/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!res.ok) {
                return showToast('Erro', 'Erro ao buscar usuários', 'warning', 10000);
            }

            const usersData = await res.json();
            setUsers(usersData);
        } catch (err) {
            return showToast('Erro', `Erro: ${err?.message}`, 'warning', 10000);
        }
    };

    const handleSelectUser = async (user) => {
        try {
            const res = await fetch(`http://localhost:3001/chat/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!res.ok) {
                return showToast('Erro', 'Erro ao carregar o chat', 'warning', 10000);
            }

            const { id, messages } = await res.json();

            setChatLogged(id);

            socket.emit('joinChat', id);

            setUserActive(user);
            setListMessages(messages);
        } catch (err) {
            return showToast('Erro', `Erro: ${err?.message}`, 'warning', 10000);
        }
    }

    const sendMessage = async () => {
        try {
            if (!message) {
                return;
            }

            const messageData = { chatId: chatLogged, content: message };
            socket.emit('sendMessage', messageData);
            setMessage('');
        } catch (err) {
            return showToast('Erro', `Erro: ${err?.message}`, 'warning', 10000);
        }
    }

    const handleLogout = async () => {
        socket.emit('logout');
        logout();
    }

    return (
        <PrivateRoute>
            {
                !user ? <></> :
                    <div style={{ backgroundImage: "url('/img/background.jpg')" }} className="min-vh-100">
                        <Container className="d-flex w-100 flex-column justify-content-center min-vh-100">
                            <Card style={{ borderRadius: 35 }}>
                                <Card.Header>
                                    <Row>
                                        <Col xs={10}>
                                            <Row>
                                                <Col xs={2} lg={1}>
                                                    <Image src={`https://www.gravatar.com/avatar/${md5(user.username)}?d=identicon`} roundedCircle fluid />
                                                </Col>
                                                <Col xs={10} lg={11} className="d-flex flex-column justify-content-center">
                                                    <span><Icon.CircleFill className="text-success" /> {user.name}</span><br />
                                                    <small>@{user.username}</small>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={2} className="text-end align-items-center">
                                            <Button onClick={() => handleLogout()} variant="link" size="lg" className="text-danger" title="Sair">
                                                <Icon.Power className="font-weight-bolder fs-3" />
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body className="m-0">
                                    <Row className="h-vh-75">
                                        <Col md={4}>
                                            <ListGroup>
                                                {users.map((user) => (
                                                    <ListGroup.Item key={user.id} className={`${user.id == userActive.id ? 'bg-info text-dark' : ''}`} action onClick={() => handleSelectUser(user)}>
                                                        <Row>
                                                            <Col xs={4} lg={2} className="d-flex flex-column justify-content-center">
                                                                <Image src={`https://www.gravatar.com/avatar/${md5(user.username)}?d=identicon`} roundedCircle fluid />
                                                            </Col>
                                                            <Col xs={8} lg={10} className="d-flex flex-column justify-content-center">
                                                                <span><Icon.CircleFill className={activeUsers.indexOf(user.id) >= 0 ? 'text-success' : 'text-danger'} /> {user.name}</span><br />
                                                                <small>@{user.username}</small>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </Col>
                                        <Col md={8} className="d-flex flex-column justify-content-between">
                                            <div className="flex-grow-1">
                                                <Row className="mb-2">
                                                    <Col xs={1} className="d-flex flex-column justify-content-center">
                                                        <Image src={`https://www.gravatar.com/avatar/${md5(userActive.username)}?d=identicon`} roundedCircle fluid />
                                                    </Col>
                                                    <Col xs={11}>
                                                        <span><Icon.CircleFill className={activeUsers.indexOf(user.id) >= 0 ? 'text-success' : 'text-danger'} /> {userActive.name}</span><br />
                                                        <small>@{userActive.username}</small>
                                                    </Col>
                                                </Row>
                                                <Row className="flex-grow-1 h-100">
                                                    <Col xs={12} className="flex-grow-1 h-100" >
                                                        <div
                                                            className="overflow-x-hidden overflow-y-auto"
                                                            style={{
                                                                backgroundColor: '#F2F2F2',
                                                                borderRadius: '1rem',
                                                                height: 'calc(67vh - 70px)',
                                                                padding: '15px 10px'
                                                            }}>
                                                            {listMessages.map(message => (
                                                                <Row key={message.id} className="mb-2">
                                                                    <Col className={
                                                                        `d-flex ${message.sender == user.id ? 'justify-content-end text-end' : ''}`
                                                                    }>
                                                                        <Card className={`${message.sender == user.id ? 'bg-primary text-light' : ''}`}>
                                                                            <Card.Body>
                                                                                {message.content}<br />
                                                                                <small>
                                                                                    {moment(message.timestamp).isSame(moment(), 'day') ? (
                                                                                        "Hoje"
                                                                                    ) : moment(message.timestamp).isSame(moment().subtract(1, 'days'), 'day') ? (
                                                                                        "Ontem"
                                                                                    ) : (
                                                                                        moment(message.timestamp).format('DD/MM/YYYY')
                                                                                    )} - {moment(message.timestamp).format('HH:mm')}
                                                                                </small>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            ))}
                                                            <div ref={messagesEndRef} />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    as="textarea"
                                                    placeholder="Mensagem..."
                                                    aria-describedby="send-message"
                                                    style={{ resize: 'none' }}
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                                <Button variant="outline-primary" id="send-message" onClick={() => sendMessage()}>
                                                    <Icon.SendFill className="ms-2 me-2 fs-3" />
                                                </Button>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Container>
                    </div>
            }
        </PrivateRoute>
    );
}