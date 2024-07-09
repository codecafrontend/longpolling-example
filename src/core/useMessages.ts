import { useCallback, useContext, useEffect, useState } from 'react';
import { User, UserContext } from './UserContext';
import { sortMessages } from './lib';

export type Message = {
    user: User;
    text: string;
    timestamp: string;
};

export type UseMessagesProps = {
    onBeforeReceiveMessages?: () => void;
};

export const useMessages = ({ onBeforeReceiveMessages }: UseMessagesProps) => {
    const user = useContext(UserContext);

    const [messages, setMessages] = useState<Message[]>([]);

    const longPoll = useCallback(async () => {
        try {
            const response = await fetch(`/poll?userId=${user.id}`);
            const newMessages = (await response.json()) as Message[];

            onBeforeReceiveMessages?.();
            setMessages((list) => [...list, ...newMessages]);

            longPoll();
        } catch {
            setTimeout(longPoll, 2000);
        }
    }, [user, onBeforeReceiveMessages]);

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

            void fetch('/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
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
