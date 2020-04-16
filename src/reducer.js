// src/reducer.js

export default function (state = {}, action) {
  if (action.type == "RECEIVE_FRIENDS") {
    state = Object.assign({}, state, {
      friendships: action.friends,
    });
  }

  if (action.type == "ACCEPT_FRIEND_REQUEST") {
    state = {
      ...state,
      friendships: state.friendships.map((friend) => {
        if (friend.id == action.acceptedFriendId) {
          return {
            ...friend,
            accepted: true,
          };
        } else {
          return friend;
        }
      }),
    };
  }

  if (action.type == "UNFRIEND") {
    state = {
      ...state,
      friendships: state.friendships.filter(
        (friend) => friend.id != action.deletedFriendId
      ),
    };
  }

  if (action.type == "CHAT_MESSAGES") {
    state = {
      ...state,
      messages: action.messages,
    };
  }

  if (action.type == "NEW_MESSAGE") {
    state = {
      ...state,
      messages: [...state.messages, action.newMessage],
    };
  }

  if (action.type == "NEW_USER_JOINED") {
    state = {
      ...state,
      onlineUsers: action.onlineUsers,
    };
  }

  if (action.type == "WALL_POSTS") {
    state = {
      ...state,
      posts: action.posts,
    };
  }

  if (action.type == "NEW_WALL_POST") {
    state = {
      ...state,
      posts: [action.newPost, ...state.posts],
    };
  }
  return state;
}
