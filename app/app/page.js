"use client";

import { Form, Button, Row, Container, Card, Col } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { login, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated()) {
            router.push('/');
        }
    }, [loading]);

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
        <Container>
            <Row className="d-flex align-items-center min-vh-100">
                <Col md={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body className="">
                            <h2>Acese sua conta</h2>
                            <span className="mb-3">Insira suas credenciais para fazer o login</span>

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
                                </Button>

                            </Form>
                        </Card.Body>
                        <Card.Footer className="text-muted text-center cursor-pointer" onClick={() => router.push('/register')}>Criar uma nova conta</Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}