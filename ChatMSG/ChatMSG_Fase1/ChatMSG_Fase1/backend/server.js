import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

// Configuración de WebSockets
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Puerto por defecto de Vite
    methods: ["GET", "POST"]
  }
});

// Arreglo para guardar mensajes en memoria (se borra al apagar el servidor)
let messageHistory = [];

io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Enviar historial al usuario recién conectado
  socket.emit('message_history', messageHistory);

  // Escuchar cuando llega un mensaje nuevo
  socket.on('send_message', (data) => {
    messageHistory.push(data);
    
    // Límite de 100 mensajes para no llenar la memoria RAM
    if (messageHistory.length > 100) messageHistory.shift();

    // Reenviar a todos los usuarios
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor de chat corriendo en http://localhost:${PORT}`);
});