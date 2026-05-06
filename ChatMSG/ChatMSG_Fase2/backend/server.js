import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

const app = express();

// 1. CORS configurado para permitir Cookies
app.use(cors({
  origin: "http://localhost:5173", // Puerto de Vite
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);

// 2. Socket.io configurado para permitir Cookies
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// 3. Conexión a Redis Remoto (Pub/Sub)
// 🔴 REEMPLAZA ESTA URL POR LA TUYA DE UPSTASH / REDIS CLOUD
const REDIS_URL = "redis://127.0.0.1:6379";

const pubClient = createClient({ url: REDIS_URL });
const subClient = pubClient.duplicate();

// Conectar a Redis y enlazarlo con Socket.io
await Promise.all([pubClient.connect(), subClient.connect()]);
io.adapter(createAdapter(pubClient, subClient));

console.log("Conectado a Redis exitosamente.");

// 4. Endpoint HTTP para generar la cookie httpOnly
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Nombre requerido" });

  // Se crea la cookie httpOnly (no accesible desde JavaScript en el navegador)
  res.cookie('chat_session', username, {
    httpOnly: true,
    secure: false, // En producción (HTTPS) debe ser true
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 // 1 hora
  });

  res.json({ success: true, username });
});

// 5. Middleware de WebSockets: Bloquear si no hay cookie
io.use((socket, next) => {
  const cookies = socket.request.headers.cookie;
  if (cookies && cookies.includes('chat_session=')) {
    next(); // Cookie detectada, pasa el filtro
  } else {
    next(new Error("Acceso denegado. No hay cookie de sesión."));
  }
});

// 6. Lógica en Tiempo Real (Sin persistencia)
io.on('connection', (socket) => {
  const serverPort = process.env.PORT || 3001;
  console.log(`Usuario conectado al Nodo ${serverPort} | ID: ${socket.id}`);

  socket.on('send_message', (data) => {
    // Al no haber persistencia, solo reenviamos en el momento.
    // El adaptador de Redis se encarga de enviarlo a TODOS los servidores.
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado del Nodo ${serverPort} | ID: ${socket.id}`);
  });
});

// 7. Arrancar servidor en puerto dinámico
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor Node corriendo en el puerto ${PORT}`);
});