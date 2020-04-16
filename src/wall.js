import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getWallPosts, newWallPost } from "./actions";
import Moment from "react-moment";

export default function Wall({ otherUserId }) {
  const dispatch = useDispatch();

  let wallPosts = useSelector((state) => state && state.posts);

  useEffect(() => {
    dispatch(getWallPosts(otherUserId));
  }, []);

  const keyCheck = (e) => {
    let postData = {
      receiver_id: otherUserId,
    };

    if (e.key === "Enter") {
      e.preventDefault();
      postData.post = e.target.value;
      dispatch(newWallPost(postData.receiver_id, postData.post));

      e.target.value = "";
    }
  };

  if (!wallPosts) {
    return null;
  }

  return (
    <div>
      <h1>Rabbit Chat!</h1>
      <textarea
        className="chatField"
        placeholder="add your message here . . ."
        onKeyDown={keyCheck}
      ></textarea>
      <div className="wall">
        {wallPosts &&
          wallPosts.map((post) => (
            <div className="wallPost" key={post.id}>
              <img
                className="chatProfilePic"
                src={post.imageurl || "default.png"}
                alt={`${post.first} ${post.last}`}
              />
              <div className="wallPostText">
                <div>{post.post}</div>
                <p>
                  from: {post.first} {post.last}
                </p>
                <p className="messageMoment">
                  <Moment fromNow>{post.created_at}</Moment>
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
