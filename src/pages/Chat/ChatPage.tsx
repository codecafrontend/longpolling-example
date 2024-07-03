import {
    FormEventHandler,
    KeyboardEventHandler,
    useCallback,
    useContext,
    useRef,
} from "react";
import { UserContext } from "../../core/UserContext";

import "./ChatPage.css";
import { useMessages } from "../../core/useMessages";
import { Message } from "./Message/Message";

export function ChatPage() {
    const { user } = useContext(UserContext);

    const { messages, sendMessage } = useMessages();

    const formRef = useRef<HTMLFormElement>(null);

    const handleMessageSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
        (event) => {
            event.preventDefault();

            const form = event.target as HTMLFormElement;
            const messageInput = form.elements.namedItem(
                "message",
            ) as HTMLTextAreaElement;

            if (!messageInput.value) {
                return;
            }

            sendMessage(messageInput.value);
            messageInput.value = "";
        },
        [sendMessage],
    );

    const handleKeydown = useCallback<KeyboardEventHandler>((event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            formRef.current?.requestSubmit();
        }
    }, []);

    return (
        <div className="Chat">
            <h1>
                {user}
                's chat
            </h1>

            <ul className="Chat__messages">
                {messages.map((message, i) => (
                    <li key={i} className="Chat__message">
                        <Message {...message} isSelf={message.user === user} />
                    </li>
                ))}
            </ul>

            <form
                onSubmit={handleMessageSubmit}
                className="Chat__form"
                ref={formRef}
            >
                <textarea
                    id="message"
                    name="message"
                    className="Chat__textarea"
                    placeholder="Start typing a message..."
                    onKeyDown={handleKeydown}
                    autoFocus
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
