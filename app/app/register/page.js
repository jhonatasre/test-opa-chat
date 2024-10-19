"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

import { Form, Button, Row, Container, Card, Col, InputGroup } from 'react-bootstrap';

import * as yup from 'yup';
import * as formik from 'formik';
import * as Icon from 'react-bootstrap-icons';
import * as api from '../services/apiService';

export default function Register() {
    const { Formik } = formik;

    const { showToast } = useToast();
    const { isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePsswordConfirmVisibility = () => {
        setShowPasswordConfirm(!showPasswordConfirm);
    };

    const router = useRouter();

    const schema = yup.object().shape({
        name: yup.string().required('Nome é obrigatório.'),
        username: yup.string()
            .matches(/^[a-zA-Z0-9._-]+$/, 'Nome de usuário deve conter apenas letras, números, pontos, sublinhados e hífens.')
            .required('Nome de usuário é obrigatório.'),
        password: yup.string().required('Senha é obrigatória.'),
        password_confirm: yup.string()
            .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais.')
            .required('Confirmação de senha é obrigatória.'),
    });

    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/dashboard');
        }
    }, [isAuthenticated]);

    const handleSubmit = async (values) => {
        const { name, username, password } = values;

        try {
            const res = await api.post({
                endpoint: '/auth/register',
                body: { name, username, password },
            });

            if (res.ok) {
                router.push('/');
                return showToast({
                    title: 'Sucesso',
                    message: 'Cadastro feito com sucesso!',
                    type: 'success',
                    icon: <Icon.Check2 className="me-2" />
                });
            } else {
                const errorResponse = await res.json();
                const errorMessage = errorResponse.message || 'Erro ao cadastrar. Tente novamente!';

                return showToast({
                    title: 'Erro',
                    message: errorMessage,
                    type: 'danger',
                    icon: <Icon.XCircleFill className="me-2" />
                });
            }
        } catch (err) {
            return showToast({
                title: 'Erro',
                message: `Erro: ${err?.message}`,
                type: 'danger',
                icon: <Icon.XCircleFill className="me-2" />
            });
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

                            <Formik
                                validationSchema={schema}
                                onSubmit={handleSubmit}
                                initialValues={{
                                    name: '',
                                    username: '',
                                    password: '',
                                    passwordConfirm: ''
                                }}
                            >
                                {({ handleSubmit, handleChange, values, errors }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3" controlId="validationFormik01">
                                            <Form.Label>Nome</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                placeholder="Nome"
                                                value={values.name}
                                                onChange={handleChange}
                                                isInvalid={!!errors.name}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Nome de Usuário</Form.Label>
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

                                        <Row>
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
                                                    >
                                                        {showPasswordConfirm ? <Icon.EyeSlash /> : <Icon.Eye />}
                                                    </Button>
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.password_confirm}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Row>

                                        <Button variant="outline-dark" type="submit" className="w-100">
                                            Enviar
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </Card.Body>
                        <Card.Footer
                            className="text-muted text-center cursor-pointer"
                            onClick={() => router.push('/')}
                            style={{ padding: 15 }}
                        >
                            <span className="text-primary">Já possuo cadastro</span>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
