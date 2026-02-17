import React, { createContext, useState, useContext, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Notification from '../components/common/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newNotification = { id, message, type };

        setNotifications((prev) => [...prev, newNotification]);

        if (duration !== Infinity) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div style={{
                position: 'fixed',
                top: '24px',
                right: '24px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                pointerEvents: 'none'
            }}>
                <AnimatePresence>
                    {notifications.map((notification) => (
                        <Notification
                            key={notification.id}
                            {...notification}
                            onClose={() => removeNotification(notification.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};
