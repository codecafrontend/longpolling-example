import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { sortMessages } from "./lib";

export type Message = {
    user: string;
    text: string;
    timestamp: string;
};

export const useMessages = () => {
    const { user } = useContext(UserContext);

    const [messages, setMessages] = useState<Message[]>([]);

    const longPoll = useCallback(async () => {
        try {
            const response = await fetch(
                `http://localhost:8001/poll?user=${user}`,
            );
            const newMessages = (await response.json()) as Message[];

            setMessages((list) => [...list, ...newMessages]);

            longPoll();
        } catch {
            setTimeout(longPoll, 2000);
        }
    }, [user]);

    useEffect(() => {
        longPoll();
    }, [longPoll]);

    const sendMessage = useCallback(
        (text: string) => {
            const message: Message = {
                user,
                text,
                timestamp: new Date().toISOString(),
            };

            void fetch("http://localhost:8001/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message, user }),
            });

            setMessages((list) => [...list, message]);
        },
        [user],
    );

    return {
        messages: sortMessages(messages),
        sendMessage,
    };
};
