const mysql = require('mysql2/promise');

//Conn. Pool (Conn. - connection)
//This pool controls different conns at the same time and instead of reconnecting every time, a free connection is fetched from the pool.
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  database: process.env.DB_NAME     || 'chatdb',
  user:     process.env.DB_USER     || 'chatuser',
  password: process.env.DB_PASSWORD || 'user123',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//Test the conn to the db
pool.getConnection()
  .then(conn => {
    console.log('[DB] conn succsessful');
    conn.release();
  })
  .catch(err => {
    console.error('[DB] conn failure:', err.message);
  });

//Users
//Creates a new user or gives the defined(existing) one back and "INSERT IGNORE" ignores the error if Username already exists 

async function upsertUser(username) {
  await pool.execute(
    'INSERT IGNORE INTO users (username) VALUES (?)',
    [username]
  );
  const [rows] = await pool.execute(
    'SELECT id, username, created_at FROM users WHERE username = ?',
    [username]
  );
  return rows[0];
}

//Messages
//Saves a message and gives it back with a Username of the sender

async function saveMessage(username, room, content) {
  //And at first we receive the User-ID or create a new one
  const user = await upsertUser(username);

  const [result] = await pool.execute(
    'INSERT INTO messages (user_id, room, content) VALUES (?, ?, ?)',
    [user.id, room, content]
  );

  return {
    id:         result.insertId,
    username:   user.username,
    room,
    content,
    created_at: new Date().toISOString()
  };
}

//Gives back last 50 messages (the old ones at first)

async function getMessages(room, limit = 50) {
  const [rows] = await pool.execute(
    `SELECT m.id, u.username, m.room, m.content, m.created_at
     FROM messages m
     JOIN users u ON m.user_id = u.id
     WHERE m.room = ?
     ORDER BY m.created_at DESC
     LIMIT ?`,
    [room, limit]
  );
  //DESC so that LIMIT fetches the latest, then reverse for chronological order
  return rows.reverse();
}

module.exports = { upsertUser, saveMessage, getMessages };
