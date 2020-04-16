DROP TABLE IF EXISTS users CASCADE ;
DROP TABLE IF EXISTS password_reset_codes;
DROP TABLE IF EXISTS friendships;


CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first != ''),
      last VARCHAR(255) NOT NULL CHECK (last != ''),
      email VARCHAR(255) NOT NULL UNIQUE,
      imageurl VARCHAR,
      bio VARCHAR(255),
      password VARCHAR(255) NOT NULL CHECK (password != ''),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE password_reset_codes(
    id SERIAL PRIMARY KEY,
    code VARCHAR,
    email VARCHAR,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE friendships (
     id SERIAL PRIMARY KEY,
     receiver_id INT NOT NULL REFERENCES users(id),
     sender_id INT NOT NULL REFERENCES users(id),
     accepted BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

CREATE TABLE chats (
     id SERIAL PRIMARY KEY,
     message VARCHAR(255) NOT NULL CHECK (message != ''),
     sender_id INT NOT NULL REFERENCES users(id),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

 CREATE TABLE wall (
     id SERIAL PRIMARY KEY,
     post VARCHAR(255) NOT NULL CHECK (post != ''),
     receiver_id INT NOT NULL REFERENCES users(id),
     sender_id INT NOT NULL REFERENCES users(id),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

 )
