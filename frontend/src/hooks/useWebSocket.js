import { useEffect, useRef, useCallback, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useWebSocket = (topics = [], onNewOrder) => {
    const clientRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    const connect = useCallback(() => {
        if (!topics || topics.length === 0) return;

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                console.log('[WebSocket]', str);
            },
            onConnect: () => {
                console.log('[WebSocket] Connected to topics:', topics);
                setIsConnected(true);

                // Subscribe to each provided topic
                topics.forEach(topic => {
                    client.subscribe(topic, (message) => {
                        try {
                            const data = JSON.parse(message.body);
                            console.log(`[WebSocket] New message from ${topic}:`, data);
                            if (onNewOrder) {
                                onNewOrder(data);
                            }
                        } catch (err) {
                            console.error('[WebSocket] Error parsing message:', err);
                        }
                    });
                });
            },
            onDisconnect: () => {
                console.log('[WebSocket] Disconnected');
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error('[WebSocket] STOMP error:', frame);
            }
        });

        client.activate();
        clientRef.current = client;
    }, [JSON.stringify(topics), onNewOrder]);

    const disconnect = useCallback(() => {
        if (clientRef.current) {
            clientRef.current.deactivate();
            clientRef.current = null;
            setIsConnected(false);
        }
    }, []);

    useEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    return { isConnected, disconnect, reconnect: connect };
};

export default useWebSocket;
