import React, { useState, useEffect } from "react";
import axios from "./axioscopy";
import { Link } from "react-router-dom";

export default function () {
  const [users, setUsers] = useState();
  const [userSearch, setUserSearch] = useState("search for...");
  const [latestUsersMessage, setLatestUsersMessage] = useState();

  useState(() => {
    console.log("use state should run here");
  });

  useEffect(() => {
    axios.get("/api/users").then((response) => {
      setUsers(response.data);
      setLatestUsersMessage(true);
    });
  }, []);

  useEffect(() => {
    if (`${userSearch}` == "search for...") {
      return;
    } else if (`${userSearch}` == "") {
      axios.get("/api/users").then((response) => {
        setLatestUsersMessage(true);
        setUsers(response.data);
      });
    } else {
      axios.get(`/api/usersearch/${userSearch}`).then((response) => {
        setUsers(response.data);
        setLatestUsersMessage(false);
      });
    }
  }, [userSearch]);

  return (
    <div className="FindPeople">
      <div className="welcomeHeader">Looking for a furry friend?</div>

      <input
        className="findUserInput"
        onChange={(e) => setUserSearch(e.target.value)}
        name="finduser"
        type="text"
        placeholder={userSearch}
      />

      {latestUsersMessage && <h1>Check out our newest users!</h1>}
      {users &&
        users.map((user) => (
          <div className="findPeopleCard" key={user.id}>
            <Link to={`/user/${user.id}`}>
              <h1>
                {user.first} {user.last}
              </h1>
              <img
                className="profilePic"
                src={user.imageurl || "default.png"}
                alt={`${user.first} ${user.last}`}
              />
            </Link>
            <p>{user.bio}</p>
          </div>
        ))}
    </div>
  );
}
