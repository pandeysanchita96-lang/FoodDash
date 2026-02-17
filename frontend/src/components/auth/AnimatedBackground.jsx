import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let dots = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initDots();
        };

        const initDots = () => {
            dots = [];
            const spacing = 50;
            const cols = Math.ceil(canvas.width / spacing) + 1;
            const rows = Math.ceil(canvas.height / spacing) + 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    dots.push({
                        baseX: i * spacing,
                        baseY: j * spacing,
                        x: i * spacing,
                        y: j * spacing,
                        radius: 2,
                    });
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            dots.forEach(dot => {
                const dx = mouseRef.current.x - dot.baseX;
                const dy = mouseRef.current.y - dot.baseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);
                    dot.x = dot.baseX - Math.cos(angle) * force * 30;
                    dot.y = dot.baseY - Math.sin(angle) * force * 30;
                } else {
                    dot.x += (dot.baseX - dot.x) * 0.1;
                    dot.y += (dot.baseY - dot.y) * 0.1;
                }

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
            zIndex: 0
        }}>
            {/* Dot Grid Canvas */}
            <canvas
                ref={canvasRef}
                style={{ position: 'absolute', inset: 0 }}
            />

            {/* Gradient Orbs */}
            <motion.div
                animate={{
                    x: [0, 60, 0],
                    y: [0, -40, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '15%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(230, 57, 70, 0.3) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none'
                }}
            />
            <motion.div
                animate={{
                    x: [0, -50, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.15, 1]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none'
                }}
            />
            <motion.div
                animate={{
                    x: [0, 40, 0],
                    y: [0, 60, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '25%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
                    filter: 'blur(50px)',
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
};

export default AnimatedBackground;
