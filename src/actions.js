// src/actions.js
import axios from "./axioscopy";

export default async function receiveFriends() {
  const { data } = await axios.get("/friendsWannabes");

  return {
    type: "RECEIVE_FRIENDS",
    friends: data,
  };
}

export async function acceptFriendRequest(otherUserId) {
  const { data } = await axios.post(`/accept-friend-request/${otherUserId}`);

  return {
    type: "ACCEPT_FRIEND_REQUEST",
    acceptedFriendId: data,
  };
}

export async function unfriend(otherUserId) {
  const { data } = await axios.post(`/cancel-friendship/${otherUserId}`);
  return {
    type: "UNFRIEND",
    deletedFriendId: data,
  };
}

export async function chatMessages(messages) {
  return {
    type: "CHAT_MESSAGES",
    messages: messages,
  };
}

export async function newMessage(newMsg) {
  return {
    type: "NEW_MESSAGE",
    newMessage: newMsg,
  };
}

export async function newUserJoined(onlineUsers) {
  return {
    type: "NEW_USER_JOINED",
    onlineUsers: onlineUsers,
  };
}

export async function getWallPosts(otherUserId) {
  const { data } = await axios.get(`/wallPosts/${otherUserId}`);

  return {
    type: "WALL_POSTS",
    posts: data,
  };
}

export async function newWallPost(otherUserId, post) {
  const { data } = await axios.post(`/wallPost/${otherUserId}/${post}`);
  return {
    type: "NEW_WALL_POST",
    newPost: data,
  };
}
