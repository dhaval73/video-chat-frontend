import { useMemo, useEffect } from 'react';
import { SocketContext } from './socket';
import { io } from 'socket.io-client';

function SocketProvider({ children }) {
    const socket = useMemo(() => io(import.meta.env.VITE_SERVER_URL,{
        // transports: ['websocket'], // Match the transports
        withCredentials: true
    }), []);

    useEffect(() => {
        // Handle socket events
        socket.connect()
        socket.on('connect', () => {
            console.log('Connected to socket server:', socket.id);
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected from socket server:', reason);
        });

        // Cleanup on unmount
        return () => {
            socket.disconnect();
            console.log('Socket disconnected and cleaned up.');
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;
