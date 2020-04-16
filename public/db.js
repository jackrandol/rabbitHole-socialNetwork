const spicedPg = require("spiced-pg");

const db = spicedPg(
  process.env.DATABASE_URL ||
    `postgres://postgres:postgres@localhost:5432/socialnetwork`
);

exports.addUser = function (first, last, email, password) {
  return db.query(
    `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, first, last, email, password`,
    [first, last, email, password]
  );
};

exports.getPassword = function (inputEmail) {
  return db.query(`SELECT password, id FROM users WHERE email = $1`, [
    inputEmail,
  ]);
};

exports.getUserByEmail = function (email) {
  return db.query(`SELECT id FROM users WHERE email = $1`, [email]);
};

exports.addCodeToTable = function (secretCode, email) {
  return db.query(
    `INSERT INTO password_reset_codes (code, email)
        VALUES ($1, $2)`,
    [secretCode, email]
  );
};

exports.getCode = function (email) {
  return db.query(
    `SELECT code FROM password_reset_codes
        WHERE CURRENT_TIMESTAMP - create_at < INTERVAL '10' MINUTE
        AND email = $1 `,
    [email]
  );
};

exports.updatePassword = function (newPassword, email) {
  return db.query(
    `UPDATE users SET password = $1
        WHERE email = $2`,
    [newPassword, email]
  );
};

exports.getUser = function (userId) {
  return db.query(
    `SELECT * FROM users
        WHERE id = $1`,
    [userId]
  );
};

exports.addImage = function (url, userId) {
  return db.query(
    `UPDATE users SET imageurl = $1
        WHERE id = $2
        RETURNING id, first, last, imageurl`,
    [url, userId]
  );
};

exports.addBio = function (bioText, userId) {
  return db.query(
    `UPDATE users SET bio = $1
        WHERE id = $2
        RETURNING id, bio`,
    [bioText, userId]
  );
};

exports.findMatching = function (val) {
  return db.query(
    `SELECT * FROM users
        WHERE first ILIKE $1`,
    [val + "%"]
  );
};

exports.getLatestUsers = function () {
  return db.query(
    `SELECT id, first, last, imageurl, bio, created_at FROM users
        ORDER BY created_at DESC
        LIMIT 3`
  );
};

exports.getUserSearch = function (val) {
  return db.query(
    `SELECT id, first, last, imageurl, bio, created_at
        FROM users
        WHERE first ILIKE $1;`,
    [val + "%"]
  );
};

exports.getInitialFriendshipStatus = function (userId, otherUserId) {
  return db.query(
    `SELECT * FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
    [userId, otherUserId]
  );
};

exports.makeFriendRequest = function (userId, otherUserId) {
  return db.query(
    `INSERT INTO friendships (sender_id, receiver_id)
        VALUES ($1, $2)`,
    [userId, otherUserId]
  );
};

exports.cancelFriendship = function (userId, otherUserId) {
  return db.query(
    `DELETE FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
    [userId, otherUserId]
  );
};

exports.acceptFriend = function (userId, otherUserId) {
  return db.query(
    `UPDATE friendships SET accepted = true
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
    [userId, otherUserId]
  );
};

exports.getFriendsWannabes = function (userId) {
  return db.query(
    `SELECT users.id, first, last, imageurl, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)`,
    [userId]
  );
};

exports.getLastTenChatMessages = function () {
  return db.query(
    `SELECT chats.id, chats.message, chats.sender_id, chats.created_at, users.first, users.last, users.imageurl
        FROM chats
        LEFT JOIN users
        ON chats.sender_id = users.id
        ORDER BY created_at DESC
        LIMIT 10`
  );
};

exports.newMessage = function (message, sender_id) {
  return db.query(
    `INSERT INTO chats (message, sender_id)
        VALUES ($1, $2)
        RETURNING *`,
    [message, sender_id]
  );
};

exports.newWallPost = function (sender_id, post, receiver_id) {
  return db.query(
    `INSERT INTO wall (sender_id, post, receiver_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
    [sender_id, post, receiver_id]
  );
};

exports.getWallPosts = function (otherUserId) {
  return db.query(
    `SELECT wall.id, wall.post, wall.sender_id, wall.receiver_id, wall.created_at,users.first, users.last, users.imageurl
        FROM wall
        LEFT JOIN users
        ON wall.sender_id = users.id
        WHERE (receiver_id = $1)
        ORDER BY created_at ASC`,
    [otherUserId]
  );
};
