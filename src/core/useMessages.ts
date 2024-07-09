import { useCallback, useContext, useEffect, useState } from 'react';
import { User, UserContext } from './UserContext';
import { sortMessages } from './lib';
import { nanoid } from 'nanoid';

export type Message = {
    id: string;
    user: User;
    text: string;
    timestamp: string;
};

export type UseMessagesProps = {
    onBeforeReceiveMessages?: () => void;
};

export const useMessages = ({ onBeforeReceiveMessages }: UseMessagesProps) => {
    const user = useContext(UserContext);

    const [messages, setMessages] = useState<Record<string, Message>>({});

    const updateMessages = useCallback((messagesList: Message[]) => {
        setMessages((state) => ({
            ...state,
            ...messagesList.reduce((acc, curr) => ({...acc, [curr.id]: curr}), {}),
        }));
    }, []);

    const loadHistory = useCallback(async () => {
        const response = await fetch('/history');
        const history = (await response.json()) as Message[];
        updateMessages(history);
    }, [updateMessages]);

    const longPoll = useCallback(async () => {
        try {
            const response = await fetch(`/poll?userId=${user.id}`);
            const newMessages = (await response.json()) as Message[];

            onBeforeReceiveMessages?.();
            updateMessages(newMessages);

            longPoll();
        } catch {
            setTimeout(() => {
                loadHistory();
                longPoll();
            }, 2000);
        }
    }, [user, onBeforeReceiveMessages, updateMessages, loadHistory]);


    useEffect(() => {
        if (user) {
            loadHistory();
            longPoll();
        }
    }, [user]);

    const sendMessage = useCallback(
        (text: string) => {
            const message: Message = {
                id: nanoid(),
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
            updateMessages([message]);
        },
        [user, updateMessages],
    );

    return {
        messages: sortMessages(Object.values(messages)),
        sendMessage,
    };
};
