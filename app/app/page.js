"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';

import * as Icon from 'react-bootstrap-icons';
import { Form, Button, Row, Container, Card, Col, InputGroup } from 'react-bootstrap';

import * as yup from 'yup';
import * as formik from 'formik';

export default function Home() {
    const { Formik } = formik;

    const router = useRouter();
    const { showToast } = useToast();
    const { login, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const schema = yup.object().shape({
        username: yup.string().required('Informe o nome do seu usuário.'),
        password: yup.string().required('Informe sua senha.'),
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/');
        }
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (values) => {
        const { username, password } = values;

        try {
            await login(username, password);
            router.push('/dashboard');
            showToast({
                title: 'Sucesso!',
                message: 'Login feito com sucesso!',
                type: 'success',
                icon: <Icon.Check2 className="me-2" />
            });
        } catch (err) {
            showToast({
                title: 'Erro',
                message: err.message,
                type: 'danger',
                icon: <Icon.XCircleFill className="me-2" />
            });
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
                            <Card.Title className="mb-5">
                                <h2>Acese sua conta</h2>
                                <small>Insira suas credenciais para fazer o login</small>
                            </Card.Title>

                            <Formik
                                validationSchema={schema}
                                onSubmit={handleSubmit}
                                initialValues={{
                                    username: '',
                                    password: ''
                                }}
                            >
                                {({ handleSubmit, handleChange, values, errors }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Usuário</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                placeholder="Usuário"
                                                value={values.username}
                                                onChange={handleChange}
                                                isInvalid={!!errors.username}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.username}
                                            </Form.Control.Feedback>
                                        </Form.Group>

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

                                        <Button variant="outline-dark" type="submit" className="w-100">
                                            Acessar
                                            <Icon.ArrowRight className="ms-2" />
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </Card.Body>
                        <Card.Footer
                            className="text-muted text-center cursor-pointer"
                            onClick={() => router.push('/register')}
                            style={{ padding: 15 }}
                        >
                            <span className="text-primary">Criar uma nova conta</span>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}