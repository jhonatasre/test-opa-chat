'use client';

import { Form, Button, Row, Container, Card, Col, ListGroup, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from '../components/PrivateRoute';
import { useEffect, useState } from 'react';

export default function Chat() {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:3001/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!res.ok) {
                throw new Error('Erro ao buscar usuários');
            }

            const usersData = await res.json();
            setUsers(usersData);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <PrivateRoute>
            <Container>
                <Row>
                    <Col md={4}>
                        <Button onClick={() => logout()}>Sair</Button>
                        <ListGroup>
                            {users.map((user) => (
                                <ListGroup.Item>{user.name}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={8}>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Mensagem..."
                                aria-describedby="send-message"
                            />
                            <Button variant="outline-secondary" id="send-message">
                                Enviar
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
        </PrivateRoute>
    );
}