import * as io from "socket.io-client";
import { chatMessages, newMessage, newUserJoined } from "./actions";

export let socket;

export const init = (store) => {
  if (!socket) {
    socket = io.connect();

    socket.on("newMessage", (newMsg) => {
      store.dispatch(newMessage(newMsg));
    });

    socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

    socket.on("newUserJoined", (onlineUsers) => {
      store.dispatch(newUserJoined(onlineUsers));
    });
  }
};
