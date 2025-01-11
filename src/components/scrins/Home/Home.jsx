import React, {useEffect, useState} from 'react';
import './Home.css';

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:7293/ws');
        setWs(socket);

        socket.onmessage = (event) => {
            const newMessage = event.data;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }

        socket.onerror = (error) => {
            console.error("Websocket error: ", error);
        }

        socket.onclose = () => {
            console.log("Websocket closed");
        }

        return () => {
            socket.close();
        }
    }, [])



    const handleSendMessage = () => {
        if (ws && inputValue.trim()) {
            ws.send(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="center">
            <div className="form-container">
                <div className="message-container">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div key={index} className="message">
                                {msg}
                            </div>
                        ))
                    ) : (
                        <div className="no-messages">Сообщений пока нет</div>
                    )}
                </div>

                <div className="form">
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Введите сообщение..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                    <div className="button-container">
                        <button type="button" onClick={handleSendMessage}>
                            Отправить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
