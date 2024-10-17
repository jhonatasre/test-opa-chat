"use client";

import { Form, Button, Row, Container, Card, Col } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

import styles from './page.module.css';

export default function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/chat');
        }
    }, [isAuthenticated]);

    return (
        <Container>
            <Row className="d-flex align-items-center min-vh-100">
                <Col md={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body className="">
                            <h2>Acese sua conta</h2>
                            <span className="mb-3">Insira suas credenciais para fazer o login</span>

                            <Form>
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
                                        type="text"
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