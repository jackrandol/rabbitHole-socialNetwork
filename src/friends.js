import React, { useEffect } from "react";
import receiveFriends from "./actions.js";
import { acceptFriendRequest, unfriend } from "./actions.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function friends() {
    const dispatch = useDispatch();

    const friends = useSelector(
        state =>
            state.friendships &&
            state.friendships.filter(friend => {
                return friend.accepted == true;
            })
    );

    const friendRequests = useSelector(
        state =>
            state.friendships &&
            state.friendships.filter(friendRequest => {
                return friendRequest.accepted == false;
            })
    );

    useEffect(() => {
        dispatch(receiveFriends());
        console.log("friends", friends);
    }, []);

    if (!friends) {
        return null;
    }

    if (!friendRequests) {
        return null;
    }

    return (
        <div>
        <h1 className="welcomeHeader">Friends</h1>
            <div className="friendsBox">
                {friends &&
                    friends.map(friend => (
                        <div className="findPeopleCard" key={friend.id}>
                            <h1>
                                {friend.first} {friend.last}
                            </h1>
                            <Link to={`/user/${friend.id}`}>
                                <img
                                    className="profilePic"
                                    src={friend.imageurl || "default.png"}
                                    alt={`${friend.first} ${friend.last}`}
                                />
                            </Link>
                            <button
                                onClick={() => dispatch(unfriend(friend.id))}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
            </div>
            <h1 className="welcomeHeader">Friend Requests</h1>
            <div className="friendRequestBox">
                {friendRequests &&
                    friendRequests.map(friendRequest => (
                        <div className="findPeopleCard" key={friendRequest.id}>
                            <h1>
                                {friendRequest.first} {friendRequest.last}
                            </h1>
                            <Link to={`/user/${friendRequest.id}`}>
                                <img
                                    className="profilePic"
                                    src={
                                        friendRequest.imageurl || "default.png"
                                    }
                                    alt={`${friendRequest.first} ${friendRequest.last}`}
                                />
                            </Link>
                            <button
                                onClick={() =>
                                    dispatch(
                                        acceptFriendRequest(friendRequest.id)
                                    )
                                }
                            >
                                Accept Friend Request
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
