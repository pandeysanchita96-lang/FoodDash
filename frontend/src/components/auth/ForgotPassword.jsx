import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { Mail, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await authService.forgotPassword(email);
            setMessage(response.message || 'If an account exists, a reset link has been sent.');
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Back Button */}
                <button
                    onClick={() => navigate('/login')}
                    style={styles.backButton}
                >
                    <ArrowLeft size={18} />
                    <span>Back to Login</span>
                </button>

                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.logoContainer}>
                        <Sparkles size={32} color="#E63946" />
                    </div>
                    <h1 style={styles.title}>Forgot Password?</h1>
                    <p style={styles.subtitle}>
                        {submitted
                            ? "Check your email for the temporary password"
                            : "Enter your email and we'll send you a temporary password"}
                    </p>
                </div>

                {submitted ? (
                    <div style={styles.successContainer}>
                        <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: '16px' }} />
                        <p style={styles.successText}>{message}</p>
                        <button
                            onClick={() => navigate('/login')}
                            style={styles.button}
                        >
                            Return to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        {error && (
                            <div style={styles.error}>
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <div style={styles.inputWrapper}>
                                <Mail size={18} style={styles.icon} />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.button,
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Sending...' : 'Send Temporary Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative'
    },
    backButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'none',
        border: 'none',
        color: '#64748B',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '0',
        marginBottom: '24px',
        transition: 'color 0.2s'
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px'
    },
    logoContainer: {
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #E63946, #FF6B6B)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#1E293B',
        margin: '0 0 8px 0'
    },
    subtitle: {
        fontSize: '14px',
        color: '#64748B',
        margin: 0,
        lineHeight: '1.5'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    error: {
        padding: '12px 16px',
        background: '#FEE2E2',
        color: '#DC2626',
        borderRadius: '8px',
        fontSize: '14px',
        border: '1px solid #FECACA'
    },
    successContainer: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    successText: {
        fontSize: '16px',
        color: '#1E293B',
        marginBottom: '24px',
        lineHeight: '1.6'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1E293B'
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    icon: {
        position: 'absolute',
        left: '14px',
        color: '#94A3B8',
        pointerEvents: 'none'
    },
    input: {
        width: '100%',
        padding: '12px 12px 12px 44px',
        fontSize: '15px',
        border: '2px solid #E2E8F0',
        borderRadius: '10px',
        outline: 'none',
        transition: 'all 0.2s',
        fontFamily: 'Inter, sans-serif',
        color: '#1E293B',
        background: 'white'
    },
    button: {
        width: '100%',
        padding: '14px',
        fontSize: '16px',
        fontWeight: '700',
        color: 'white',
        background: 'linear-gradient(135deg, #E63946, #FF6B6B)',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    }
};

// Add focus styles via CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    input:focus {
        border-color: #E63946 !important;
        box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.1) !important;
    }
    button:hover:not(:disabled) {
        transform: translateY(-2px);
    }
`;
document.head.appendChild(styleSheet);

export default ForgotPassword;
