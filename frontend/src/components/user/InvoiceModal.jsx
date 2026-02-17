import { X, Printer, Download, MapPin, Phone, Mail, Calendar, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';

const InvoiceModal = ({ order, onClose }) => {
    if (!order) return null;

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const subtotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05; // 5% GST example
    const deliveryFee = 0.99;
    const total = subtotal + tax + deliveryFee;

    return (
        <AnimatePresence>
            <div style={styles.overlay}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    style={styles.modal}
                    className="invoice-print-area"
                >
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={styles.branding}>
                            <div style={styles.logo}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="#EB1700"><path d="M21.5 11.2c-.1-.5-.4-.9-.8-1.2L13 3.5c-.6-.5-1.4-.5-2 0L3.3 10c-.4.3-.7.7-.8 1.2-.1.5 0 1 .3 1.4l7.7 6.5c.3.3.7.4 1.1.4.4 0 .8-.1 1.1-.4l7.7-6.5c.3-.4.5-.9.4-1.4z" /></svg>
                                <span style={styles.logoText}>FoodDash</span>
                            </div>
                            <div style={styles.invoiceTitle}>INVOICE</div>
                        </div>

                        <div style={styles.controls} className="no-print">
                            <button onClick={handlePrint} style={styles.controlBtn}>
                                <Printer size={18} /> Print
                            </button>
                            <button onClick={onClose} style={styles.closeBtn}>
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Invoice Body */}
                    <div style={styles.body}>
                        <div style={styles.topInfo}>
                            <div style={styles.infoBlock}>
                                <h4 style={styles.label}>VENDOR</h4>
                                <div style={styles.valueBold}>{order.vendor.businessName}</div>
                                <div style={styles.value}>{order.vendor.address}</div>
                                <div style={styles.value}>{order.vendor.phone}</div>
                            </div>
                            <div style={styles.infoBlock}>
                                <h4 style={styles.label}>CUSTOMER</h4>
                                <div style={styles.valueBold}>{order.user.name}</div>
                                <div style={styles.value}>{order.deliveryAddress}</div>
                                <div style={styles.value}>{order.user.phone || 'N/A'}</div>
                            </div>
                            <div style={styles.infoBlock}>
                                <h4 style={styles.label}>ORDER DETAILS</h4>
                                <div style={styles.detailRow}>
                                    <span>Order ID:</span>
                                    <strong>#{order.id}</strong>
                                </div>
                                <div style={styles.detailRow}>
                                    <span>Date:</span>
                                    <strong>{formatDate(order.createdAt)}</strong>
                                </div>
                                <div style={styles.detailRow}>
                                    <span>Status:</span>
                                    <strong style={{ color: '#4CAF50' }}>{order.status}</strong>
                                </div>
                                {order.transactionId && (
                                    <div style={styles.detailRow}>
                                        <span>Txn ID:</span>
                                        <span style={{ fontSize: '0.75rem' }}>{order.transactionId}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeader}>
                                    <th style={{ ...styles.th, textAlign: 'left' }}>Item Description</th>
                                    <th style={styles.th}>Qty</th>
                                    <th style={styles.th}>Price</th>
                                    <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.orderItems.map((item, index) => (
                                    <tr key={index} style={styles.tr}>
                                        <td style={{ ...styles.td, textAlign: 'left' }}>
                                            <div style={styles.itemName}>{item.item.name}</div>
                                            <div style={styles.itemCategory}>{item.item.category}</div>
                                        </td>
                                        <td style={styles.td}>{item.quantity}</td>
                                        <td style={styles.td}>₹{item.price.toFixed(2)}</td>
                                        <td style={{ ...styles.td, textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Summary */}
                        <div style={styles.summaryContainer}>
                            <div style={styles.summaryLine}>
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div style={styles.summaryLine}>
                                <span>GST (5%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <div style={styles.summaryLine}>
                                <span>Delivery Fee</span>
                                <span>₹{deliveryFee.toFixed(2)}</span>
                            </div>
                            <div style={{ ...styles.summaryLine, ...styles.totalLine }}>
                                <span>Total Amount</span>
                                <span>₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={styles.footer}>
                            <div style={styles.thankYou}>Thank you for ordering with FoodDash!</div>
                            <div style={styles.disclaimer}>This is a computer generated invoice and does not require a physical signature.</div>
                        </div>
                    </div>
                </motion.div>

                <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    .invoice-print-area { 
                        position: absolute; 
                        top: 0; 
                        left: 0; 
                        width: 100% !important; 
                        max-width: none !important; 
                        box-shadow: none !important; 
                        border: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    @page { margin: 1.5cm; }
                }
            `}</style>
            </div>
        </AnimatePresence>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    modal: {
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        backgroundColor: 'white',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        color: '#1a1a1a',
        fontFamily: "'Inter', sans-serif"
    },
    header: {
        padding: '32px 40px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fcfcfc'
    },
    branding: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    logoText: {
        fontSize: '1.5rem',
        fontWeight: '900',
        color: '#EB1700',
        letterSpacing: '-0.5px'
    },
    invoiceTitle: {
        fontSize: '0.75rem',
        fontWeight: '800',
        color: '#666',
        letterSpacing: '3px',
        marginTop: '8px'
    },
    controls: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
    },
    controlBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        borderRadius: '12px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        color: '#444',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    closeBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#999',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px'
    },
    body: {
        padding: '40px',
        overflowY: 'auto',
        flex: 1
    },
    topInfo: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '32px',
        marginBottom: '48px'
    },
    infoBlock: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    label: {
        fontSize: '0.7rem',
        fontWeight: '800',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        margin: '0 0 8px 0'
    },
    valueBold: {
        fontSize: '1.1rem',
        fontWeight: '800',
        color: '#1a1a1a'
    },
    value: {
        fontSize: '0.9rem',
        color: '#666',
        lineHeight: 1.4
    },
    detailRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.9rem',
        marginBottom: '4px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '40px'
    },
    tableHeader: {
        borderBottom: '2px solid #1a1a1a'
    },
    th: {
        padding: '12px 16px',
        fontSize: '0.85rem',
        fontWeight: '800',
        color: '#1a1a1a',
        backgroundColor: '#f9f9f9'
    },
    td: {
        padding: '20px 16px',
        fontSize: '0.95rem',
        color: '#444',
        borderBottom: '1px solid #eee',
        textAlign: 'center'
    },
    itemName: {
        fontWeight: '700',
        color: '#1a1a1a'
    },
    itemCategory: {
        fontSize: '0.75rem',
        color: '#999',
        marginTop: '2px'
    },
    summaryContainer: {
        marginLeft: 'auto',
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    summaryLine: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '1rem',
        color: '#666'
    },
    totalLine: {
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '2px solid #EB1700',
        color: '#EB1700',
        fontWeight: '900',
        fontSize: '1.3rem'
    },
    footer: {
        marginTop: '60px',
        paddingTop: '32px',
        borderTop: '1px solid #eee',
        textAlign: 'center'
    },
    thankYou: {
        fontSize: '1.1rem',
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: '8px'
    },
    disclaimer: {
        fontSize: '0.8rem',
        color: '#999'
    }
};

export default InvoiceModal;
