function myReducer(state, action) {
  if (action.type == "UPDATE_BIO") {
    {
      state = {
        ...state,
        user: {
          ...state.user,
          bio: action.bio,
        },
      };
    }
  }
  if (action.type == "SHOW_UPLOADER") {
    state = {
      ...state,
      uploadVisible: true,
    };
  }
  return state;
}

function updateBio(bio) {
  return axios
    .post("/bio", {
      bio,
    })
    .then(() => {
      return {
        type: "UPDATE_BIO",
        bio: bio,
      };
    });
}

///////REDUCER

export default function (state = {}, action) {
  if (action.type == "RECEIVE_USERS") {
    state = {
      ...state,
      users: action.users,
    };
  }
  if (action.type == "MAKE_HOT" || action.type == "MAKE_NOT") {
    state = {
      ...state,
      users: state.users.map((user) => {
        if (user.id == action.id) {
          return {
            ...user,
            hot: (action.type = "MAKE_HOT"),
          };
        } else {
          return user;
        }
      }),
    };
  }

  console.log(state);
  return state;
}

////ACTION
export async function makeHot(id) {
  await axios.post("/hot/" + id);
  return {
    type: "MAKE_HOT",
    id,
  };
}

export async function makeNot(id) {
  await axios.post("/not/" + id);
  return {
    type: "MAKE_NOT",
    id,
  };
}
