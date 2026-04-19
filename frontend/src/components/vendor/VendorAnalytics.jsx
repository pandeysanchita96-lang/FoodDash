import React, { useState, useEffect, useMemo, useCallback } from 'react';
import orderService from '../../services/orderService';
import { TrendingUp, ShoppingBag, BarChart2, DollarSign, Package, Calendar, ArrowUpRight, Target } from 'lucide-react';

const VendorAnalytics = ({ selectedMetric, isGlobal }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoverItem, setHoverItem] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = isGlobal
                ? await orderService.getAllOrders()
                : await orderService.getVendorOrders();
            setOrders(data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
        } catch (err) {
            console.error("Failed to fetch data for analytics", err);
        } finally {
            setLoading(false);
        }
    }, [isGlobal]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const metrics = useMemo(() => {
        const totalEarnings = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const avgOrderValue = orders.length ? totalEarnings / orders.length : 0;
        const totalItems = orders.reduce((sum, o) => sum + o.orderItems.length, 0);
        const totalOrders = orders.length;

        return {
            totalEarnings,
            avgOrderValue,
            totalItems,
            totalOrders
        };
    }, [orders]);

    if (loading) {
        return (
            <div style={{ padding: '100px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div className="analytics-loader" />
                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    QUANTIFYING PERFORMANCE...
                </div>
                <style>{`
                    .analytics-loader {
                        width: 48px;
                        height: 48px;
                        border: 3px solid var(--primary-light);
                        border-top-color: var(--primary);
                        border-radius: 50%;
                        animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    const groupByDate = (data, valueExtractor) => {
        const groups = {};
        data.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            groups[date] = (groups[date] || 0) + valueExtractor(order);
        });
        return Object.entries(groups).map(([date, value]) => ({ date, value }));
    };

    const renderPremiumLineChart = (data, color, gradientId) => {
        if (data.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
                    <BarChart2 size={64} strokeWidth={1} style={{ marginBottom: '20px', opacity: 0.2 }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Waiting for platform data...</p>
                </div>
            );
        }

        const maxValue = Math.max(...data.map(d => d.value)) * 1.2 || 100;
        const height = 320;
        const width = 800;
        const padding = 60;

        const getX = (i) => padding + (i * ((width - padding * 2) / Math.max(1, data.length - 1)));
        const getY = (v) => height - padding - ((v / maxValue) * (height - padding * 2));

        let points = "";

        if (data.length === 1) {
            const y = getY(data[0].value);
            points = `${padding},${y} ${width - padding},${y}`;
        } else {
            points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
        }

        // Generate bezier curve path
        let curvePath = "";
        if (data.length > 1) {
            curvePath = `M ${getX(0)} ${getY(data[0].value)}`;
            for (let i = 0; i < data.length - 1; i++) {
                const x1 = getX(i);
                const y1 = getY(data[i].value);
                const x2 = getX(i + 1);
                const y2 = getY(data[i + 1].value);
                const cx = (x1 + x2) / 2;
                curvePath += ` C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
            }
        }

        return (
            <div style={{ position: 'relative' }}>
                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(p => (
                        <g key={p}>
                            <line
                                x1={padding}
                                y1={height - padding - (p * (height - padding * 2))}
                                x2={width - padding}
                                y2={height - padding - (p * (height - padding * 2))}
                                stroke="var(--border)"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            <text
                                x={padding - 10}
                                y={height - padding - (p * (height - padding * 2))}
                                textAnchor="end"
                                alignmentBaseline="middle"
                                fontSize="11"
                                fill="var(--text-muted)"
                                fontWeight="700"
                            >
                                {Math.round(p * maxValue)}
                            </text>
                        </g>
                    ))}

                    {/* Smooth Area */}
                    {data.length > 1 && (
                        <path
                            d={`${curvePath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
                            fill={`url(#${gradientId})`}
                            style={{ transition: 'all 1s ease' }}
                        />
                    )}

                    {/* Smooth Line */}
                    {data.length > 1 ? (
                        <path
                            d={curvePath}
                            fill="none"
                            stroke={color}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#glow)"
                            style={{ strokeDasharray: 2000, strokeDashoffset: 0, animation: 'drawPath 2s ease-out forward' }}
                        />
                    ) : (
                        <polyline points={points} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
                    )}

                    {/* Interactive Points */}
                    {data.map((d, i) => {
                        const x = data.length === 1 ? width / 2 : getX(i);
                        const y = getY(d.value);
                        const isHovered = hoverItem === i;

                        return (
                            <g
                                key={i}
                                onMouseEnter={() => setHoverItem(i)}
                                onMouseLeave={() => setHoverItem(null)}
                                style={{ cursor: 'pointer' }}
                            >
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={isHovered ? 8 : 5}
                                    fill={isHovered ? color : "white"}
                                    stroke={color}
                                    strokeWidth="3"
                                    style={{ transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                                />
                                <text
                                    x={x}
                                    y={height - 25}
                                    textAnchor="middle"
                                    fontSize="11"
                                    fill={isHovered ? "var(--text-main)" : "var(--text-muted)"}
                                    fontWeight="800"
                                    style={{ transition: 'all 0.2s' }}
                                >
                                    {d.date}
                                </text>

                                {isHovered && (
                                    <g>
                                        <rect
                                            x={x - 40}
                                            y={y - 45}
                                            width="80"
                                            height="30"
                                            rx="8"
                                            fill="rgba(0,0,0,0.8)"
                                            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
                                        />
                                        <text
                                            x={x}
                                            y={y - 25}
                                            textAnchor="middle"
                                            fontSize="14"
                                            fontWeight="800"
                                            fill="white"
                                        >
                                            {selectedMetric === 'earnings' ? `₹${d.value.toLocaleString()}` : d.value}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>
                <style>{`
                    @keyframes drawPath {
                        from { stroke-dashoffset: 2000; }
                        to { stroke-dashoffset: 0; }
                    }
                `}</style>
            </div>
        );
    };

    const renderPremiumBarChart = (data, color) => {
        if (data.length === 0) return null;

        const maxValue = Math.max(...data.map(d => d.value)) * 1.1 || 1;
        const height = 280;
        const width = 800;
        const padding = 60;
        const barWidth = Math.min(50, (width - padding * 2) / data.length * 0.6);

        return (
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="premiumBarGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} />
                        <stop offset="100%" stopColor={color} stopOpacity="0.5" />
                    </linearGradient>
                </defs>

                {data.map((d, i) => {
                    const barHeight = (d.value / maxValue) * (height - padding * 2);
                    const x = padding + (i * ((width - padding * 2) / data.length)) + ((width - padding * 2) / data.length - barWidth) / 2;
                    const y = height - padding - barHeight;
                    const isHovered = hoverItem === i;

                    return (
                        <g
                            key={i}
                            onMouseEnter={() => setHoverItem(i)}
                            onMouseLeave={() => setHoverItem(null)}
                            style={{ cursor: 'pointer' }}
                        >
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                stroke="var(--border)"
                                style={{
                                    opacity: isHovered ? 1 : 0.85,
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    filter: isHovered ? 'drop-shadow(0 4px 12px ' + color + '60)' : 'none',
                                    transform: isHovered ? `scaleY(1.05)` : 'scaleY(1)',
                                    transformOrigin: `0 ${height - padding}px`
                                }}
                            />
                            <text x={x + barWidth / 2} y={height - 25} textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontWeight="800">
                                {d.label}
                            </text>
                            <text
                                x={x + barWidth / 2}
                                y={y - 12}
                                textAnchor="middle"
                                fontSize="14"
                                fontWeight="900"
                                fill={isHovered ? color : "var(--text-main)"}
                                style={{ transition: 'all 0.3s' }}
                            >
                                {d.value}
                            </text>
                        </g>
                    );
                })}
            </svg>
        );
    };

    let chartContent;
    let title;
    let description;
    let MainIcon;
    let themeColor;

    if (selectedMetric === 'earnings' || selectedMetric === 'ALL') {
        const earningsData = groupByDate(orders, o => o.totalAmount);
        title = "REVENUE ARCHITECTURE";
        description = "Monetary flow analysis across active timelines.";
        MainIcon = DollarSign;
        themeColor = "#FF3366";
        chartContent = renderPremiumLineChart(earningsData, themeColor, 'earningsPremium');
    } else if (selectedMetric === 'orders') {
        const ordersData = groupByDate(orders, o => 1);
        title = "TRAFFIC VELOCITY";
        description = "Consumer order density and throughput.";
        MainIcon = ShoppingBag;
        themeColor = "#33CCFF";
        chartContent = renderPremiumLineChart(ordersData, themeColor, 'ordersPremium');
    } else {
        const statusCounts = orders.reduce((acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
        }, {});
        const statusData = Object.entries(statusCounts).map(([label, value]) => ({ label, value }));

        title = "STATUS ECOSYSTEM";
        description = "Systemic distribution of active processes.";
        MainIcon = Target;
        themeColor = "#00FFAB";
        chartContent = renderPremiumBarChart(statusData, themeColor);
    }

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
                {/* Left Side: Main Chart */}
                <div style={{
                    background: 'var(--card-bg)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    borderRadius: '32px',
                    border: '1px solid var(--border)',
                    padding: '40px',
                    boxShadow: 'var(--shadow-xl)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-100px',
                        width: '300px',
                        height: '300px',
                        background: `${themeColor}15`,
                        filter: 'blur(80px)',
                        borderRadius: '50%',
                        zIndex: 0
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '20px',
                                    background: `linear-gradient(135deg, ${themeColor}25, ${themeColor}10)`,
                                    border: `1px solid ${themeColor}40`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: themeColor,
                                    boxShadow: `0 8px 16px ${themeColor}15`
                                }}>
                                    <MainIcon size={32} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 style={{
                                        fontSize: '1.4rem',
                                        fontWeight: '900',
                                        color: 'var(--text-main)',
                                        margin: 0,
                                        letterSpacing: '0.1em',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        {title}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '4px 0 0', fontWeight: '500' }}>
                                        {description}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    background: 'var(--primary-light)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.8rem',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    letterSpacing: '0.05em'
                                }}>
                                    <Calendar size={14} /> LAST 30 DAYS
                                </div>
                            </div>
                        </div>

                        <div style={{ minHeight: '300px' }}>
                            {chartContent}
                        </div>
                    </div>
                </div>

                {/* Right Side: Key Insights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card-mini" style={{
                        background: 'var(--card-bg)',
                        padding: '28px',
                        borderRadius: '28px',
                        border: '1px solid rgba(255, 51, 102, 0.2)',
                        boxShadow: 'var(--shadow-lg)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #FF3366 10%, transparent 80%)',
                            opacity: 0.1,
                            zIndex: 0
                        }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>GROSS REVENUE</span>
                            <div style={{ color: '#FF3366', background: 'rgba(255, 51, 102, 0.1)', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '800' }}>
                                <TrendingUp size={12} /> +12.5%
                            </div>
                        </div>
                        <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em', position: 'relative', zIndex: 1 }}>
                            ₹{metrics.totalEarnings.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500', position: 'relative', zIndex: 1 }}>
                            Total processed volume
                        </div>
                    </div>

                    <div className="glass-card-mini" style={{
                        background: 'var(--card-bg)',
                        padding: '28px',
                        borderRadius: '28px',
                        border: '1px solid rgba(51, 204, 255, 0.2)',
                        boxShadow: 'var(--shadow-lg)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>AVG. TICKET SIZE</span>
                            <ArrowUpRight size={18} color="#33CCFF" style={{ opacity: 0.8 }} />
                        </div>
                        <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                            ₹{metrics.avgOrderValue.toFixed(0)}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>
                            Yield per individual order
                        </div>
                    </div>

                    <div className="glass-card-mini" style={{
                        background: 'var(--card-bg)',
                        padding: '28px',
                        borderRadius: '28px',
                        border: '1px solid rgba(0, 255, 171, 0.2)',
                        boxShadow: 'var(--shadow-lg)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>ITEM THROUGHPUT</span>
                            <Package size={18} color="#00FFAB" style={{ opacity: 0.8 }} />
                        </div>
                        <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                            {metrics.totalItems}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>
                            Total inventory distributed
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .glass-card-mini {
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s, border-color 0.3s;
                    cursor: default;
                }
                .glass-card-mini:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-xl);
                    border-color: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
};

export default VendorAnalytics;
