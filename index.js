const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./public/db.js");
const { hash, compare } = require("./bc.js");
const cookieSession = require("cookie-session");
const ses = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const s3 = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
//for heroku you can use { origins: 'localhost:8080 mysocialnetworkapp.herokuapp.com:* }

const diskStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function (req, file, callback) {
    uidSafe(24).then(function (uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  },
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152,
  },
});

const cookieSessionMiddleware = cookieSession({
  secret: `I'm always angry.`,
  maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
  cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(compression());

app.use(
  express.urlencoded({
    extendend: false,
  })
);

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.json());

app.use(require("csurf")());

app.use((req, res, next) => {
  res.set("x-frame-option", "deny");
  res.cookie("mytoken", req.csrfToken());
  next();
});

if (process.env.NODE_ENV != "production") {
  app.use(
    "/bundle.js",
    require("http-proxy-middleware")({
      target: "http://localhost:8081/",
    })
  );
} else {
  app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", (req, res) => {
  if (req.session.userId) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

app.post("/registration", async (req, res) => {
  const { first, last, email, password } = req.body;
  try {
    const hashedPassword = await hash(password);
    const response = await db.addUser(first, last, email, hashedPassword);

    req.session.userId = response.rows[0].id;
    res.json(response.rows[0]);
  } catch (err) {
    console.log("error in catch post /registration", err);
    res.sendStatus(500);
  }
});

app.post("/login", (req, res) => {
  const userPWInput = req.body.password;

  db.getPassword(req.body.email)
    .then((results) => {
      console.log("results.rows:", results.rows);

      compare(userPWInput, results.rows[0].password).then((matchValue) => {
        console.log("matchValue of compare:", matchValue);

        if (matchValue == true) {
          req.session.userId = results.rows[0].id;

          console.log(
            "req.session.userId after true match:",
            req.session.userId
          );
          res.json(results.rows[0]);
        } else {
          res.sendStatus(500);
        }
      });
    })
    .catch((error) => {
      console.log("error in catch post /login:", error);
      res.json(error);
    });
});

app.post("/reset", (req, res) => {
  console.log(req.body);

  const secretCode = cryptoRandomString({
    length: 6,
  });
  let subject = "Reset Password for Social Network Now!";
  let text =
    "Dear User,  You have requested to change your password. " +
    secretCode +
    " is your code to change your password. Thanks BYE!!!";

  db.getUserByEmail(req.body.email)
    .then((results) => {
      console.log("results from db query by email", results.rows[0].id);
      db.addCodeToTable(secretCode, req.body.email)
        .then(() => {
          ses.sendEmail(req.body.email, subject, text);
          res.sendStatus(200);
        })
        .catch((error) => {
          console.log("error in catch post /reset:", error);
          res.sendStatus(500);
        });
    })
    .catch((error) => {
      console.log("error in catch post /reset:", error);
      res.sendStatus(500);
    });
});

app.post("/resetPassword", (req, res) => {
  console.log("body from resetPassword post", req.body.code);
  db.getCode(req.body.email).then((response) => {
    console.log("response from db.checkCode:", response);

    let lastIndex = response.rows.length - 1;

    if (req.body.code == response.rows[lastIndex].code) {
      hash(req.body.newpassword)
        .then((hashedPassword) => {
          db.updatePassword(hashedPassword, req.body.email);
          res.sendStatus(200);
        })
        .catch((error) => {
          console.log("error updating password although code was good", error);
        });
    } else {
      res.sendStatus(500);
    }
  });
});

app.get("/user", (req, res) => {
  let userId = req.session.userId;
  db.getUser(userId).then((response) => {
    const { id, bio, first, last, imageurl } = response.rows[0];
    res.json({
      id: id,
      first: first,
      last: last,
      image: imageurl || "/default.png",
      bio: bio,
    });
  });
});

app.post("/bio", (req, res) => {
  let userId = req.session.userId;
  db.addBio(req.body.bioInputField, userId).then((response) => {
    res.json(response);
  });
});

app.post("/uploadImage", uploader.single("file"), s3.upload, (req, res) => {
  let userId = req.session.userId;

  let fileUrl = "https://s3.amazonaws.com/littlegremlin/" + req.file.filename;
  db.addImage(fileUrl, userId)
    .then(function (response) {
      res.json(response.rows);
    })
    .catch(function (error) {
      return res.json(error);
    });
});

app.get("/logOut", (req, res) => {
  req.session.userId = null;
  res.sendStatus(200);
});

app.get("/user/:id.json", (req, res) => {
  let userId = req.session.userId;

  db.getUser(req.params.id).then((response) => {
    const { id, bio, first, last, imageurl } = response.rows[0];

    if (userId == id) {
      return res.sendStatus(404);
    } else {
      res.json({
        id: id,
        first: first,
        last: last,
        image: imageurl || "/default.png",
        bio: bio,
      });
    }
  });
});

app.get("/api/users", (req, res) => {
  db.getLatestUsers().then((response) => {
    res.json(response.rows);
  });
});

app.get("/api/usersearch/:userSearch", (req, res) => {
  db.getUserSearch(req.params.userSearch).then((response) => {
    res.json(response.rows);
  });
});

app.get("/initial-friendship-status/:otherUserId", (req, res) => {
  let userId = req.session.userId;

  db.getInitialFriendshipStatus(userId, req.params.otherUserId).then(
    (response) => {
      res.json(response.rows);
    }
  );
});

app.post(`/make-friend-request/:otherUserId`, (req, res) => {
  let userId = req.session.userId;

  db.makeFriendRequest(userId, req.params.otherUserId).then((response) => {
    res.json(response.rows);
  });
});

app.post(`/cancel-friendship/:otherUserId`, (req, res) => {
  let userId = req.session.userId;

  db.cancelFriendship(userId, req.params.otherUserId).then((response) => {
    res.json(req.params.otherUserId);
  });
});

app.post(`/accept-friend-request/:otherUserId`, (req, res) => {
  let userId = req.session.userId;

  db.acceptFriend(userId, req.params.otherUserId).then((response) => {
    res.json(req.params.otherUserId);
  });
});

app.get("/friendsWannabes", (req, res) => {
  let userId = req.session.userId;

  db.getFriendsWannabes(userId).then((response) => {
    res.json(response.rows);
  });
});

app.get("/wallPosts/:otherUserId", (req, res) => {
  let otherUserId;

  if (req.params.otherUserId) {
    otherUserId = req.params.otherUserId;
    db.getWallPosts(otherUserId).then((response) => {
      res.json(response.rows.reverse());
    });
  } else {
    otherUserId = req.session.userId;
    db.getWallPosts(otherUserId).then((response) => {
      res.json(response.rows.reverse());
    });
  }
});

app.post("/wallPost/:otherUserId/:post", (req, res) => {
  let newWallPostData = {};
  db.getUser(req.session.userId).then((response) => {
    let { first, last, imageurl } = response.rows[0];
    newWallPostData.first = first;
    newWallPostData.last = last;
    newWallPostData.imageurl = imageurl;

    db.newWallPost(
      req.session.userId,
      req.params.post,
      req.params.otherUserId
    ).then((response) => {
      let { id, post, receiver_id, sender_id, created_at } = response.rows[0];
      newWallPostData.id = id;
      newWallPostData.post = post;
      newWallPostData.receiver_id = receiver_id;
      newWallPostData.sender_id = sender_id;
      newWallPostData.created_at = created_at;
      console.log("newWallPostData", newWallPostData);
      res.json(newWallPostData);
    });
  });
});

///// DONT TOUCH THIS! ////
app.get("*", function (req, res) {
  if (!req.session.userId) {
    res.redirect("/welcome");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

server.listen(8080, function () {
  console.log("I'm listening.");
});

const onlineUsers = [];

io.on("connection", function (socket) {
  console.log(`A socket with the id ${socket.id} just connected`);
  const userId = socket.request.session.userId;
  if (!socket.request.session.userId) {
    return socket.disconnect(true);
  }

  if (!Object.values(onlineUsers).includes(userId)) {
    db.getUser(userId).then((data) => {
      const { id, first, last, imageurl } = data.rows[0];
      let newUserJoined = {};
      newUserJoined.id = id;
      newUserJoined.first = first;
      newUserJoined.last = last;
      newUserJoined.imageurl = imageurl;
      onlineUsers.push(newUserJoined);
      io.sockets.emit("newUserJoined", onlineUsers);
    });
  }

  db.getLastTenChatMessages().then((data) => {
    io.sockets.emit("chatMessages", data.rows.reverse());
  });

  socket.on("newMessage", (newMsg) => {
    let newMessageData = {};

    db.getUser(userId).then((data) => {
      const { first, last, imageurl } = data.rows[0];
      newMessageData.first = first;
      newMessageData.last = last;
      newMessageData.imageurl = imageurl;

      db.newMessage(newMsg, userId).then((data) => {
        const { id, message, created_at, sender_id } = data.rows[0];

        newMessageData.id = id;
        newMessageData.message = message;
        newMessageData.created_at = created_at;
        newMessageData.sender_id = sender_id;

        io.sockets.emit("newMessage", newMessageData);
      });
    });
  });

  socket.on("disconnect", () => {
    for (var i = 0; i < onlineUsers.length; i++) {
      if (onlineUsers[i].id == userId) {
        onlineUsers.splice(i, 1);
      }
    }
    io.sockets.emit("newUserJoined", onlineUsers);
    console.log(`A socket with the id ${socket.id} just disconnected`);
  });
});
