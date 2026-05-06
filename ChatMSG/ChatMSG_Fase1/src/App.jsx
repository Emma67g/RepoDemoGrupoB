import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// Conexión con el Backend
const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on("message_history", (history) => {
      setMessageList(history);
    });

    socket.on("receive_message", (data) => {
      setMessageList((prev) => [...prev, data]);
    });

    return () => {
      socket.off("message_history");
      socket.off("receive_message");
    };
  }, []);

  const joinChat = () => {
    if (username.trim() !== "") {
      setIsJoined(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim() !== "") {
      const messageData = {
        id: Date.now() + Math.random(),
        author: username,
        text: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      socket.emit("send_message", messageData);
      setCurrentMessage(""); 
    }
  };

  // Pantalla 1: Ingresar nombre
  if (!isJoined) {
    return (
      <div className="join-container">
        <h2>Bienvenido al Chat</h2>
        <input
          type="text"
          placeholder="Escribe tu nombre..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && joinChat()}
        />
        <button onClick={joinChat}>Entrar</button>
      </div>
    );
  }

  // Pantalla 2: Interfaz del chat
  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Chat en vivo | Usuario: {username}</p>
      </div>
      
      <div className="chat-body">
        {messageList.map((msg) => {
          const isMe = msg.author === username;
          return (
            <div key={msg.id} className={`message-container ${isMe ? "me" : "other"}`}>
              <div className="message">
                {!isMe && <span className="author">{msg.author}</span>}
                <p className="text">{msg.text}</p>
                <span className="time">{msg.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      <form className="chat-footer" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;