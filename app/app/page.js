"use client";

import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

import { useToast } from './context/ToastContext';

import { Form, Button, Row, Container, Card, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

export default function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { showToast } = useToast();
    const { login, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated()) {
            router.push('/');
        }
    }, [loading]);

    const handleClick = () => {
        showToast('Informação', 'Este é o toast disparado de qualquer lugar!', 'success', 10000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            login(username, password);
            router.push('/chat');
        } catch (error) {
            console.error('Login falhou:', error);
            throw new Error('Falha no login:', error);
        }
    };

    return (
        <Container style={{ backgroundImage: "url('/img/background.jpg')" }} fluid={true}>
            <Row className="d-flex align-items-center min-vh-100">
                <Col
                    xsm={{ span: 10, offset: 1 }}
                    sm={{ span: 8, offset: 2 }}
                    md={{ span: 6, offset: 3 }}
                    lg={{ span: 4, offset: 4 }}
                >
                    <Card style={{ borderRadius: 35 }}>
                        <Card.Body style={{ padding: 75 }}>
                            <button onClick={handleClick}>Mostrar Toast</button>
                            <Card.Title className="mb-5">
                                <h2>Acese sua conta</h2>
                                <small>Insira suas credenciais para fazer o login</small>
                            </Card.Title>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Usuário</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Usuário"
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Senha</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Senha"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Button variant="outline-dark" type="submit" className="w-100">
                                    Acessar
                                    <Icon.ArrowRight className="ms-2" />
                                </Button>

                            </Form>
                        </Card.Body>
                        <Card.Footer
                            className="text-muted text-center"
                            onClick={() => router.push('/register')}
                            style={{ padding: 15, cursor: 'pointer' }}
                        >
                            Criar uma nova conta
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}