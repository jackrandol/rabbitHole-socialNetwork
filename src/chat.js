import React, { useEffect, useRef } from "react";
import { socket } from "./sockets";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";

export function Chat() {
  let chatMessages = useSelector((state) => state && state.messages);

  let onlineUsers = useSelector((state) => state && state.onlineUsers);

  const chat = useRef();

  useEffect(() => {
    setTimeout(() => {
      chat.current.scrollTop =
        chat.current.scrollHeight - chat.current.clientHeight;
      console.log("chatMessages:", chatMessages);
    }, 500);
  }, [chatMessages]);

  const keyCheck = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      socket.emit("newMessage", e.target.value);
      e.target.value = "";
    }
  };

  if (!chatMessages) {
    return null;
  }

  return (
    <div>
      <div className="chatBoard">
        <div className="leftside">
          <div className="allChat">
            <h1 className="chatTitle">Chat Room</h1>
          </div>
          <div className="chat-container" ref={chat}>
            {chatMessages &&
              chatMessages.map((message) => (
                <div className="chatmessage" key={message.id}>
                  <Link to={`/user/${message.sender_id}`}>
                    <img
                      className="chatProfilePic"
                      src={message.imageurl || "default.png"}
                      alt={`${message.first} ${message.last}`}
                    />
                  </Link>
                  <div className="messageText">
                    <p>
                      {message.first} {message.last} says:
                    </p>
                    {message.message}
                    <p className="messageMoment">
                      <Moment fromNow>{message.created_at}</Moment>
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <textarea
            className="chatField"
            placeholder="add your message here . . ."
            onKeyDown={keyCheck}
          ></textarea>
        </div>
        <div className="rightSide">
          <div className="onlineUsers">
            <h1 className="chatTitle">Users Currently Online</h1>
            {onlineUsers &&
              onlineUsers.map((user) => (
                <div className="onlineUser" key={user.id}>
                  <Link to={`/user/${user.id}`}>
                    <img
                      className="chatProfilePic"
                      src={user.imageurl || "default.png"}
                      alt={`${user.first} ${user.last}`}
                    />
                    <p>
                      {user.first} {user.last}
                    </p>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
