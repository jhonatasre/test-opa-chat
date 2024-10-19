import * as Icon from 'react-bootstrap-icons';
import { Toast, ToastContainer } from 'react-bootstrap';
import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const defaultToastData = {
        show: false,
        title: '',
        message: '',
        delay: 5000,
        type: 'default',
        icon: <Icon.SquareFill className="me-2" />
    };

    const [toastData, setToastData] = useState(defaultToastData);

    const resetToastData = () => setToastData(defaultToastData);

    const showToast = ({ title, message, type = 'default', delay = 5000, icon = <Icon.SquareFill className="me-2" /> }) => {
        setToastData({
            show: true,
            title,
            message,
            delay,
            type,
            icon
        });

        setTimeout(resetToastData, delay);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer position="top-end" className="p-3">
                <Toast
                    onClose={resetToastData}
                    show={toastData.show}
                    delay={toastData.delay}
                    bg={toastData.type}
                    autohide
                >
                    <Toast.Header>
                        {toastData.icon}
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