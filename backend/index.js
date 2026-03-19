const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const db = require('./db');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

//REST-Endpoints
//Create or receive user by username

app.post('/users', async (req, res) => {
  const { username } = req.body;

  if (!username || username.trim().length === 0) {
    return res.status(400).json({ error: 'Username cant be empty' });
  }
  if (username.trim().length > 50) {
    return res.status(400).json({ error: 'Username is too long (max 50 Symbols)' });
  }

  try {
    const user = await db.upsertUser(username.trim());
    res.json(user);
  } catch (err) {
    console.error('[POST /users]', err.message);
    res.status(500).json({ error: 'DB failure' });
  }
});

//Receive last 50 messages of the room

app.get('/rooms/:room/messages', async (req, res) => {
  try {
    const messages = await db.getMessages(req.params.room);
    res.json(messages);
  } catch (err) {
    console.error('[GET /messages]', err.message);
    res.status(500).json({ error: 'DB failure' });
  }
});

//Receive a list of active room users

app.get('/rooms/:room/users', (req, res) => {
  const room = req.params.room;
  const users = getActiveUsers(room);
  res.json(users);
});

//Active Users
//Map: socketId {username, room}

const connectedUsers = new Map();

function getActiveUsers(room) {
  const users = [];
  for (const [, data] of connectedUsers) {
    if (data.room === room) {
      users.push(data.username);
    }
  }
  return users;
}

//Socket.io events

io.on('connection', (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  //Client joins a room
  socket.on('join_room', async ({ username, room }) => {
    if (!username || !room) return;

    //Leave all old rooms if there are ones
    const prev = connectedUsers.get(socket.id);
    if (prev) {
      socket.leave(prev.room);
      io.to(prev.room).emit('user_left', {
        username: prev.username,
        activeUsers: getActiveUsers(prev.room).filter(u => u !== prev.username)
      });
    }

    //Join a new room
    socket.join(room);
    connectedUsers.set(socket.id, { username, room });

    console.log(`[Socket] ${username} joined the "${room}"`);

    //Show a joined user
    io.to(room).emit('user_joined', {
      username,
      activeUsers: getActiveUsers(room)
    });
  });

  //Client sends a message
  socket.on('send_message', async ({ username, room, content }) => {
    if (!username || !room || !content?.trim()) return;

    try {
      const message = await db.saveMessage(username, room, content.trim());

      //Send message to everyone in the Room (the one who sended too)
      io.to(room).emit('new_message', message);
    } catch (err) {
      console.error('[send_message]', err.message);
      socket.emit('error', { message: 'Message cant be saved' });
    }
  });

  //Disconn.
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.delete(socket.id);
      io.to(user.room).emit('user_left', {
        username: user.username,
        activeUsers: getActiveUsers(user.room)
      });
      console.log(`[Socket] ${user.username} has been disconnected`);
    }
  });
});

//Server start
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend is on ${PORT}`);
});
