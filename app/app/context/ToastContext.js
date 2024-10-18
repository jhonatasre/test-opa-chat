import * as Icon from 'react-bootstrap-icons';
import { createContext, useContext, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toastData, setToastData] = useState({ show: false, message: '', title: '', delay: 3000, backgroud: 'light' });

    const showToast = (title, message, backgroud = 'light', delay = 3000) => {
        setToastData({ show: true, title, message, delay, backgroud });
        setTimeout(() => setToastData({ show: false, message: '', title: '', backgroud: 'light' }), delay);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer position="top-end" className="p-3">
                <Toast
                    onClose={() => setToastData({ show: false, message: '', title: '' })}
                    show={toastData.show}
                    delay={toastData.delay}
                    bg={toastData.backgroud}
                    autohide
                >
                    <Toast.Header>
                        <Icon.SquareFill className="me-2" />
                        <strong className="me-auto">{toastData.title}</strong>
                    </Toast.Header>
                    <Toast.Body>{toastData.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}