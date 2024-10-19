'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, Row, Col, Button, Form, InputGroup, Image } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import moment from 'moment';
import md5 from 'md5';

export default function Chat({ logged, onlines, messages, userActive, handleSendMessage }) {
    const [message, setMessage] = useState('');

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleEnterKeyPress = async (e) => {
        if (e.key === 'Enter') {
            handleSendMessage(message);
            setTimeout(() => setMessage(''), 10);
        }
    }

    return (
        <>
            <div className="flex-grow-1">
                <Row className="mb-2">
                    <Col xs={1} className="d-flex flex-column justify-content-center">
                        <Image src={`https://www.gravatar.com/avatar/${md5(userActive.username)}?d=identicon`} roundedCircle fluid />
                    </Col>
                    <Col xs={11}>
                        <span><Icon.CircleFill className={onlines.indexOf(userActive.id) >= 0 ? 'text-success' : 'text-danger'} /> {userActive.name}</span><br />
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
                            {messages.map(message => (
                                <Row key={message._id} className="mb-2">
                                    <Col className={
                                        `d-flex ${message.sender == logged.id ? 'justify-content-end text-end' : ''}`
                                    }>
                                        <Card className={`${message.sender == logged.id ? 'bg-primary text-light' : ''}`}>
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
                    value={message}
                    placeholder="Mensagem..."
                    aria-describedby="send-message"
                    style={{ resize: 'none' }}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleEnterKeyPress}
                />
                <Button variant="outline-primary" id="send-message" onClick={() => handleSendMessage(message) && setMessage('')}>
                    <Icon.SendFill className="ms-2 me-2 fs-3" />
                </Button>
            </InputGroup>
        </>
    );
}
