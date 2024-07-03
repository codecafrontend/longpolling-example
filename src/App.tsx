import { useCallback, useState } from "react";
import "./App.css";
import { UserContext } from "./core/UserContext";
import { LoginPage } from "./pages/Login/LoginPage";
import { ChatPage } from "./pages/Chat/ChatPage";
import { getSavedUser, saveUser } from "./core/lib";

function App() {
    const [username, setUsername] = useState<string>(getSavedUser());

    const handleUser = useCallback((value: string) => {
        setUsername(value);
        saveUser(value);
    }, []);

    return (
        <UserContext.Provider value={{ user: username }}>
            {!username && <LoginPage onSetUser={handleUser} />}
            {username && <ChatPage />}
        </UserContext.Provider>
    );
}

export default App;
