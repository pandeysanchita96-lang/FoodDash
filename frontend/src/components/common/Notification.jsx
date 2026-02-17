import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Notification = ({ message, type, onClose }) => {
    const config = {
        success: {
            icon: <CheckCircle size={20} color="#10B981" />,
            bgColor: '#ECFDF5',
            borderColor: '#10B981',
            textColor: '#065F46'
        },
        error: {
            icon: <XCircle size={20} color="#EF4444" />,
            bgColor: '#FEF2F2',
            borderColor: '#EF4444',
            textColor: '#991B1B'
        },
        info: {
            icon: <Info size={20} color="#3B82F6" />,
            bgColor: '#EFF6FF',
            borderColor: '#3B82F6',
            textColor: '#1E40AF'
        }
    };

    const style = config[type] || config.info;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            style={{
                pointerEvents: 'auto',
                minWidth: '300px',
                maxWidth: '450px',
                backgroundColor: style.bgColor,
                borderLeft: `4px solid ${style.borderColor}`,
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'relative'
            }}
        >
            <div style={{ flexShrink: 0 }}>
                {style.icon}
            </div>
            <div style={{
                color: style.textColor,
                fontSize: '14px',
                fontWeight: '600',
                lineHeight: '1.4',
                flex: 1
            }}>
                {message}
            </div>
            <button
                onClick={onClose}
                style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: style.textColor,
                    opacity: 0.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '0.5'}
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default Notification;
