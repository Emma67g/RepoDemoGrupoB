import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// Simulamos que el usuario cae aleatoriamente en el servidor 1 (3001) o servidor 2 (3002)
const TARGET_PORT = Math.random() > 0.5 ? 3001 : 3002;
const TARGET_URL = `http://localhost:${TARGET_PORT}`;

// Preparamos el socket PERO no lo conectamos aún (autoConnect: false)
const socket = io(TARGET_URL, {
  withCredentials: true, // Obligatorio para enviar la cookie de vuelta
  autoConnect: false
});

function App() {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((prev) => [...prev, data]);
    });

    socket.on("connect_error", (err) => {
      console.error("Error de conexión:", err.message);
    });

    return () => {
      socket.off("receive_message");
      socket.off("connect_error");
    };
  }, []);

  const joinChat = async () => {
    if (username.trim() !== "") {
      try {
        // 1. Pedimos la cookie httpOnly al backend
        const response = await fetch(`${TARGET_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
          credentials: "include" // Guarda la cookie devuelta en el navegador
        });

        if (response.ok) {
          setIsJoined(true);
          // 2. Con la cookie guardada, ahora sí conectamos el WebSocket
          socket.connect(); 
        }
      } catch (error) {
        console.error("Error al hacer login:", error);
      }
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim() !== "") {
      const messageData = {
        id: Date.now() + Math.random(),
        author: username,
        text: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fromNode: TARGET_PORT // Para visualizar desde qué nodo se procesó
      };

      socket.emit("send_message", messageData);
      setCurrentMessage(""); 
    }
  };

  if (!isJoined) {
    return (
      <div className="join-container">
        <h2>Fase 2: Redis + Cookies</h2>
        <input
          type="text"
          placeholder="Escribe tu nombre..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && joinChat()}
        />
        <button onClick={joinChat}>Entrar al Chat</button>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Usuario: {username} | Nodo Asignado: {TARGET_PORT}</p>
      </div>
      
      <div className="chat-body">
        {messageList.map((msg) => {
          const isMe = msg.author === username;
          return (
            <div key={msg.id} className={`message-container ${isMe ? "me" : "other"}`}>
              <div className="message">
                {!isMe && <span className="author">{msg.author} (vía {msg.fromNode})</span>}
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
          placeholder="Mensaje..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;