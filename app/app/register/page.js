"use client";

import { Form, Button, Row, Container, Card, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Register() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/chat');
        }
    }, [isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    username,
                    password
                }),
            });

            // const data = await res.json();

            if (res.ok) {
                router.push('/');
                // setResponse(`Sucesso: ${data.message}`);
            } else {
                // setResponse(`Erro: ${data.error}`);
            }
        } catch (error) {
            // setResponse(`Erro: ${error.message}`);
        }
    }

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
                            <Card.Title className="mb-5">
                                <h2>Cadastre-se</h2>
                            </Card.Title>

                            <Form onSubmit={handleSubmit} method="POST">
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder="Nome"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Usuário</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Usuário"
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Senha</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                placeholder="Senha"
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Confirme a Senha</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password_confirm"
                                                placeholder="Confirme a Senha"
                                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>


                                <Button variant="outline-dark" type="submit" className="w-100">
                                    Enviar
                                </Button>
                            </Form>
                        </Card.Body>
                        <Card.Footer
                            className="text-muted text-center"
                            onClick={() => router.push('/')}
                            style={{ padding: 15, cursor: 'pointer' }}
                        >
                            Já possuo cadastro
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}