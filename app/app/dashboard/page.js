'use client';

import md5 from 'md5';
import Chat from '../components/Chat';
import UserList from '../components/UserList';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useEffect, useState, useRef } from 'react';
import PrivateRoute from '../components/PrivateRoute';
import { Row, Container, Card, Col, Image, Dropdown } from 'react-bootstrap';
import {
    initSocketListeners,
    emitLogin,
    emitLogout,
    joinChat,
    sendMessage,
    cleanupListeners
} from '../services/socketService';

import * as Icon from 'react-bootstrap-icons';
import * as api from '../services/apiService';

export default function Dashboard() {
    const { logged, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [chatLogged, setChatLogged] = useState('');
    const [activeUsers, setActiveUsers] = useState([]);
    const [listMessages, setListMessages] = useState([]);
    const [userActive, setUserActive] = useState({ id: '', name: '', username: '' });

    const { showToast } = useToast();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        initSocketListeners(setListMessages, setUsers, setActiveUsers, userActive, showToast);
        emitLogin();

        fetchUsers();

        return () => {
            cleanupListeners();
        };
    }, [userActive]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [listMessages]);

    const fetchUsers = async () => {
        try {
            const res = await api.get({
                endpoint: '/user',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (!res.ok) {
                return showToast({
                    title: 'Erro',
                    message: 'Erro ao buscar usuários',
                    type: 'warning',
                    icon: <Icon.ExclamationTriangleFill className="me-2" />
                });
            }

            const usersData = await res.json();
            setUsers(usersData);
        } catch (err) {
            return showToast({
                title: 'Erro',
                message: `Erro: ${err?.message}`,
                type: 'danger',
                icon: <Icon.XCircleFill className="me-2" />
            });
        }
    };

    const handleSelectUser = async (user) => {
        try {
            const res = await api.get({
                endpoint: `/chat/${user.id}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!res.ok) {
                return showToast({
                    title: 'Erro',
                    message: 'Erro ao carregar o chat',
                    type: 'warning',
                    icon: <Icon.ExclamationTriangleFill className="me-2" />
                });
            }

            const { id, messages } = await res.json();

            joinChat(id);
            setChatLogged(id);
            setUserActive(user);
            setListMessages(messages);
        } catch (err) {
            return showToast({
                title: 'Erro',
                message: `Erro: ${err?.message}`,
                type: 'danger',
                icon: <Icon.XCircleFill className="me-2" />
            });
        }
    }

    const handleSendMessage = async (message) => {
        if (message) {
            sendMessage({ chatId: chatLogged, content: message });
        }
    }

    const handleLogout = async () => {
        emitLogout();
        logout();
    }

    return (
        <PrivateRoute>
            {
                !logged ? <></> :
                    <div style={{ backgroundImage: "url('/img/background.jpg')" }} className="min-vh-100">
                        <Container className="d-flex w-100 flex-column justify-content-center min-vh-100">
                            <Card style={{ borderRadius: 35 }}>

                                <Card.Header>
                                    <Row>
                                        <Col xs={2} className="d-flex align-items-center">
                                            <span className="fs-3">Mensagens</span>
                                        </Col>
                                        <Col xs={10}>
                                            <Row>
                                                <Col xs={10} lg={11} className="d-flex flex-column justify-content-center text-end">
                                                    <span>{logged.name}<Icon.CircleFill className="text-success ms-2" /></span><br />
                                                    <small>@{logged.username}</small>
                                                </Col>
                                                <Col xs={2} lg={1} className="text-end">
                                                    <Dropdown align="end">
                                                        <Dropdown.Toggle as={Image} src={`https://www.gravatar.com/avatar/${md5(logged.username)}?d=identicon`} roundedCircle fluid className="cursor-pointer" />
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={handleLogout}>
                                                                <Icon.Power className="me-2" /> Sair
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Header>

                                <Card.Body className="m-0">
                                    <Row className="h-vh-75">
                                        <Col md={4} className="overflow-x-hidden overflow-y-auto" style={{ height: 'calc(37px + 67vh)' }}>
                                            <UserList
                                                users={users}
                                                activeUsers={activeUsers}
                                                userActive={userActive}
                                                handleSelectUser={handleSelectUser}
                                            />
                                        </Col>
                                        <Col md={8} className="d-flex flex-column justify-content-between">
                                            {
                                                !userActive.id ?
                                                    <></> :
                                                    <Chat
                                                        handleSendMessage={handleSendMessage}
                                                        logged={logged}
                                                        onlines={activeUsers}
                                                        messages={listMessages}
                                                        userActive={userActive}
                                                    />
                                            }
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
