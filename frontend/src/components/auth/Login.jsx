import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { Mail, Lock, Sparkles } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({ email, password });
            console.log('Login successful:', response);

            const user = authService.getCurrentUser();
            if (user?.role === 'VENDOR') {
                navigate('/vendor/dashboard');
            } else if (user?.role === 'USER') {
                navigate('/user');
            } else if (user?.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Decorative Background Elements */}
            <div style={styles.bubble1}></div>
            <div style={styles.bubble2}></div>
            <div style={styles.bubble3}></div>

            <div style={{ ...styles.card, animation: 'cardEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.logoContainer}>
                        <Sparkles size={32} color="#E63946" />
                    </div>
                    <h1 style={styles.title}>Welcome Back</h1>
                    <p style={styles.subtitle}>Sign in to continue to FoodDash</p>
                </div>

                {/* Form */}
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

                    {/* Password */}
                    <div style={styles.inputGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={styles.label}>Password</label>
                            <span
                                onClick={() => navigate('/forgot-password')}
                                style={{ ...styles.link, fontSize: '13px' }}
                            >
                                Forgot password?
                            </span>
                        </div>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.icon} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    {/* Register Link */}
                    <div style={styles.footer}>
                        Don't have an account?{' '}
                        <span
                            onClick={() => navigate('/register')}
                            style={styles.link}
                        >
                            Create one
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #0f172a, #1E293B, #E63946, #1E293B)',
        backgroundSize: '400% 400%',
        animation: 'meshGradient 15s ease infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden'
    },
    bubble1: {
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'rgba(230, 57, 70, 0.1)',
        borderRadius: '50%',
        top: '-100px',
        left: '-100px',
        filter: 'blur(80px)',
        animation: 'float 20s infinite ease-in-out'
    },
    bubble2: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'rgba(69, 123, 157, 0.1)',
        borderRadius: '50%',
        bottom: '-150px',
        right: '-100px',
        filter: 'blur(100px)',
        animation: 'float 25s infinite ease-in-out reverse'
    },
    bubble3: {
        position: 'absolute',
        width: '200px',
        height: '200px',
        background: 'rgba(230, 57, 70, 0.05)',
        borderRadius: '50%',
        top: '40%',
        right: '15%',
        filter: 'blur(50px)',
        animation: 'float 15s infinite ease-in-out'
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '32px',
        padding: '48px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.1)'
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
        margin: 0
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    error: {
        padding: '12px 16px',
        background: '#FEE2E2',
        color: '#DC2626',
        borderRadius: '8px',
        fontSize: '14px',
        border: '1px solid #FECACA'
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
        transition: 'all 0.2s',
        marginTop: '8px'
    },
    footer: {
        textAlign: 'center',
        fontSize: '14px',
        color: '#64748B'
    },
    link: {
        color: '#E63946',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none'
    }
};

// Add focus styles via CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes meshGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
    }
    @keyframes cardEntrance {
        from { 
            opacity: 0; 
            transform: translateY(30px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
    input:focus {
        border-color: #E63946 !important;
        box-shadow: 0 0 0 4px rgba(230, 57, 70, 0.1) !important;
        transform: translateY(-1px);
    }
    button:hover:not(:disabled) {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 12px 25px rgba(230, 57, 70, 0.4);
    }
    button:active:not(:disabled) {
        transform: translateY(0) scale(0.98);
    }
`;
document.head.appendChild(styleSheet);

export default Login;
