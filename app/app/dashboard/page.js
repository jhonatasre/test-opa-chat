'use client';

import md5 from 'md5';
import Chat from '../components/Chat';
import UserList from '../components/UserList';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useEffect, useState, useRef } from 'react';
import PrivateRoute from '../components/PrivateRoute';
import { Row, Container, Card, Col, Image, Dropdown, Modal, Button, Form, InputGroup } from 'react-bootstrap';
import {
    initSocketListeners,
    emitLogin,
    emitLogout,
    joinChat,
    sendMessage,
    cleanupListeners
} from '../services/socketService';

import * as yup from 'yup';
import * as formik from 'formik';
import * as Icon from 'react-bootstrap-icons';
import * as api from '../services/apiService';

export default function Dashboard() {
    const { Formik } = formik;

    const { logged, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [chatLogged, setChatLogged] = useState('');
    const [activeUsers, setActiveUsers] = useState([]);
    const [listMessages, setListMessages] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [showModalpassChange, setShowModalpassChange] = useState(false);
    const [userActive, setUserActive] = useState({ id: '', name: '', username: '' });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePsswordConfirmVisibility = () => {
        setShowPasswordConfirm(!showPasswordConfirm);
    };

    const { showToast } = useToast();
    const messagesEndRef = useRef(null);

    const schema = yup.object().shape({
        password: yup.string().required('Senha é obrigatória.'),
        password_confirm: yup.string()
            .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais.')
            .required('Confirmação de senha é obrigatória.'),
    });

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

    const handleCloseModalpassChange = () => setShowModalpassChange(false);
    const handleShowModalpassChange = () => setShowModalpassChange(true);

    const handleSubmitNewPassword = async ({ password }) => {
        api.post({
            endpoint: '/auth/update-password',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: { password }
        }).then(() => {
            showToast({
                title: 'Sucesso!',
                message: 'Senha alterada com sucesso!',
                type: 'success',
                icon: <Icon.Check2 className="me-2" />
            });

            setShowModalpassChange(false);
        }).catch((err) => {
            return showToast({
                title: 'Erro',
                message: `Erro: ${err?.message}`,
                type: 'danger',
                icon: <Icon.XCircleFill className="me-2" />
            });
        });
    }

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
                    <>
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
                                                                <Dropdown.Item onClick={handleShowModalpassChange}>
                                                                    <Icon.KeyFill className="me-2" /> Alterar Senha
                                                                </Dropdown.Item>
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

                        <Modal show={showModalpassChange} onHide={handleCloseModalpassChange}>

                            <Formik
                                validationSchema={schema}
                                onSubmit={handleSubmitNewPassword}
                                initialValues={{
                                    password: '',
                                    password_confirm: ''
                                }}
                            >
                                {({ handleSubmit, handleChange, values, errors }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Trocando Senha</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <span>Digite sua nova senha</span>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Senha</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        placeholder="Senha"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.password}
                                                    />
                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={togglePasswordVisibility}
                                                        style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                                                    >
                                                        {showPassword ? <Icon.EyeSlash /> : <Icon.Eye />}
                                                    </Button>
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.password}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Confirmar Senha</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        type={showPasswordConfirm ? "text" : "password"}
                                                        name="password_confirm"
                                                        placeholder="Confirmar Senha"
                                                        value={values.password_confirm}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.password_confirm}
                                                    />
                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={togglePsswordConfirmVisibility}
                                                        style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                                                    >
                                                        {showPasswordConfirm ? <Icon.EyeSlash /> : <Icon.Eye />}
                                                    </Button>
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.password_confirm}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleCloseModalpassChange}>
                                                Fechar
                                            </Button>
                                            <Button variant="primary" type="submit">
                                                Salvar Alterações
                                            </Button>
                                        </Modal.Footer>
                                    </Form>
                                )}
                            </Formik>
                        </Modal>
                    </>
            }
        </PrivateRoute>
    );
}
