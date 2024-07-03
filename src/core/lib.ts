import { Message } from "./useMessages";

const USER_KEY = "chat_user";

export const getSavedUser = () => sessionStorage.getItem(USER_KEY) ?? "";

export const saveUser = (user: string) =>
    sessionStorage.setItem(USER_KEY, user);

export const sortMessages = (messages: Message[]) =>
    messages.slice().sort((a, b) => {
        const aDate = new Date(a.timestamp);
        const bDate = new Date(b.timestamp);

        if (aDate < bDate) {
            return -1;
        }
        if (aDate > bDate) {
            return 1;
        }
        return 0;
    });
