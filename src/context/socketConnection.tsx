"use client"
import { createContext, useContext, useEffect, useState } from "react";
// import { connectSocket } from "../lib/connectSocket";
import { Socket } from "socket.io-client";
import { presenseConnection } from "../lib/connectSocket";

type UserStatusType = {
    userId: string;
    status: string;
}

type ContextType = {
    // connected: boolean;
    presenseSocket: Socket;
    userStatuses: Record<string, UserStatusType["status"]>;
}

const SocketContext = createContext<ContextType | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    // console.log("context :",context);

    if (!context) {
        throw new Error("Use Socket Context !!")
    }
    return context
}

export const SocketProvider = ({ children, isToken, userId }: { children: React.ReactNode, isToken: boolean, userId?: string }) => {

    // const socket = connectSocket();

    // const [connected, setConnected] = useState(connectSocket.connected);

    const [userStatuses, setUserStatuses] = useState<Record<string, UserStatusType["status"]>>({});

    useEffect(() => {
      console.log("establishing socket connection")

        if (!isToken) {
            presenseConnection.disconnect();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUserStatuses({});
            return;
        }



        const onConnect = () => {
            console.log("CONNECTED", presenseConnection.id);

            presenseConnection.emit("user:online", { userId })
            // setConnected(true);
        };

        const onDisconnect = () => {
            console.log("DISCONNECTED");
            // setConnected(false);
        };

        const onConnectError = (error: Error) => {
            console.log("SOCKET CONNECTION ERROR:", error.message);
            // setConnected(false);
        };

        const handlePrevUserStatus = (data: string[]) => {
            const statuses:Record<string,"online"|"offline">={};
           data.forEach(userId => {
        statuses[userId]="online";
           });

           setUserStatuses(statuses);

        };

        const handleUserStatus = (data: UserStatusType) => {
            setUserStatuses((prev) => ({
                ...prev,
                [data.userId]: data.status
            }))
        };


        presenseConnection.on("connect", onConnect);


        const heartBeatInterval = setInterval(() => {
            if (presenseConnection.connected) {
                presenseConnection.emit("user:heartBeat", {
                    userId
                });
            }
        }, 5000)


        presenseConnection.on("initial:users", handlePrevUserStatus);


        presenseConnection.on("user:status", handleUserStatus);

        presenseConnection.on('disconnect', onDisconnect);
        presenseConnection.on("connect_error", onConnectError);

        if (!presenseConnection.connected) {
            presenseConnection.connect();
        }

        return () => {
            clearInterval(heartBeatInterval);
            presenseConnection.off("connect", onConnect);
            presenseConnection.off('disconnect', onDisconnect);
            presenseConnection.off("connect_error", onConnectError);
            presenseConnection.off("user:status", handleUserStatus);
            // socket.disconnect();
        }

    }, [isToken, userId])

    return <SocketContext.Provider value={{ presenseSocket: presenseConnection, userStatuses }}>
        {children}
    </SocketContext.Provider>

}