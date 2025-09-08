import { createContext, useContext, useRef, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import { loading } from "../utils/global.loading";
import { authService } from "../features/auth/auth.service";
import { store } from "../app/store";
import { login, logout } from "../features/auth/auth.slice";

type Namespace = 'caro' | 'line98';

interface SocketValue {
    getSocket: (ns: Namespace) => Socket | null;
    initSocket: (ns: Namespace, token: string) => Socket;
    on: (ns: Namespace, event: string, cb: (data: any) => void) => void;
    emit: (ns: Namespace, event: string, data?: any) => void;
    disconnect: (ns: Namespace) => void;
}

const SocketContext = createContext<SocketValue | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const sockets = useRef<Record<Namespace, Socket | null>>({
        'caro': null,
        'line98': null
    })

    const initSocket = (ns: Namespace, token: string) => {
        if (sockets.current[ns]) return sockets.current[ns]!;
        const socket = io(`${import.meta.env.VITE_SOCKET_URL}/${ns}`, { auth: { token: token } })
        socket.on('token.expired', async () => {
            try {
                loading.show();
                const refreshToken = store.getState().auth.refreshToken ?? '';
                const res = await authService.refresh(refreshToken);
                const newToken = res.accessToken;
                store.dispatch(login({ accessToken: newToken, refreshToken }));
                disconnect(ns);
                initSocket(ns, newToken);
                loading.hide();
            }
            catch (err: any) {
                console.log(err);
                socket.emit('error', { message: err.message ?? 'Something went wrong!!!' });
                loading.hide();
                disconnect(ns);
                store.dispatch(logout());
            }
        });

        sockets.current[ns] = socket;
        return socket;
    }

    const getSocket = (ns: Namespace) => sockets.current[ns];

    const on = (ns: Namespace, event: string, cb: (data: any) => void) => {
        sockets.current[ns]?.on(event, cb);
    };

    const emit = (ns: Namespace, event: string, data?: any) => {
        sockets.current[ns]?.emit(event, data);
    }

    const disconnect = (ns: Namespace) => {
        sockets.current[ns]?.disconnect();
        sockets.current[ns] = null;
    }

    return (<SocketContext.Provider value={{ initSocket, getSocket, on, emit, disconnect }}>
        {children}
    </SocketContext.Provider>)
}

export const useSocketContext = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error('useSocketManager must be inside provider');
    return ctx;
}