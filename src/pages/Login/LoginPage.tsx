import { FC, FormEventHandler, useCallback } from "react";

import "./LoginPage.css";

type LoginPageProps = {
    onSetUser: (name: string) => void;
};

export const LoginPage: FC<LoginPageProps> = ({ onSetUser }) => {
    const handleFormSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
        (event) => {
            event.preventDefault();

            const form = event.target as HTMLFormElement;
            const nameInput = form.elements.namedItem(
                "name",
            ) as HTMLInputElement;

            onSetUser(nameInput.value);
        },
        [onSetUser],
    );

    return (
        <form onSubmit={handleFormSubmit} className="LoginForm">
            <label htmlFor="name">Enter name:</label>
            <input id="name" name="name" />
        </form>
    );
};
